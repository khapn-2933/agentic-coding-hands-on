import { getTranslations } from "next-intl/server";
import AwardCard from "./award-card";

interface GridAward {
  slug: string;
  imageSrc: string;
  /** Hardcoded English brand title — not translated */
  title: string;
  /** Message key under "AwardsGrid" for the short description */
  shortKey:
    | "shortTopTalent"
    | "shortTopProject"
    | "shortTopProjectLeader"
    | "shortBestManager"
    | "shortSignature2025"
    | "shortMvp";
}

const AWARDS: GridAward[] = [
  { slug: "top-talent", imageSrc: "/award-top-talent.png", title: "Top Talent", shortKey: "shortTopTalent" },
  { slug: "top-project", imageSrc: "/award-top-project.png", title: "Top Project", shortKey: "shortTopProject" },
  { slug: "top-project-leader", imageSrc: "/award-top-project-leader.png", title: "Top Project Leader", shortKey: "shortTopProjectLeader" },
  { slug: "best-manager", imageSrc: "/award-best-manager.png", title: "Best Manager", shortKey: "shortBestManager" },
  { slug: "signature-2025-creator", imageSrc: "/award-signature.png", title: "Signature 2025 - Creator", shortKey: "shortSignature2025" },
  { slug: "mvp", imageSrc: "/award-mvp.png", title: "MVP (Most Valuable Person)", shortKey: "shortMvp" },
];

export default async function AwardsGrid() {
  const t = await getTranslations("AwardsGrid");

  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-12">
          <p className="text-2xl font-bold leading-[32px] text-white">
            {t("subtitle")}
          </p>
          <div className="h-px w-full bg-[#2E3940]" />
          <h2
            className="text-4xl md:text-[57px] md:leading-[64px] font-bold text-[#FFEA9E]"
            style={{ letterSpacing: "-0.25px" }}
          >
            {t("title")}
          </h2>
        </div>

        {/* 3-col desktop, 2-col below md */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {AWARDS.map((award) => (
            <AwardCard
              key={award.slug}
              slug={award.slug}
              imageSrc={award.imageSrc}
              title={award.title}
              description={t(award.shortKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
