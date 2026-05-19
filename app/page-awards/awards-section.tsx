"use client";

import { useCallback } from "react";
import { useScrollspy } from "@/lib/use-scrollspy";
import AwardNav from "./award-nav";
import AwardRow from "./award-row";

const AWARDS = [
  {
    id: "top-talent",
    label: "Top Talent",
    imageSrc: "/award-top-talent.png",
    title: "Top Talent",
    description:
      "Giải thưởng dành cho cá nhân xuất sắc, có năng lực và đóng góp nổi bật trong năm 2025.",
    count: "10",
    countUnit: "Đơn vị",
    value: "7.000.000 VNĐ",
    valueNote: "(mỗi giải thưởng)",
  },
  {
    id: "top-project",
    label: "Top Project",
    imageSrc: "/award-top-project.png",
    title: "Top Project",
    description:
      "Giải thưởng dành cho dự án xuất sắc nhất, có giá trị và tầm ảnh hưởng cao trong năm 2025.",
    count: "02",
    countUnit: "Tập thể",
    value: "15.000.000 VNĐ",
    valueNote: "(mỗi giải thưởng)",
  },
  {
    id: "top-project-leader",
    label: "Top Project Leader",
    imageSrc: "/award-top-project-leader.png",
    title: "Top Project Leader",
    description:
      "Giải thưởng dành cho người dẫn dắt dự án xuất sắc, đưa dự án đạt nhiều thành tựu nổi bật.",
    count: "03",
    countUnit: "Cá nhân",
    value: "7.000.000 VNĐ",
    valueNote: "(mỗi giải thưởng)",
  },
  {
    id: "best-manager",
    label: "Best Manager",
    imageSrc: "/award-best-manager.png",
    title: "Best Manager",
    description:
      "Giải thưởng dành cho người quản lý có năng lực dẫn dắt đội nhóm và đạt kết quả vượt trội.",
    count: "01",
    countUnit: "Cá nhân",
    value: "10.000.000 VNĐ",
    valueNote: "",
  },
  {
    id: "signature-2025",
    label: "Signature 2025 - Creator",
    imageSrc: "/award-signature.png",
    title: "Signature 2025 - Creator",
    description:
      "Giải thưởng dành cho cá nhân hoặc tập thể có dấu ấn sáng tạo định hình thương hiệu SAA 2025.",
    count: "01",
    countUnit: "",
    value: "5.000.000 VNĐ / 8.000.000 VNĐ",
    valueNote: "(cho cá nhân / cho tập thể)",
  },
  {
    id: "mvp",
    label: "MVP",
    imageSrc: "/award-mvp.png",
    title: "MVP (Most Valuable Person)",
    description:
      "Giải thưởng cao nhất dành cho cá nhân có năng lực toàn diện và sức ảnh hưởng lớn nhất trong năm 2025.",
    count: "01",
    countUnit: "Cá nhân",
    value: "15.000.000 VNĐ",
    valueNote: "",
  },
] as const;

const NAV_ITEMS = AWARDS.map((a) => ({ id: a.id, label: a.label }));
const NAV_IDS = NAV_ITEMS.map((i) => i.id);

export default function AwardsSection() {
  const { activeId, setActiveId } = useScrollspy(NAV_IDS);

  const handleSelect = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      setActiveId(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Replace (not push) so back-button doesn't fill with hash entries.
      window.history.replaceState(null, "", `#${id}`);
    },
    [setActiveId]
  );

  return (
    <section className="w-full bg-[#00101A] py-16 px-4 md:px-18 lg:px-36">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
        <div className="lg:pt-12">
          <AwardNav items={NAV_ITEMS} activeId={activeId} onSelect={handleSelect} />
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {AWARDS.map((award, index) => (
            <AwardRow
              key={award.id}
              id={award.id}
              imageSrc={award.imageSrc}
              title={award.title}
              description={award.description}
              count={award.count}
              countUnit={award.countUnit}
              value={award.value}
              valueNote={award.valueNote || undefined}
              index={index}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
