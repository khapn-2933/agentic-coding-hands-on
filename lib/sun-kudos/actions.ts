"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export interface CreateKudosInput {
  recipientId: string;
  title: string;
  content: string;
  hashtags: string[];
  isAnonymous: boolean;
  anonymousName?: string;
}

export interface CreateKudosResult {
  ok: boolean;
  error?: string;
}

// Normalize a tag to a single leading "#", trimmed.
function normalizeHashtag(tag: string): string {
  const t = tag.trim().replace(/^#+/, "");
  return t ? `#${t}` : "";
}

/**
 * Resolve the current user's profile id, creating a profile row on first use
 * so a freshly-signed-in user can post without manual seeding.
 */
async function resolveSenderProfileId(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const existing = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing.data?.id) return existing.data.id;

  // Fall back to matching a seeded profile by email, then link it to this user.
  if (user.email) {
    const byEmail = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("email", user.email)
      .maybeSingle();
    if (byEmail.data?.id) {
      if (byEmail.data.user_id === user.id) return byEmail.data.id;
      if (!byEmail.data.user_id) {
        // Claim the unlinked seeded profile; verify the row was actually updated
        // (RLS may reject it) before trusting the id.
        const { data: claimed } = await supabase
          .from("profiles")
          .update({ user_id: user.id })
          .eq("id", byEmail.data.id)
          .is("user_id", null)
          .select("id");
        if (claimed && claimed.length > 0) return byEmail.data.id;
      }
      // Email matched a profile owned by someone else — fall through to create.
    }
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Sunner";

  const inserted = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      avatar_url:
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null,
      badge: "New Hero",
    })
    .select("id")
    .single();

  return inserted.data?.id ?? null;
}

export async function createKudos(
  input: CreateKudosInput
): Promise<CreateKudosResult> {
  const content = input.content?.trim() ?? "";
  const title = input.title?.trim() ?? "";
  const anonymousName = input.anonymousName?.trim() ?? "";
  const hashtags = (input.hashtags ?? [])
    .map(normalizeHashtag)
    .filter(Boolean)
    .slice(0, 5);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!isUuid.test(input.recipientId)) return { ok: false, error: "invalid_recipient" };
  if (!content) return { ok: false, error: "missing_content" };
  if (content.length > 2000) return { ok: false, error: "content_too_long" };
  if (title.length > 200) return { ok: false, error: "title_too_long" };
  if (anonymousName.length > 100) return { ok: false, error: "anonymous_name_too_long" };
  if (hashtags.length === 0) return { ok: false, error: "missing_hashtag" };

  const supabase = await createSupabaseServerClient();
  const senderId = await resolveSenderProfileId(supabase);
  if (!senderId) return { ok: false, error: "unauthenticated" };
  if (senderId === input.recipientId) return { ok: false, error: "self_send" };

  const { error } = await supabase.from("kudos").insert({
    sender_id: senderId,
    receiver_id: input.recipientId,
    title: title || null,
    content,
    hashtags,
    image_urls: [],
    is_anonymous: input.isAnonymous,
    anonymous_name: input.isAnonymous ? anonymousName || null : null,
  });

  if (error) {
    // Keep Postgres/RLS internals server-side; hand the client an opaque code.
    console.error("[createKudos] insert failed:", error.message);
    return { ok: false, error: "server_error" };
  }

  revalidatePath("/sun-kudos");
  return { ok: true };
}

export interface ToggleLikeResult {
  ok: boolean;
  liked?: boolean;
  error?: string;
}

/**
 * Toggle the current user's like on a kudos. Inserts/deletes a kudos_likes row
 * (RLS enforces own-profile + no self-like; the PK enforces one-per-user; a
 * trigger keeps kudos.like_count in sync). Returns the resulting liked state.
 */
export async function toggleLike(kudosId: string): Promise<ToggleLikeResult> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!isUuid.test(kudosId)) return { ok: false, error: "invalid_kudos" };

  const supabase = await createSupabaseServerClient();
  const profileId = await resolveSenderProfileId(supabase);
  if (!profileId) return { ok: false, error: "unauthenticated" };

  // Block liking your own kudos (also enforced by RLS).
  const { data: kudos } = await supabase
    .from("kudos")
    .select("sender_id")
    .eq("id", kudosId)
    .maybeSingle();
  if (!kudos) return { ok: false, error: "not_found" };
  if (kudos.sender_id === profileId) return { ok: false, error: "own_kudos" };

  const { data: existing } = await supabase
    .from("kudos_likes")
    .select("kudos_id")
    .eq("kudos_id", kudosId)
    .eq("user_id", profileId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("kudos_likes")
      .delete()
      .eq("kudos_id", kudosId)
      .eq("user_id", profileId);
    if (error) {
      console.error("[toggleLike] delete failed:", error.message);
      return { ok: false, error: "server_error" };
    }
    revalidatePath("/sun-kudos");
    return { ok: true, liked: false };
  }

  // upsert + ignoreDuplicates makes a rapid double-tap idempotent (the PK
  // unique violation would otherwise surface as an error + spurious revert).
  const { error } = await supabase
    .from("kudos_likes")
    .upsert({ kudos_id: kudosId, user_id: profileId }, { ignoreDuplicates: true });
  if (error) {
    console.error("[toggleLike] insert failed:", error.message);
    return { ok: false, error: "server_error" };
  }
  revalidatePath("/sun-kudos");
  return { ok: true, liked: true };
}
