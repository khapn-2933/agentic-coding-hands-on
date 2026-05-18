import AwardCard from "./award-card";

const AWARDS = [
  {
    slug: "top-talent",
    imageSrc: "/award-top-talent.png",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
  },
  {
    slug: "top-project",
    imageSrc: "/award-top-project.png",
    title: "Top Project",
    description: "Vinh danh dự án xuất sắc nhất trên mọi phương diện hoạt động",
  },
  {
    slug: "top-project-leader",
    imageSrc: "/award-top-project-leader.png",
    title: "Top Project Leader",
    description: "Vinh danh người quản lý dự án dẫn dắt dự án đạt nhiều thành tựu",
  },
  {
    slug: "best-manager",
    imageSrc: "/award-best-manager.png",
    title: "Best Manager",
    description: "Vinh danh người quản lý có năng lực quản lý, dẫn dắt đội nhóm",
  },
  {
    slug: "signature-2025-creator",
    imageSrc: "/award-signature.png",
    title: "Signature 2025 - Creator",
    description: "Vinh danh người sáng tạo nội dung định hình thương hiệu SAA 2025",
  },
  {
    slug: "mvp",
    imageSrc: "/award-mvp.png",
    title: "MVP (Most Valuable Person)",
    description: "Vinh danh cá nhân có năng lực toàn diện và sức ảnh hưởng cao",
  },
] as const;

export default function AwardsGrid() {
  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col gap-2 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
            Sun* annual awards 2025
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Hệ thống giải thưởng
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
              description={award.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
