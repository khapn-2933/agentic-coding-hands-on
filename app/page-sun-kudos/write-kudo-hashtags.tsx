"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface WriteKudoHashtagsProps {
  tags: string[];
  suggestions: string[];
  error?: string;
  onChange: (tags: string[]) => void;
}

const MAX_TAGS = 5;

export default function WriteKudoHashtags({
  tags,
  suggestions,
  error,
  onChange,
}: WriteKudoHashtagsProps) {
  const t = useTranslations("WriteKudo");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showMaxError, setShowMaxError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) => !tags.includes(s.startsWith("#") ? s : `#${s}`)
  );

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (tags.includes(normalized)) {
      setInputValue("");
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setShowMaxError(true);
      setTimeout(() => setShowMaxError(false), 3000);
      return;
    }
    onChange([...tags, normalized]);
    setInputValue("");
    setOpen(false);
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
    setShowMaxError(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const atMax = tags.length >= MAX_TAGS;

  return (
    <div className="flex items-start gap-4 flex-wrap" ref={containerRef}>
      {/* + Hashtag button */}
      {!atMax && (
        <div className="relative flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2 py-1 border border-[#998C5F] rounded-lg bg-white h-12 hover:bg-[#FFF8E1] transition-colors"
            aria-label={t("hashtagButton")}
          >
            {/* Plus icon inline SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="#00101A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="flex flex-col items-start leading-none">
              <span className="text-[11px] font-bold font-montserrat text-[#999] tracking-[0.5px]">
                {t("hashtagButton")}
              </span>
              <span className="text-[11px] font-bold font-montserrat text-[#999] tracking-[0.5px]">
                {t("hashtagSubtitle")}
              </span>
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-20 mt-1 w-56 bg-white border border-[#998C5F] rounded-lg shadow-lg overflow-hidden">
              <div className="p-2 border-b border-[#998C5F]">
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="#hashtag"
                  className="w-full text-sm font-montserrat text-[#00101A] outline-none px-2 py-1 rounded border border-[#998C5F]"
                />
              </div>
              <ul className="max-h-40 overflow-y-auto py-1">
                {filteredSuggestions
                  .filter((s) =>
                    s.toLowerCase().includes(inputValue.replace("#", "").toLowerCase())
                  )
                  .map((s) => {
                    const normalized = s.startsWith("#") ? s : `#${s}`;
                    return (
                      <li key={normalized}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-1.5 text-sm font-montserrat text-[#00101A] hover:bg-[#FFF8E1] transition-colors"
                          onClick={() => addTag(s)}
                        >
                          {normalized}
                        </button>
                      </li>
                    );
                  })}
                {inputValue.trim() && (
                  <li>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-1.5 text-sm font-montserrat text-[#00101A] hover:bg-[#FFF8E1] transition-colors"
                      onClick={() => addTag(inputValue)}
                    >
                      + Add &quot;{inputValue.startsWith("#") ? inputValue : `#${inputValue}`}&quot;
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Chips */}
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFEA9E] border border-[#998C5F] text-sm font-bold font-montserrat text-[#00101A] h-8"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            aria-label={`Remove ${tag}`}
            className="flex items-center justify-center w-4 h-4 rounded-full bg-[#D4271D] hover:bg-red-700 transition-colors"
          >
            {/* Close tiny icon */}
            <svg width="10" height="10" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 4L4 13M4 4l9 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </span>
      ))}

      {/* Max guard message */}
      {atMax && (
        <span className="text-xs font-bold font-montserrat text-[#D4271D] self-center">
          {t("hashtagMaxError")}
        </span>
      )}

      {/* Validation error */}
      {error && !atMax && (
        <p className="w-full text-xs text-[#D4271D] font-montserrat mt-1">{error}</p>
      )}
      {showMaxError && !atMax && (
        <p className="w-full text-xs text-[#D4271D] font-montserrat mt-1">{t("hashtagMaxError")}</p>
      )}
    </div>
  );
}
