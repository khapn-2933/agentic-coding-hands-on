import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import {
  getAllKudos,
  getCurrentUserStats,
  getHighlightKudos,
  getRecentGiftRecipients,
  getSpotlightData,
} from "@/lib/sun-kudos/queries";
import SaaHeader from "../_components/saa-header";
import SaaFooter from "../_components/saa-footer";
import KudosHero from "../page-sun-kudos/kudos-hero";
import HighlightKudosSection from "../page-sun-kudos/highlight-kudos-section";
import SpotlightBoard from "../page-sun-kudos/spotlight-board";
import AllKudosFeed from "../page-sun-kudos/all-kudos-feed";
import StatsSidebar from "../page-sun-kudos/stats-sidebar";
import GiftRecipientsPanel from "../page-sun-kudos/gift-recipients-panel";

export default async function SunKudosPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerUser = user
    ? {
        email: user.email ?? "",
        role: (user.user_metadata?.role as "admin" | "user" | undefined) ?? null,
      }
    : null;

  // Resolve current user's display name for the red-highlight in the spotlight.
  // Prefer their profile row; fall back to Google metadata, then email local part
  // so a signed-in user without a seed profile still gets highlighted.
  let currentUserName: string | undefined;
  if (user) {
    const { data: profile } = user.email
      ? await supabase
          .from("profiles")
          .select("full_name")
          .eq("email", user.email)
          .maybeSingle()
      : { data: null };
    currentUserName =
      profile?.full_name ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split("@")[0] ??
      undefined;
  }

  const [highlightKudos, allKudos, spotlight, stats, gifts] = await Promise.all([
    getHighlightKudos(5),
    getAllKudos(20),
    getSpotlightData(),
    getCurrentUserStats(),
    getRecentGiftRecipients(5),
  ]);

  return (
    <>
      <SaaHeader user={headerUser} activePath="sun-kudos" />

      <main className="flex flex-1 flex-col bg-[#00101A] pt-20">
        <KudosHero />

        <HighlightKudosSection kudos={highlightKudos} />

        <SpotlightBoard spotlight={spotlight} currentUserName={currentUserName} />

        <section className="w-full px-6 md:px-36 py-10">
          <div className="max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-20 items-start">
            <div className="flex-1 min-w-0">
              <AllKudosFeed kudos={allKudos} />
            </div>

            <aside className="w-full lg:w-[422px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24">
              <StatsSidebar stats={stats} />
              <GiftRecipientsPanel recipients={gifts} />
            </aside>
          </div>
        </section>
      </main>

      <SaaFooter />
    </>
  );
}
