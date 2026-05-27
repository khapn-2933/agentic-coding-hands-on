"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SpotlightBoardProps {
  spotlight: {
    totalKudos: number;
    names: string[];
    activityLog: { time: string; text: string }[];
  };
  currentUserName?: string;
}

const FONT_SIZES = [11, 13, 14, 16, 18, 20, 13, 15, 12, 17, 14, 13, 16, 12, 18, 11, 14, 15];
const OPACITIES = [1, 0.7, 0.85, 0.6, 1, 0.75, 0.9, 0.65, 1, 0.8, 0.7, 0.9, 1, 0.6, 0.85, 0.7, 0.75, 0.9];
// Deterministic vertical stagger (px) so names sit "so le" like the design
// word cloud instead of in straight rows. Bounded < row gap (40px) so wrapped
// lines never overlap.
const STAGGER = [0, 14, -10, 8, -16, 6, -12, 16, -6, 12, -14, 10, -8, 16, -12, 6];

export default function SpotlightBoard({ spotlight, currentUserName }: SpotlightBoardProps) {
  const t = useTranslations("SunKudos");
  const { totalKudos, activityLog } = spotlight;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [query, setQuery] = useState("");

  // Always surface the current user in the cloud so the red highlight is visible,
  // even if they have no kudos yet.
  const allNames =
    currentUserName && !spotlight.names.includes(currentUserName)
      ? [currentUserName, ...spotlight.names]
      : spotlight.names;

  // Spotlight search: filter the cloud to names matching the query (trimmed,
  // case-insensitive). Empty query shows everyone.
  const q = query.trim().toLowerCase();
  const names = q
    ? allNames.filter((n) => n.toLowerCase().includes(q))
    : allNames;

  // Reserve the bottom-LEFT quarter for the timeline: names fill the top
  // (full width) + the bottom-RIGHT, ~3/4 of the box. Split ~65% to the top.
  const splitAt = Math.ceil(names.length * 0.65);
  const topNames = names.slice(0, splitAt);
  const bottomRightNames = names.slice(splitAt);

  const renderName = (name: string, i: number) => {
    const fontSize = FONT_SIZES[i % FONT_SIZES.length];
    const opacity = OPACITIES[i % OPACITIES.length];
    const offset = STAGGER[i % STAGGER.length];
    const isCurrentUser = currentUserName && name === currentUserName;
    return (
      <span
        key={`${name}-${i}`}
        className="font-bold whitespace-nowrap cursor-pointer hover:text-[#FFEA9E] transition-colors"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: "Montserrat, sans-serif",
          color: isCurrentUser ? "#D4271D" : `rgba(255,255,255,${opacity})`,
          transform: `translateY(${offset}px)`,
        }}
      >
        {name}
      </span>
    );
  };

  return (
    <section className="w-full bg-[#00101A] pt-10">
      {/* Section header */}
      <div className="px-6 md:px-36">
        <div className="max-w-[1152px] mx-auto">
          <p
            className="text-white font-bold text-[24px] leading-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Sun* Annual Awards 2025
          </p>
          <div className="w-full h-px bg-[#2E3940] my-3" />
          <div className="flex items-center">
            <h2
              className="font-bold leading-[64px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(32px, 4vw, 57px)",
                color: "#FFEA9E",
                letterSpacing: "-0.25px",
              }}
            >
              {t("spotlightBoard")}
            </h2>
          </div>
        </div>
      </div>

      {/* Spotlight card — Figma B.7_Spotlight: KV image bg + 1px #998C5F border + radius 47.14px */}
      <div className="px-6 md:px-36 pb-16">
        <div
          className={`max-w-[1152px] mx-auto overflow-hidden relative ${isFullscreen ? "fixed inset-4 z-50 max-w-none" : ""}`}
          style={{
            backgroundImage: "url(/sun-kudos/kv-background.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #998C5F",
            borderRadius: "47.14px",
          }}
        >
          {/* Dark overlay so word cloud is readable */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,7,12,0.72)", borderRadius: "inherit" }}
          />

          {/* Content above overlay */}
          <div className="relative z-10">
            {/* Top bar: search + kudos count + fullscreen */}
            <div className="flex items-center justify-between px-8 pt-6 pb-4">
              {/* Search bar */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,234,158,0.3)",
                  width: "240px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
                    fill="rgba(255,255,255,0.4)"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={100}
                  placeholder={t("searchProfilePlaceholder")}
                  className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/35"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                />
              </div>

              {/* Kudos count — node 3007:17482: WHITE #FFF, 36px/700 */}
              <span
                className="font-bold"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "36px",
                  lineHeight: "44px",
                  color: "#FFFFFF",
                }}
              >
                {totalKudos} KUDOS
              </span>

              {/* Spacer to balance the search bar */}
              <div style={{ width: "240px" }} />
            </div>

            {/* Canvas — names occupy ~3/4 of the box (full-width top + bottom-
                right); the faint activity timeline gets only the bottom-LEFT
                quarter, so names never overlap the timeline. */}
            <div className="relative mx-8 mb-8" style={{ minHeight: "360px" }}>
              {/* Empty search result */}
              {q && names.length === 0 && (
                <div className="flex items-center justify-center py-24">
                  <p
                    className="text-[15px] font-bold"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.5)" }}
                  >
                    {t("noData")}
                  </p>
                </div>
              )}

              {/* Top region — full-width staggered name cloud */}
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-9 py-6">
                {topNames.map((name, i) => renderName(name, i))}
              </div>

              {/* Bottom region — left quarter = faint timeline, right = more names */}
              <div className="flex items-end gap-6">
                {/* Activity timeline — bottom-left, no background, lines fade
                    with age (newest bottom = full, older fainter → "mờ ảo"). */}
                <div className="w-1/2 flex flex-col">
                  {[...activityLog].reverse().map((entry, i, arr) => {
                    const opacity = 0.2 + (0.8 * (i + 1)) / arr.length;
                    const isCurrentUser =
                      currentUserName && entry.text.includes(currentUserName);
                    return (
                      <div
                        key={`${entry.time}-${i}`}
                        className="flex items-center gap-3 py-1"
                        style={{ opacity }}
                      >
                        <span
                          className="text-[14px] font-bold flex-shrink-0"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#FFFFFF" }}
                        >
                          {entry.time}
                        </span>
                        <span
                          className="text-[14px] font-bold truncate"
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            color: isCurrentUser ? "#D4271D" : "#FFFFFF",
                          }}
                        >
                          {entry.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom-right names */}
                <div className="w-1/2 flex flex-wrap items-center justify-center gap-x-6 gap-y-8 pb-2">
                  {bottomRightNames.map((name, i) => renderName(name, i + splitAt))}
                </div>
              </div>

              {/* Fullscreen / pan-zoom — bottom-right corner */}
              <button
                type="button"
                className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded cursor-pointer hover:bg-white/10 transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                onClick={() => setIsFullscreen((v) => !v)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
