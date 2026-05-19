"use client";

import { useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCloseOnOutside } from "@/lib/use-close-on-outside";
import { setLocale } from "@/i18n/actions";
import { LOCALES, type Locale } from "@/i18n/locale";

function VietnamFlag() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="14" rx="2" fill="#DA251D" />
      <polygon
        points="10,2.5 11.18,6.18 15,6.18 12.09,8.32 13.09,12 10,9.77 6.91,12 7.91,8.32 5,6.18 8.82,6.18"
        fill="#FFFF00"
      />
    </svg>
  );
}

function UnitedKingdomFlag() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 60 30"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ borderRadius: "2px" }}
    >
      <clipPath id="ukflag-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#ukflag-clip)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const FLAGS: Record<Locale, () => React.JSX.Element> = {
  vi: VietnamFlag,
  en: UnitedKingdomFlag,
};

const LABELS: Record<Locale, string> = {
  vi: "VN",
  en: "EN",
};

export default function LanguageSelector() {
  const locale = useLocale() as Locale;
  const t = useTranslations("LanguageSelector");
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useCloseOnOutside(containerRef, open, () => setOpen(false));

  function choose(value: Locale) {
    setOpen(false);
    if (value === locale) return;
    startTransition(async () => {
      await setLocale(value);
      router.refresh();
    });
  }

  const SelectedFlag = FLAGS[locale];

  return (
    <div className="relative" ref={containerRef}>
      {/* Closed state: compact pill showing the active locale. */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 h-10 px-3 rounded-[8px] border border-[#998C5F] bg-[#00070C] text-white text-sm font-medium hover:bg-[#0B1418] transition-colors cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("ariaLabel")}
      >
        <SelectedFlag />
        <span>{LABELS[locale]}</span>
      </button>

      {/* Open state: full dropdown matching Figma hUyaaugye2 (selected row gold-tinted). */}
      {open && (
        <div
          className="absolute right-0 mt-2 p-[6px] rounded-[8px] border z-50 shadow-xl"
          style={{ background: "#00070C", borderColor: "#998C5F" }}
        >
          <ul role="listbox" aria-label="Language options" className="flex flex-col gap-1">
            {LOCALES.map((option) => {
              const Flag = FLAGS[option];
              const isSelected = locale === option;
              return (
                <li
                  key={option}
                  role="option"
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => choose(option)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      choose(option);
                    }
                  }}
                  className={`flex items-center gap-2 w-[108px] h-[56px] px-3 rounded-[2px] cursor-pointer text-sm outline-none transition-colors ${
                    isSelected
                      ? "text-white"
                      : "text-white/80 hover:bg-white/5 focus:bg-white/10"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: "rgba(255, 234, 158, 0.20)" }
                      : undefined
                  }
                >
                  <Flag />
                  <span className="font-medium">{LABELS[option]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
