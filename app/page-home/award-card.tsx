import Image from "next/image";
import Link from "next/link";

export interface AwardCardProps {
  slug: string;
  imageSrc: string;
  title: string;
  description: string;
}

function ArrowRight() {
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
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AwardCard({ slug, imageSrc, title, description }: AwardCardProps) {
  return (
    <article className="flex flex-col gap-4">
      {/* Award composite image (includes gold halo + embedded title) */}
      <div className="relative w-full aspect-square max-w-[336px] mx-auto">
        <Image
          src={imageSrc}
          alt={title}
          width={336}
          height={336}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed">{description}</p>
      </div>

      {/* Detail link */}
      <Link
        href={`/awards#${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FFEA9E] hover:underline transition-colors px-1"
        aria-label={`Chi tiết về ${title}`}
      >
        Chi tiết
        <ArrowRight />
      </Link>
    </article>
  );
}
