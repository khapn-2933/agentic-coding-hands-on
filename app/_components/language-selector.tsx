"use client";

import { useState, useEffect, useRef } from "react";
import { useCloseOnOutside } from "@/lib/use-close-on-outside";

const STORAGE_KEY = "saa-language";

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

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2 4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function LanguageSelector() {
  const [lang, setLang] = useState<"VN" | "EN">("VN");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutside(containerRef, open, () => setOpen(false));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "VN" || stored === "EN") setLang(stored);
  }, []);

  function select(value: "VN" | "EN") {
    setLang(value);
    localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors duration-200 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <VietnamFlag />
        <span>{lang}</span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 rounded-lg border border-white/20 bg-[#0B0F12] shadow-xl overflow-hidden z-50">
          <ul role="listbox" aria-label="Language options">
            {(["VN", "EN"] as const).map((option) => (
              <li
                key={option}
                role="option"
                tabIndex={0}
                aria-selected={lang === option}
                onClick={() => select(option)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    select(option);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors outline-none focus:bg-white/10 ${
                  lang === option
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                {option === "VN" ? (
                  <VietnamFlag />
                ) : (
                  <span className="w-5 h-3.5 rounded-sm bg-white/20 inline-block" />
                )}
                <span>{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
