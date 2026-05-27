"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { KudosEntry } from "./mock-data";
import { useKudosLike } from "./use-kudos-like";

// Badge chip images from Figma (109×19 each) — same assets as the highlight card.
const BADGE_IMAGES: Record<string, string> = {
  "Rising Hero": "/sun-kudos/badge-rising-hero.png",
  "Legend Hero": "/sun-kudos/badge-legend-hero.png",
  "Super Hero": "/sun-kudos/badge-super-hero.png",
  "New Hero": "/sun-kudos/badge-new-hero.png",
};

function PersonBlock({
  person,
  showNewBadge,
}: {
  person: KudosEntry["sender"];
  showNewBadge?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center gap-2 w-[235px]">
      {showNewBadge && (
        <span
          className="absolute -top-3 -left-2 text-[11px] font-bold px-2 py-0.5 rounded"
          style={{
            fontFamily: "Montserrat, sans-serif",
            background: "#00C896",
            color: "#fff",
          }}
        >
          New Here
        </span>
      )}
      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 flex-shrink-0">
        <Image src={person.avatarUrl} alt={person.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex flex-col items-center gap-0.5 w-full">
        <span
          className="text-[16px] font-bold text-center leading-6 truncate w-full"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#00101A" }}
        >
          {person.name}
        </span>
        <div className="flex items-center gap-1 justify-center w-full flex-wrap">
          <span
            className="text-[14px] font-bold leading-5"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#999" }}
          >
            {person.department}
          </span>
          {BADGE_IMAGES[person.badge] && (
            <Image
              src={BADGE_IMAGES[person.badge]}
              alt={person.badge}
              width={109}
              height={19}
              style={{ objectFit: "contain" }}
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  kudos: KudosEntry;
  showNewBadgeOnSender?: boolean;
}

export default function KudosCardFeed({ kudos, showNewBadgeOnSender }: Props) {
  const t = useTranslations("SunKudos");
  const { liked, count: likeCount, toggle: handleLike, disabled } = useKudosLike(kudos);

  return (
    <div
      className="flex flex-col gap-4 w-full rounded-3xl"
      style={{
        background: "rgba(255,248,225,1)",
        padding: "40px 40px 16px 40px",
      }}
    >
      {/* Sender → Receiver row */}
      <div className="flex items-start justify-between gap-6">
        <PersonBlock person={kudos.sender} showNewBadge={showNewBadgeOnSender} />
        <div className="flex items-center justify-center flex-shrink-0 mt-8">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16h20M20 10l6 6-6 6"
              stroke="#00101A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <PersonBlock person={kudos.receiver} />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#FFEA9E]" />

      {/* Content block */}
      <div className="flex flex-col gap-4">
        {/* Time */}
        <span
          className="text-[16px] font-bold leading-6"
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "#999",
            letterSpacing: "0.5px",
          }}
        >
          {kudos.postedAt}
        </span>

        {/* Title + body bubble */}
        <div
          className="rounded-xl px-6 py-4"
          style={{
            border: "1px solid #FFEA9E",
            background: "rgba(255,234,158,0.40)",
          }}
        >
          <h3
            className="text-[16px] font-bold leading-6 mb-2"
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "#00101A",
              letterSpacing: "0.5px",
            }}
          >
            {kudos.title}
          </h3>
          <p
            className="text-[15px] leading-relaxed line-clamp-5"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#00101A" }}
          >
            {kudos.content}
          </p>
        </div>

        {/* Image gallery (5 thumbnails) */}
        {kudos.imageUrls.length > 0 && (
          <div className="flex gap-4">
            {kudos.imageUrls.slice(0, 5).map((url, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-lg overflow-hidden"
                style={{ width: "88px", height: "88px" }}
              >
                <Image
                  src={url}
                  alt={`Attachment ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Hashtags row — red #D4271D per Figma, matching the highlight card */}
        <div className="flex flex-wrap gap-2">
          {kudos.hashtags.slice(0, 5).map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="text-[13px] font-bold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#D4271D", letterSpacing: "0.5px" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#FFEA9E]" />

      {/* Footer */}
      <div className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={handleLike}
          disabled={disabled}
          title={disabled ? t("cannotLikeOwn") : undefined}
          className="flex items-center gap-1.5 transition-transform enabled:cursor-pointer enabled:active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={liked ? "Unlike" : "Like"}
        >
          {/* Count on the left, heart icon on the right (per Figma) */}
          <span
            className="text-[14px] font-bold"
            style={{ fontFamily: "Montserrat, sans-serif", color: liked ? "#e53e3e" : "#999" }}
          >
            {likeCount.toLocaleString("vi-VN")}
          </span>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill={liked ? "#e53e3e" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 27s-12-7.35-12-15a7 7 0 0 1 12-4.9A7 7 0 0 1 28 12c0 7.65-12 15-12 15Z"
              stroke={liked ? "#e53e3e" : "#999"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 text-[14px] font-semibold px-3 py-1 rounded transition-colors hover:bg-[#FFEA9E]/30"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#998C5F" }}
          onClick={() => {}}
        >
          {t("copyLink")}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="#998C5F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
