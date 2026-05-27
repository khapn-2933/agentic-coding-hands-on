"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCloseOnOutside } from "@/lib/use-close-on-outside";
import type { Department } from "@/lib/sun-kudos/queries";

interface KudosFiltersProps {
  hashtagSuggestions: string[];
  departments: Department[];
  selectedHashtags: string[];
  selectedDepartment?: string;
}

const MAX_HASHTAGS = 5;

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7 10l5 5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BTN_CLASS =
  "flex items-center gap-2 px-4 py-4 text-[16px] font-bold rounded transition-colors hover:bg-white/10";
const BTN_STYLE = {
  fontFamily: "Montserrat, sans-serif",
  color: "#FFFFFF",
  letterSpacing: "0.15px",
  border: "1px solid #998C5F",
  background: "rgba(255,234,158,0.10)",
} as const;

export default function KudosFilters({
  hashtagSuggestions,
  departments,
  selectedHashtags,
  selectedDepartment,
}: KudosFiltersProps) {
  const t = useTranslations("SunKudos");
  const router = useRouter();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<"hashtag" | "department" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutside(containerRef, openMenu !== null, () => setOpenMenu(null));

  // Push the new filter state to the URL; the server page refetches filtered kudos.
  function pushFilters(hashtags: string[], department?: string) {
    const params = new URLSearchParams();
    if (hashtags.length) params.set("hashtags", hashtags.join(","));
    if (department) params.set("department", department);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleHashtag(tag: string) {
    const has = selectedHashtags.includes(tag);
    if (!has && selectedHashtags.length >= MAX_HASHTAGS) return;
    const next = has
      ? selectedHashtags.filter((x) => x !== tag)
      : [...selectedHashtags, tag];
    pushFilters(next, selectedDepartment);
  }

  function selectDepartment(id: string) {
    const next = selectedDepartment === id ? undefined : id;
    pushFilters(selectedHashtags, next);
    setOpenMenu(null);
  }

  return (
    <div className="flex items-center gap-2 relative" ref={containerRef}>
      {/* Hashtag (multi-select, max 5) */}
      <div className="relative">
        <button
          type="button"
          className={BTN_CLASS}
          style={BTN_STYLE}
          onClick={() => setOpenMenu((m) => (m === "hashtag" ? null : "hashtag"))}
        >
          {t("filterHashtag")}
          {selectedHashtags.length > 0 && (
            <span className="text-[#FFEA9E]">({selectedHashtags.length})</span>
          )}
          <ChevronDown />
        </button>
        {openMenu === "hashtag" && (
          <ul
            className="absolute right-0 mt-2 z-50 min-w-[260px] max-h-[360px] overflow-auto rounded-lg py-2 shadow-xl"
            style={{ background: "#00070C", border: "1px solid #998C5F" }}
          >
            {hashtagSuggestions.length === 0 && (
              <li className="px-4 py-2 text-sm text-white/50" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {t("noData")}
              </li>
            )}
            {hashtagSuggestions.map((tag) => {
              const active = selectedHashtags.includes(tag);
              return (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => toggleHashtag(tag)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-[15px] font-bold transition-colors hover:bg-white/5"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "#FFFFFF",
                      background: active ? "rgba(255,234,158,0.12)" : undefined,
                    }}
                  >
                    <span>{tag}</span>
                    {active && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <circle cx="12" cy="12" r="10" fill="#FFEA9E" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="#00101A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Phòng ban (single-select) */}
      <div className="relative">
        <button
          type="button"
          className={BTN_CLASS}
          style={BTN_STYLE}
          onClick={() => setOpenMenu((m) => (m === "department" ? null : "department"))}
        >
          {t("filterDepartment")}
          <ChevronDown />
        </button>
        {openMenu === "department" && (
          <ul
            className="absolute right-0 mt-2 z-50 min-w-[200px] max-h-[360px] overflow-auto rounded-lg py-2 shadow-xl"
            style={{ background: "#00070C", border: "1px solid #FFEA9E" }}
          >
            {departments.length === 0 && (
              <li className="px-4 py-2 text-sm text-white/50" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {t("noData")}
              </li>
            )}
            {departments.map((dep) => {
              const active = selectedDepartment === dep.id;
              return (
                <li key={dep.id}>
                  <button
                    type="button"
                    onClick={() => selectDepartment(dep.id)}
                    className="w-full px-4 py-2.5 text-left text-[15px] font-bold transition-colors hover:bg-white/5"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: active ? "#FFEA9E" : "#FFFFFF",
                      background: active ? "rgba(255,234,158,0.12)" : undefined,
                    }}
                  >
                    {dep.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
