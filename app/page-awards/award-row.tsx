import Image from "next/image";
import { DiamondIcon, LicenseIcon, TargetIcon } from "./award-icons";

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

// Per Figma D.1.2_Content: cream labels are 24px Montserrat 700 (32 lh),
// description body is 16px Montserrat 700 (24 lh, 0.5 tracking), divider
// is a 1px #2E3940 rule between title and description.
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
      className={`scroll-mt-28 flex flex-col items-stretch gap-8 lg:items-start lg:gap-10 py-12 lg:py-20 ${
        imageOnRight ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="flex justify-center lg:block lg:shrink-0">
        <div
          className="relative w-full max-w-[336px] lg:w-[336px] aspect-square overflow-hidden rounded-[24px] border border-[#FFEA9E]/60"
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

      <div className="flex flex-col gap-6 lg:flex-1 lg:max-w-[520px]">
        {/* Title row: Target icon + cream title, 16px gap */}
        <h3 className="flex items-center gap-4 text-2xl font-bold leading-8 text-[#FFEA9E]">
          <TargetIcon className="shrink-0" />
          {title}
        </h3>

        <div className="h-px w-full bg-[#2E3940]" />

        {/* Description: 16px font-bold per Figma */}
        <p
          className="text-base font-bold text-white whitespace-pre-line text-justify"
          style={{ lineHeight: "24px", letterSpacing: "0.5px" }}
        >
          {description}
        </p>

        <div className="h-px w-full bg-[#2E3940]" />

        {/* Count row: Diamond icon + label + (count + unit grouped). Unit stays beside
            the count, vertically centered; long unit text wraps inside its narrow column. */}
        <div className="flex items-center gap-4 flex-wrap">
          <DiamondIcon className="shrink-0 text-[#FFEA9E]" />
          <span className="text-2xl font-bold leading-8 text-[#FFEA9E]">
            Số lượng giải thưởng:
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold leading-8 text-white">{count}</span>
            <span className="max-w-[80px] text-sm font-bold text-white/80 leading-5">
              {countUnit}
            </span>
          </span>
        </div>

        <div className="h-px w-full bg-[#2E3940]" />

        {/* Value row: License/Medal icon + label + value */}
        <div className="flex items-center gap-4 flex-wrap">
          <LicenseIcon className="shrink-0 text-[#FFEA9E]" />
          <span className="text-2xl font-bold leading-8 text-[#FFEA9E]">
            Giá trị giải thưởng:
          </span>
          <span className="text-2xl font-bold leading-8 text-white">{value}</span>
          {valueNote && (
            <span className="text-sm font-bold text-white/80 leading-5">
              {valueNote}
            </span>
          )}
        </div>

        {secondValue && (
          <>
            <div className="h-px w-full bg-[#2E3940]" />
            <div className="flex items-center gap-4 flex-wrap">
              <LicenseIcon className="shrink-0 text-[#FFEA9E]" />
              <span className="text-2xl font-bold leading-8 text-[#FFEA9E]">
                Giá trị giải thưởng:
              </span>
              <span className="text-2xl font-bold leading-8 text-white">
                {secondValue}
              </span>
              {secondValueNote && (
                <span className="text-sm font-bold text-white/80 leading-5">
                  {secondValueNote}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
