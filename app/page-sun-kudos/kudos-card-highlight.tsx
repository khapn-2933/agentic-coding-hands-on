"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { KudosEntry } from "./mock-data";
import { useKudosLike } from "./use-kudos-like";

interface Props {
  kudos: KudosEntry;
  faded?: boolean;
}

// Badge chip images from Figma (109×19 each)
const BADGE_IMAGES: Record<string, string> = {
  "Rising Hero": "/sun-kudos/badge-rising-hero.png",
  "Legend Hero": "/sun-kudos/badge-legend-hero.png",
  "Super Hero": "/sun-kudos/badge-super-hero.png",
  "New Hero": "/sun-kudos/badge-new-hero.png",
};

// Bold up-right arrow (reuse pattern from hero-countdown)
function ArrowUpRightBold() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="#998C5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonBlock({ person }: { person: KudosEntry["sender"] }) {
  return (
    <div className="flex flex-col items-center gap-2 w-[235px]">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 flex-shrink-0">
        <Image src={person.avatarUrl} alt={person.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex flex-col items-center gap-0.5 w-full">
        <span
          className="text-[16px] font-bold text-center leading-6 truncate w-full text-center"
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
          {/* Badge chip: use Figma media image if available, fallback to styled pill */}
          {BADGE_IMAGES[person.badge] ? (
            <Image
              src={BADGE_IMAGES[person.badge]}
              alt={person.badge}
              width={109}
              height={19}
              style={{ objectFit: "contain" }}
              unoptimized
            />
          ) : (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: "#FFF", textShadow: "0 0 1.3px #FFF", background: "rgba(255,234,158,0.1)", border: "1px solid #FFEA9E" }}
            >
              {person.badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KudosCardHighlight({ kudos }: Props) {
  const t = useTranslations("SunKudos");
  const { liked, count: likeCount, toggle: handleLike, disabled } = useKudosLike(kudos);

  return (
    <div
      className="flex flex-col gap-4 w-full h-full rounded-2xl"
      style={{
        border: "4px solid #FFEA9E",
        background: "#FFF8E1",
        padding: "24px 24px 16px 24px",
        minWidth: 0,
      }}
    >
      {/* Sender → Receiver row */}
      <div className="flex items-start justify-between gap-4">
        <PersonBlock person={kudos.sender} />
        {/* Send arrow icon from Figma */}
        <div className="flex items-center justify-center flex-shrink-0 mt-8">
          {/* Use Figma send icon SVG inline (red heart arrow) */}
          <Image
            src="/sun-kudos/icon-send.svg"
            alt="send"
            width={32}
            height={32}
            unoptimized
          />
        </div>
        <PersonBlock person={kudos.receiver} />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#FFEA9E]" />

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Time */}
        <span
          className="text-[16px] font-bold leading-6"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#999", letterSpacing: "0.5px" }}
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
          <p
            className="text-[15px] font-semibold leading-relaxed line-clamp-3"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#00101A" }}
          >
            <span className="font-bold text-[16px]">{kudos.title} — </span>
            {kudos.content}
          </p>
        </div>

        {/* Hashtags — #D4271D per Figma node I2940:13465;335:9459 backgroundColor */}
        <div className="flex flex-wrap gap-2">
          {kudos.hashtags.slice(0, 5).map((tag, i) => (
            <span
              key={i}
              className="text-[13px] font-bold"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "#D4271D",
                letterSpacing: "0.5px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#FFEA9E]" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Hearts — Figma heart icon + count */}
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
            style={{ fontFamily: "Montserrat, sans-serif", color: liked ? "#D4271D" : "#999" }}
          >
            {likeCount.toLocaleString("vi-VN")}
          </span>
          <Image
            src="/sun-kudos/icon-heart.svg"
            alt="heart"
            width={24}
            height={24}
            unoptimized
            style={{ filter: liked ? "none" : "grayscale(0.4)" }}
          />
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Copy link — text on the left, link icon on the right (per Figma) */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-[14px] font-semibold px-3 py-1 rounded transition-colors hover:bg-[#FFEA9E]/20"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#998C5F" }}
            onClick={() => {}}
          >
            {t("copyLink")}
            <Image
              src="/sun-kudos/icon-link.svg"
              alt="link"
              width={16}
              height={16}
              unoptimized
              style={{ filter: "invert(58%) sepia(19%) saturate(445%) hue-rotate(11deg) brightness(88%) contrast(87%)" }}
            />
          </button>
          {/* View details button with bold arrow */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-[14px] font-semibold px-3 py-1 rounded transition-colors hover:bg-[#FFEA9E]/20"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#998C5F" }}
            onClick={() => {}}
          >
            {t("viewDetails")}
            <ArrowUpRightBold />
          </button>
        </div>
      </div>
    </div>
  );
}
