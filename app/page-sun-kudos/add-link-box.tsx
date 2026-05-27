"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface AddLinkBoxProps {
  open: boolean;
  onClose: () => void;
  /** Called with validated label + url when the user saves. */
  onInsert: (text: string, url: string) => void;
}

interface LinkErrors {
  text?: string;
  url?: string;
}

const TEXT_MAX = 100;
const URL_MIN = 5;
const URL_MAX = 2048;

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (u.protocol === "http:" || u.protocol === "https:") && !!u.hostname;
  } catch {
    return false;
  }
}

export default function AddLinkBox({ open, onClose, onInsert }: AddLinkBoxProps) {
  const t = useTranslations("AddLink");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<LinkErrors>({});

  // Reset on open; close on Escape.
  useEffect(() => {
    if (open) {
      setText("");
      setUrl("");
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function validate(): LinkErrors {
    const errs: LinkErrors = {};
    const trimmedText = text.trim();
    if (!trimmedText) errs.text = t("errorRequired");
    else if (trimmedText.length > TEXT_MAX) errs.text = t("errorTextTooLong");

    const trimmedUrl = url.trim();
    if (!trimmedUrl) errs.url = t("errorRequired");
    else if (trimmedUrl.length < URL_MIN || trimmedUrl.length > URL_MAX)
      errs.url = t("errorUrlLength");
    else if (!isValidHttpUrl(trimmedUrl)) errs.url = t("errorUrlFormat");
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onInsert(text.trim(), url.trim());
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="w-full max-w-[760px] rounded-[24px] bg-[#FCF3D6] p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-2xl font-bold font-[Montserrat] text-[#00101A]">
          {t("title")}
        </h2>

        {/* Text / Nội dung */}
        <div className="mb-4 flex items-center gap-4">
          <label
            htmlFor="addlink-text"
            className="w-20 flex-shrink-0 text-base font-bold font-[Montserrat] text-[#00101A]"
          >
            {t("contentLabel")}
          </label>
          <div className="flex-1">
            <input
              id="addlink-text"
              type="text"
              value={text}
              maxLength={TEXT_MAX}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value.trim()) setErrors((p) => ({ ...p, text: undefined }));
              }}
              className={`h-14 w-full rounded-lg border bg-white px-4 text-base font-[Montserrat] text-[#00101A] outline-none focus:border-[#00101A] ${
                errors.text ? "border-[#D4271D]" : "border-[#998C5F]"
              }`}
            />
            {errors.text && (
              <p className="mt-1 text-xs text-[#D4271D] font-[Montserrat]">{errors.text}</p>
            )}
          </div>
        </div>

        {/* URL */}
        <div className="mb-8 flex items-center gap-4">
          <label
            htmlFor="addlink-url"
            className="w-20 flex-shrink-0 text-base font-bold font-[Montserrat] text-[#00101A]"
          >
            {t("urlLabel")}
          </label>
          <div className="flex-1">
            <input
              id="addlink-url"
              type="url"
              inputMode="url"
              value={url}
              maxLength={URL_MAX}
              placeholder="https://"
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value.trim()) setErrors((p) => ({ ...p, url: undefined }));
              }}
              className={`h-14 w-full rounded-lg border bg-white px-4 text-base font-[Montserrat] text-[#00101A] placeholder:text-[#999] outline-none focus:border-[#00101A] ${
                errors.url ? "border-[#D4271D]" : "border-[#998C5F]"
              }`}
            />
            {errors.url && (
              <p className="mt-1 text-xs text-[#D4271D] font-[Montserrat]">{errors.url}</p>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded border border-[#998C5F] bg-[rgba(255,234,158,0.10)] px-8 py-4 text-base font-bold font-[Montserrat] text-[#00101A] transition-colors hover:bg-[rgba(255,234,158,0.25)]"
          >
            {t("cancel")}
            <Image src="/sun-kudos/icon-close.svg" alt="" width={20} height={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFEA9E] py-4 text-lg font-bold font-[Montserrat] text-[#00101A] transition-all hover:brightness-95"
          >
            {t("save")}
            <Image
              src="/sun-kudos/icon-link.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
