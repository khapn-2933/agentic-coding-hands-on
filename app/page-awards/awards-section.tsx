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
    imageSide: "right" as const,
    title: "Top Talent",
    description:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng nâng tầm chuyên môn, năng nổ, hiệu suất công việc vượt trội, mang lại giá trị vượt kỳ vọng, đồng thời có ảnh hưởng tích cực đến đồng đội và đội nhóm. Họ là biểu tượng cho sự tận tâm, tinh thần học hỏi không ngừng, và khả năng truyền cảm hứng, thúc đẩy động lực và lan toả các giá trị tốt đẹp tại Sun*.",
    count: "10",
    countUnit: "Cá nhân",
    value: "7.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "top-project",
    label: "Top Project",
    imageSrc: "/award-top-project.png",
    imageSide: "right" as const,
    title: "Top Project",
    description:
      "Giải thưởng Top Project vinh danh những dự án xuất sắc với kết quả kinh doanh vượt trội, hiệu quả vận hành cao, và mang lại giá trị bền vững. Các thành viên dự án không chỉ có tinh thần làm việc chuyên nghiệp mà còn truyền cảm hứng và lan toả các giá trị tốt đẹp tại Sun*. Họ là nguồn lực và niềm tin để dự án vươn tới những tầm cao mới và cùng nhau chinh phục.",
    count: "02",
    countUnit: "Tập thể",
    value: "15.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "top-project-leader",
    label: "Top Project Leader",
    imageSrc: "/award-top-project-leader.png",
    imageSide: "left" as const,
    title: "Top Project Leader",
    description:
      "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy \"Aim High – Be Agile\" trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.",
    count: "03",
    countUnit: "Cá nhân",
    value: "7.000.000 VNĐ",
    valueNote: "cho mỗi giải thưởng",
  },
  {
    id: "best-manager",
    label: "Best Manager",
    imageSrc: "/award-best-manager.png",
    imageSide: "right" as const,
    title: "Best Manager",
    description:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động rõ rệt đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn cảm thấy được trân trọng, có không gian phát triển bản thân, đồng hành cùng nhau bằng năng lực, sự sáng tạo và niềm tin vào những điều có ích cho khách hàng.",
    count: "01",
    countUnit: "Cá nhân",
    value: "10.000.000 VNĐ",
    valueNote: "",
  },
  {
    id: "signature-2025",
    label: "Signature 2025 - Creator",
    imageSrc: "/award-signature.png",
    imageSide: "left" as const,
    title: "Signature 2025 - Creator",
    description:
      "Giải thưởng Signature vinh danh cá nhân hoặc tập thể đã thể hiện rõ ràng và mang tư duy chủ động và truyền cảm hứng tới các nhân tài, lan toả các giá trị tới trong toàn thể thị.\n\nTrong năm 2025, giải thưởng Signature vinh danh Creator – cá nhân hay tập thể mang tư duy chủ động và truyền cảm hứng tới những cá nhân, đồng nghiệp khác. Hơn là những người sáng tạo nội dung, mang lại giá trị tới cho các dự án, khách hàng, hoặc tổ chức.",
    count: "01",
    countUnit: "Cá nhân hoặc Tập thể",
    value: "5.000.000 VNĐ",
    valueNote: "cho giải cá nhân",
    secondValue: "8.000.000 VNĐ",
    secondValueNote: "cho giải tập thể",
  },
  {
    id: "mvp",
    label: "MVP",
    imageSrc: "/award-mvp.png",
    imageSide: "right" as const,
    title: "MVP (Most Valuable Person)",
    description:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua. Không chỉ nổi bật bởi hiệu suất và kết quả công việc, MVP là người hội tụ đầy đủ phẩm chất của một người Sun* tiêu biểu, đồng thời mang trong mình trọng trách lan toả, dẫn dắt và đạt nên sự sung mãn tinh thần và sự cao trong cộng đồng Sun*.",
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[178px_1fr] gap-10 lg:gap-16">
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
              secondValue={"secondValue" in award ? award.secondValue : undefined}
              secondValueNote={"secondValueNote" in award ? award.secondValueNote : undefined}
              imageSide={index % 2 === 0 ? "right" : "left"}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
