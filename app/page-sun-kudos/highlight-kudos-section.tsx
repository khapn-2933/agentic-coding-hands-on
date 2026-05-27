"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import KudosCardHighlight from "./kudos-card-highlight";
import KudosFilters from "./kudos-filters";
import type { KudosEntry } from "./mock-data";
import type { Department } from "@/lib/sun-kudos/queries";

interface HighlightKudosSectionProps {
  kudos: KudosEntry[];
  hashtagSuggestions: string[];
  departments: Department[];
  selectedHashtags: string[];
  selectedDepartment?: string;
}

export default function HighlightKudosSection({
  kudos,
  hashtagSuggestions,
  departments,
  selectedHashtags,
  selectedDepartment,
}: HighlightKudosSectionProps) {
  const t = useTranslations("SunKudos");
  const total = kudos.length;
  const [currentIndex, setCurrentIndex] = useState(total > 1 ? 1 : 0);

  function prev() {
    setCurrentIndex((i) => (i - 1 + total) % total);
  }

  function next() {
    setCurrentIndex((i) => (i + 1) % total);
  }

  // Show up to 3 cards (prev, center, next). De-dupe positions so 1–2 entries
  // don't repeat the same card, and never index past the array.
  const indices = total === 0
    ? []
    : Array.from(
        new Set([
          (currentIndex - 1 + total) % total,
          currentIndex % total,
          (currentIndex + 1) % total,
        ])
      );

  return (
    <section className="w-full bg-[#00101A] pt-4">
      {/* Header */}
      <div className="px-6 md:px-36 mb-0">
        <div className="max-w-[1152px] mx-auto">
          <p
            className="text-white font-bold text-[24px] leading-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Sun* Annual Awards 2025
          </p>
          <div className="w-full h-px bg-[#2E3940] my-3" />
          <div className="flex items-center justify-between">
            <h2
              className="font-bold leading-[64px]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "clamp(32px, 4vw, 57px)",
                color: "#FFEA9E",
                letterSpacing: "-0.25px",
              }}
            >
              {t("highlightKudos")}
            </h2>
            {/* Filter dropdowns (Hashtag multi-select / Phòng ban single-select) */}
            <KudosFilters
              hashtagSuggestions={hashtagSuggestions}
              departments={departments}
              selectedHashtags={selectedHashtags}
              selectedDepartment={selectedDepartment}
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div className="flex items-center justify-center py-24">
          <p
            className="text-[16px]"
            style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.4)" }}
          >
            {t("emptyKudos")}
          </p>
        </div>
      )}

      {/* Carousel */}
      {total > 0 && (
      <div className="relative w-full overflow-hidden" style={{ minHeight: "525px" }}>
        {/* Left fade gradient + prev button */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
          style={{
            width: "200px",
            background: "linear-gradient(90deg, #00101A 20%, rgba(0,16,26,0) 100%)",
            paddingLeft: "40px",
          }}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="flex items-center justify-center w-[60px] h-[60px] rounded hover:bg-white/10 transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#FFEA9E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div
          className="flex items-center gap-6 py-6"
          style={{ padding: "24px 0" }}
        >
          {indices.map((dataIdx, position) => (
            <div
              key={`${dataIdx}-${position}`}
              className="flex-shrink-0 transition-all duration-300"
              style={{
                width: "528px",
                minWidth: "528px",
                marginLeft: position === 0 ? "0" : undefined,
                opacity: position === 1 ? 1 : 0.55,
                transform: position === 1 ? "scale(1)" : "scale(0.97)",
              }}
            >
              <KudosCardHighlight kudos={kudos[dataIdx]} />
            </div>
          ))}
        </div>

        {/* Right fade gradient + next button */}
        <div
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end"
          style={{
            width: "200px",
            background: "linear-gradient(270deg, #00101A 20%, rgba(0,16,26,0) 100%)",
            paddingRight: "40px",
          }}
        >
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="flex items-center justify-center w-[60px] h-[60px] rounded hover:bg-white/10 transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#FFEA9E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      )}

      {/* Pagination */}
      {total > 0 && (
      <div className="flex items-center justify-center gap-8 pb-10">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous page"
          className="flex items-center justify-center w-12 h-12 rounded hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span
          className="font-bold text-[28px] leading-9"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#999" }}
        >
          {currentIndex + 1}/{total}
        </span>

        <button
          type="button"
          onClick={next}
          aria-label="Next page"
          className="flex items-center justify-center w-12 h-12 rounded hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      )}
    </section>
  );
}
