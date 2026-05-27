import { getTranslations } from "next-intl/server";
import KudosCardFeed from "./kudos-card-feed";
import type { KudosEntry } from "./mock-data";

export default async function AllKudosFeed({ kudos }: { kudos: KudosEntry[] }) {
  const t = await getTranslations("SunKudos");

  return (
    <section className="flex flex-col gap-6 w-full max-w-[680px]">
      {/* Section header */}
      <div>
        <p
          className="text-white font-bold text-[24px] leading-8"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Sun* Annual Awards 2025
        </p>
        <div className="w-full h-px bg-[#2E3940] my-3" />
        <h2
          className="font-bold leading-[64px]"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(28px, 3vw, 48px)",
            color: "#FFEA9E",
            letterSpacing: "-0.25px",
          }}
        >
          {t("allKudos")}
        </h2>
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-6">
        {kudos.map((entry, i) => (
          <KudosCardFeed
            key={entry.id}
            kudos={entry}
            showNewBadgeOnSender={i === 0 && entry.isNew}
          />
        ))}
      </div>

      {/* Empty state placeholder */}
      {kudos.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p
            className="text-[16px]"
            style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)" }}
          >
            {t("emptyKudos")}
          </p>
        </div>
      )}
    </section>
  );
}
