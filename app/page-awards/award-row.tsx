import Image from "next/image";

export interface AwardRowProps {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
  count: string;
  countUnit: string;
  value: string;
  valueNote?: string;
  secondValue?: string;
  secondValueNote?: string;
  /** Explicit per-row image side per Figma; design isn't strict alternation. */
  imageSide: "left" | "right";
  priority?: boolean;
}

export default function AwardRow({
  id,
  imageSrc,
  title,
  description,
  count,
  countUnit,
  value,
  valueNote,
  secondValue,
  secondValueNote,
  imageSide,
  priority = false,
}: AwardRowProps) {
  const imageOnRight = imageSide === "right";

  return (
    <section
      id={id}
      className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 py-12 lg:py-20"
    >
      <div
        className={`order-1 flex justify-center ${
          imageOnRight ? "lg:order-2 lg:justify-end" : "lg:order-1 lg:justify-start"
        }`}
      >
        <div
          className="relative w-full max-w-[336px] aspect-square overflow-hidden rounded-[24px] border border-[#FFEA9E]/60"
          style={{ boxShadow: "0 0 6px 0 #FAE287, 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={336}
            height={336}
            sizes="(max-width: 1024px) 100vw, 336px"
            priority={priority}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      <div
        className={`order-2 ${imageOnRight ? "lg:order-1" : "lg:order-2"} flex flex-col gap-5 max-w-[520px]`}
      >
        <h3 className="text-3xl lg:text-4xl font-normal leading-tight text-[#FFEA9E]">
          {title}
        </h3>
        <p
          className="text-base font-normal text-white whitespace-pre-line"
          style={{ lineHeight: "24px", letterSpacing: "0.5px" }}
        >
          {description}
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base text-white/80">Số lượng giải thưởng:</span>
            <span className="text-2xl font-bold text-[#FFEA9E]">{count}</span>
            <span className="text-base text-white/80">{countUnit}</span>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base text-white/80">Giá trị giải thưởng:</span>
            <span className="text-2xl font-bold text-[#FFEA9E]">{value}</span>
            {valueNote && (
              <span className="text-base text-white/80">{valueNote}</span>
            )}
          </div>
          {secondValue && (
            <>
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-white/40">
                <span>Hoặc</span>
                <span className="flex-1 h-px bg-white/10" />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-base text-white/80">Giá trị giải thưởng:</span>
                <span className="text-2xl font-bold text-[#FFEA9E]">{secondValue}</span>
                {secondValueNote && (
                  <span className="text-base text-white/80">{secondValueNote}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
