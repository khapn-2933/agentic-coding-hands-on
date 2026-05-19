"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useScrollspy } from "@/lib/use-scrollspy";
import AwardNav from "./award-nav";
import AwardRow from "./award-row";

interface AwardConfig {
  id: string;
  /** Message key under "Awards" namespace */
  key:
    | "topTalent"
    | "topProject"
    | "topProjectLeader"
    | "bestManager"
    | "signature2025"
    | "mvp";
  imageSrc: string;
  count: string;
  /** Message key under "AwardsPage" for the count unit label */
  countUnitKey: "unitIndividual" | "unitTeam" | "unitIndividualOrTeam";
  value: string;
  /** Message key under "AwardsPage" for value note, or null when no note */
  valueNoteKey: "valueNoteEach" | "valueNoteIndividual" | null;
  secondValue?: string;
  secondValueNoteKey?: "valueNoteTeam";
}

const AWARDS: AwardConfig[] = [
  {
    id: "top-talent",
    key: "topTalent",
    imageSrc: "/award-top-talent.png",
    count: "10",
    countUnitKey: "unitIndividual",
    value: "7.000.000 VNĐ",
    valueNoteKey: "valueNoteEach",
  },
  {
    id: "top-project",
    key: "topProject",
    imageSrc: "/award-top-project.png",
    count: "02",
    countUnitKey: "unitTeam",
    value: "15.000.000 VNĐ",
    valueNoteKey: "valueNoteEach",
  },
  {
    id: "top-project-leader",
    key: "topProjectLeader",
    imageSrc: "/award-top-project-leader.png",
    count: "03",
    countUnitKey: "unitIndividual",
    value: "7.000.000 VNĐ",
    valueNoteKey: "valueNoteEach",
  },
  {
    id: "best-manager",
    key: "bestManager",
    imageSrc: "/award-best-manager.png",
    count: "01",
    countUnitKey: "unitIndividual",
    value: "10.000.000 VNĐ",
    valueNoteKey: null,
  },
  {
    id: "signature-2025",
    key: "signature2025",
    imageSrc: "/award-signature.png",
    count: "01",
    countUnitKey: "unitIndividualOrTeam",
    value: "5.000.000 VNĐ",
    valueNoteKey: "valueNoteIndividual",
    secondValue: "8.000.000 VNĐ",
    secondValueNoteKey: "valueNoteTeam",
  },
  {
    id: "mvp",
    key: "mvp",
    imageSrc: "/award-mvp.png",
    count: "01",
    countUnitKey: "unitIndividual",
    value: "15.000.000 VNĐ",
    valueNoteKey: null,
  },
];

export default function AwardsSection() {
  const tAwards = useTranslations("Awards");
  const tPage = useTranslations("AwardsPage");

  const navIds = AWARDS.map((a) => a.id);
  const { activeId, setActiveId } = useScrollspy(navIds);

  const navItems = AWARDS.map((a) => ({
    id: a.id,
    label: tAwards(`${a.key}.label`),
  }));

  const handleSelect = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      setActiveId(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    },
    [setActiveId]
  );

  return (
    <section className="w-full bg-[#00101A] pt-4 pb-16 lg:pt-6 lg:pb-20 px-4 md:px-18 lg:px-36">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[178px_1fr] gap-10 lg:gap-16">
        <div className="lg:pt-12">
          <AwardNav items={navItems} activeId={activeId} onSelect={handleSelect} />
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {AWARDS.map((award, index) => (
            <AwardRow
              key={award.id}
              id={award.id}
              imageSrc={award.imageSrc}
              title={tAwards(`${award.key}.title`)}
              description={tAwards(`${award.key}.description`)}
              countLabel={tPage("countLabel")}
              count={award.count}
              countUnit={tPage(award.countUnitKey)}
              valueLabel={tPage("valueLabel")}
              value={award.value}
              valueNote={award.valueNoteKey ? tPage(award.valueNoteKey) : undefined}
              secondValue={award.secondValue}
              secondValueNote={
                award.secondValueNoteKey ? tPage(award.secondValueNoteKey) : undefined
              }
              imageSide={index % 2 === 0 ? "left" : "right"}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
