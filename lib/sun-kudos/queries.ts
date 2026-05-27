import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { KudosEntry, KudosPerson } from "@/app/page-sun-kudos/mock-data";

interface ProfileRow {
  id: string;
  full_name: string;
  department_id: string | null;
  avatar_url: string | null;
  badge: string | null;
}

interface KudosRow {
  id: string;
  title: string | null;
  content: string;
  hashtags: string[];
  image_urls: string[];
  like_count: number;
  is_highlight: boolean;
  is_anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  sender: ProfileRow | null;
  receiver: ProfileRow | null;
}

const ANONYMOUS_NAME = "Người ẩn danh";

const TZ = "Asia/Ho_Chi_Minh";

// `created_at` → "HH:mm - MM/DD/YYYY" in Vietnam time, independent of the
// server's process timezone (matches Figma B.4.1 spec).
function formatPostedAt(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("hour")}:${get("minute")} - ${get("month")}/${get("day")}/${get("year")}`;
}

function toPerson(row: ProfileRow | null): KudosPerson {
  return {
    name: row?.full_name ?? "Unknown",
    department: row?.department_id ?? "—",
    badge: (row?.badge as KudosPerson["badge"]) ?? "New Hero",
    avatarUrl:
      row?.avatar_url ?? `https://i.pravatar.cc/64?u=${row?.id ?? "unknown"}`,
  };
}

function toEntry(row: KudosRow): KudosEntry {
  // Anonymous kudos hide the sender's identity on the board.
  const sender: KudosPerson = row.is_anonymous
    ? {
        name: row.anonymous_name?.trim() || ANONYMOUS_NAME,
        department: "—",
        badge: "New Hero",
        avatarUrl: `https://i.pravatar.cc/64?u=anon-${row.id}`,
      }
    : toPerson(row.sender);

  return {
    id: row.id,
    sender,
    receiver: toPerson(row.receiver),
    postedAt: formatPostedAt(row.created_at),
    title: row.title ?? "",
    content: row.content,
    hashtags: row.hashtags,
    imageUrls: row.image_urls,
    likeCount: row.like_count,
    isLiked: false,
  };
}

export interface KudosFilters {
  /** Raw hashtag strings (with leading #). Matches kudos containing ANY of them. */
  hashtags?: string[];
  /** department_id — keeps kudos whose RECEIVER belongs to that department. */
  department?: string;
}

// When filtering by department we must INNER-join the receiver so the eq filter
// prunes parent kudos rows (a plain embed would only filter the nested data).
function kudosSelect(department?: string): string {
  const receiverJoin = department
    ? "profiles!receiver_id!inner"
    : "profiles!receiver_id";
  return `
    id, title, content, hashtags, image_urls, like_count, is_highlight,
    is_anonymous, anonymous_name, created_at,
    sender:profiles!sender_id(id, full_name, department_id, avatar_url, badge),
    receiver:${receiverJoin}(id, full_name, department_id, avatar_url, badge)
  `;
}

export async function getAllKudos(
  limit = 20,
  filters?: KudosFilters
): Promise<KudosEntry[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("kudos")
    .select(kudosSelect(filters?.department))
    .order("created_at", { ascending: false })
    .limit(limit);
  if (filters?.hashtags?.length) query = query.overlaps("hashtags", filters.hashtags);
  if (filters?.department) query = query.eq("receiver.department_id", filters.department);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as unknown as KudosRow[]).map(toEntry);
}

export async function getHighlightKudos(
  limit = 5,
  filters?: KudosFilters
): Promise<KudosEntry[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("kudos")
    .select(kudosSelect(filters?.department))
    .order("like_count", { ascending: false })
    .limit(limit);
  if (filters?.hashtags?.length) query = query.overlaps("hashtags", filters.hashtags);
  if (filters?.department) query = query.eq("receiver.department_id", filters.department);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as unknown as KudosRow[]).map(toEntry);
}

export interface SpotlightData {
  totalKudos: number;
  /** Distinct receiver names for the word cloud. */
  names: string[];
  /** Recent activity entries — newest kudos posts rendered as a feed log. */
  activityLog: { time: string; text: string }[];
}

export async function getSpotlightData(): Promise<SpotlightData> {
  const supabase = await createSupabaseServerClient();
  const [totalRes, recentRes, namesRes] = await Promise.all([
    supabase.from("kudos").select("id", { count: "exact", head: true }),
    supabase
      .from("kudos")
      .select(
        `created_at, receiver:profiles!receiver_id(full_name)`
      )
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("profiles")
      .select("full_name")
      .order("created_at", { ascending: true })
      .limit(40),
  ]);

  const totalKudos = totalRes.count ?? 0;
  const names = (namesRes.data ?? []).map((p) => p.full_name);
  const activityLog = (recentRes.data ?? []).map((r) => {
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date(r.created_at))
      .replace(/\s/g, "");
    const receiverObj = r.receiver as unknown as { full_name?: string } | null;
    const receiver = receiverObj?.full_name ?? "Unknown";
    return { time, text: `${receiver} đã nhận được Kudos mới` };
  });

  return { totalKudos, names, activityLog };
}

export interface CurrentUserStats {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  secretBoxOpened: number;
  secretBoxUnopened: number;
}

/**
 * Looks up the current user's profile by email and computes their stats.
 * Secret Box counts are stubbed (no schema yet); kudos counts come from DB.
 */
export async function getCurrentUserStats(): Promise<CurrentUserStats> {
  const fallback: CurrentUserStats = {
    kudosReceived: 0,
    kudosSent: 0,
    heartsReceived: 0,
    secretBoxOpened: 25,
    secretBoxUnopened: 25,
  };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return fallback;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .maybeSingle();
  if (!profile) return fallback;

  const [received, sent, heartsRows] = await Promise.all([
    supabase
      .from("kudos")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", profile.id),
    supabase
      .from("kudos")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", profile.id),
    supabase
      .from("kudos")
      .select("like_count")
      .eq("receiver_id", profile.id),
  ]);

  const heartsReceived = (heartsRows.data ?? []).reduce(
    (sum, row) => sum + (row.like_count ?? 0),
    0
  );

  return {
    kudosReceived: received.count ?? 0,
    kudosSent: sent.count ?? 0,
    heartsReceived,
    secretBoxOpened: 25,
    secretBoxUnopened: 25,
  };
}

export interface GiftRecipient {
  name: string;
  gift: string;
  avatarUrl: string;
}

/**
 * Recent gift recipients — no gift table yet. Returns most-recently-active
 * profiles with a placeholder gift label so the sidebar isn't empty.
 */
export async function getRecentGiftRecipients(limit = 5): Promise<GiftRecipient[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((p) => ({
    name: p.full_name,
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: p.avatar_url ?? `https://i.pravatar.cc/64?u=${p.id}`,
  }));
}

export interface RecipientOption {
  id: string;
  name: string;
  department: string;
  avatarUrl: string;
}

/** All profiles, for the "Viết Kudo" recipient typeahead (client-side filter). */
export async function getRecipientOptions(): Promise<RecipientOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, department_id, avatar_url")
    .order("full_name", { ascending: true });
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.full_name,
    department: p.department_id ?? "—",
    avatarUrl: p.avatar_url ?? `https://i.pravatar.cc/64?u=${p.id}`,
  }));
}

/** Distinct hashtags already used, for the compose-modal suggestion dropdown. */
export async function getHashtagSuggestions(limit = 200): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("kudos").select("hashtags").limit(limit);
  const set = new Set<string>();
  for (const row of data ?? []) {
    for (const tag of (row.hashtags as string[]) ?? []) set.add(tag);
  }
  return Array.from(set).sort();
}

export interface Department {
  id: string;
  name: string;
}

/** Departments for the "Phòng ban" filter dropdown. */
export async function getDepartments(): Promise<Department[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("departments")
    .select("id, name")
    .order("name", { ascending: true });
  return data ?? [];
}
