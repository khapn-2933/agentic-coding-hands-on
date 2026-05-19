import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import SaaHeader from "../_components/saa-header";
import SaaFooter from "../_components/saa-footer";
import WidgetButton from "../_components/widget-button";
import SunKudosBlock from "../page-home/sun-kudos-block";
import AwardsTitle from "../page-awards/awards-title";
import AwardsSection from "../page-awards/awards-section";

export default async function AwardsPage() {
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

  return (
    <>
      <SaaHeader user={headerUser} activePath="awards" />
      <main className="flex flex-1 flex-col bg-[#00101A]">
        <AwardsTitle />
        <AwardsSection />
        <SunKudosBlock />
      </main>
      <WidgetButton />
      <SaaFooter />
    </>
  );
}
