import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export interface AwardCardProps {
  slug: string;
  imageSrc: string;
  title: string;
  description: string;
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 11l6-6M5 5h6v6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function AwardCard({ slug, imageSrc, title, description }: AwardCardProps) {
  const t = await getTranslations("AwardCard");
  return (
    <article className="flex flex-col gap-6">
      <div
        className="relative w-full aspect-square max-w-[336px] mx-auto overflow-hidden rounded-[24px] border border-[#FFEA9E]/60"
        style={{ boxShadow: "0 0 6px 0 #FAE287, 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
      >
        <Image
          src={imageSrc}
          alt={title}
          width={336}
          height={336}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-1 px-1">
        <h3
          className="text-2xl font-normal leading-[32px] text-[#FFEA9E]"
        >
          {title}
        </h3>
        <p
          className="text-base font-normal text-white"
          style={{ lineHeight: "24px", letterSpacing: "0.5px" }}
        >
          {description}
        </p>
      </div>

      <Link
        href={`/awards#${slug}`}
        className="inline-flex items-center gap-1 self-start text-base font-medium text-white tracking-[0.15px] hover:underline transition-colors px-1"
        aria-label={t("detailsAriaLabel", { title })}
      >
        {t("details")}
        <ArrowUpRight />
      </Link>
    </article>
  );
}
