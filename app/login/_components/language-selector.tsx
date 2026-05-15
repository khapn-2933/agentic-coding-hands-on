"use client";

import { useState } from "react";

interface LanguageSelectorProps {
  current?: "VN" | "EN";
}

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

export default function LanguageSelector({
  current = "VN",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors duration-200 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <VietnamFlag />
        <span>{current}</span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 rounded-lg border border-white/20 bg-[#0d1b35] shadow-xl overflow-hidden">
          <ul role="listbox" aria-label="Language options">
            <li
              role="option"
              aria-selected={current === "VN"}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-white/10 cursor-default"
            >
              <VietnamFlag />
              <span>VN</span>
            </li>
            <li
              role="option"
              aria-selected={false}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 cursor-not-allowed"
            >
              <span className="w-5 h-3.5 rounded-sm bg-white/20 inline-block" />
              <span>EN</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
