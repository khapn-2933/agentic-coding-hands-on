import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getEventStartAt } from "@/lib/event-config";
import SaaHeader from "./_components/saa-header";
import SaaFooter from "./_components/saa-footer";
import WidgetButton from "./_components/widget-button";
import HeroArea from "./page-home/hero-area";
import HeroCountdown from "./page-home/hero-countdown";
import RootFurtherExplainer from "./page-home/root-further-explainer";
import AwardsGrid from "./page-home/awards-grid";
import SunKudosBlock from "./page-home/sun-kudos-block";

export default async function HomePage() {
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
      <SaaHeader user={headerUser} activePath="about-saa" />
      <main className="flex flex-1 flex-col">
        <HeroArea>
          <HeroCountdown eventStartAt={getEventStartAt()} />
          <RootFurtherExplainer />
        </HeroArea>
        <AwardsGrid />
        <SunKudosBlock />
      </main>
      <WidgetButton />
      <SaaFooter />
    </>
  );
}
