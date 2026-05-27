"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import WriteKudoHashtags from "./write-kudo-hashtags";
import WriteKudoImages, { type ImagePreview } from "./write-kudo-images";

// ─── Public types ────────────────────────────────────────────────────────────

export interface WriteKudoPayload {
  recipientId: string;
  title: string;
  content: string;
  hashtags: string[];
  isAnonymous: boolean;
  anonymousName?: string;
}

export interface WriteKudoModalProps {
  open: boolean;
  onClose: () => void;
  recipientOptions: {
    id: string;
    name: string;
    department: string;
    avatarUrl: string;
  }[];
  hashtagSuggestions: string[];
  onSubmit: (payload: WriteKudoPayload) => Promise<void> | void;
}

// ─── Form state ──────────────────────────────────────────────────────────────

interface FormState {
  recipientId: string;
  recipientName: string;
  title: string;
  content: string;
  hashtags: string[];
  images: ImagePreview[];
  isAnonymous: boolean;
  anonymousName: string;
}

interface FormErrors {
  recipient?: string;
  content?: string;
  hashtags?: string;
  imageType?: string;
  submit?: string;
}

function emptyForm(): FormState {
  return {
    recipientId: "",
    recipientName: "",
    title: "",
    content: "",
    hashtags: [],
    images: [],
    isAnonymous: false,
    anonymousName: "",
  };
}

// ─── Toolbar button ──────────────────────────────────────────────────────────

function ToolbarBtn({
  label,
  children,
  first,
  last,
}: {
  label: string;
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  const radius = first
    ? "rounded-tl-lg rounded-bl-none rounded-tr-none rounded-br-none"
    : last
      ? "rounded-tr-lg rounded-tl-none rounded-bl-none rounded-br-none"
      : "rounded-none";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex items-center justify-center w-14 h-10 border border-[#998C5F] bg-transparent hover:bg-[#FFF8E1] transition-colors ${radius}`}
    >
      {children}
    </button>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export default function WriteKudoModal({
  open,
  onClose,
  recipientOptions,
  hashtagSuggestions,
  onSubmit,
}: WriteKudoModalProps) {
  const t = useTranslations("WriteKudo");

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(emptyForm());
      setErrors({});
      setSearchQuery("");
      setDropdownOpen(false);
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // Esc key closes modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Recipient search ───────────────────────────────────────────────────────

  const filteredRecipients = recipientOptions.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  function selectRecipient(r: (typeof recipientOptions)[number]) {
    setForm((prev) => ({
      ...prev,
      recipientId: r.id,
      recipientName: r.name,
    }));
    setSearchQuery(r.name);
    setDropdownOpen(false);
    setErrors((prev) => ({ ...prev, recipient: undefined }));
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setDropdownOpen(true);
    // If user clears the field, unset selection
    if (!e.target.value.trim()) {
      setForm((prev) => ({ ...prev, recipientId: "", recipientName: "" }));
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.recipientId) errs.recipient = t("errorRequired");
    if (!form.content.trim()) errs.content = t("errorRequired");
    if (form.hashtags.length === 0) errs.hashtags = t("errorMinOneHashtag");
    return errs;
  }

  const isValid =
    !!form.recipientId && !!form.content.trim() && form.hashtags.length > 0;

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        recipientId: form.recipientId,
        title: form.title,
        content: form.content,
        hashtags: form.hashtags,
        isAnonymous: form.isAnonymous,
        anonymousName: form.anonymousName || undefined,
      });
      onClose();
    } catch {
      // Keep the modal open and show a generic message instead of crashing
      // the React error boundary with a raw server error.
      setErrors((prev) => ({ ...prev, submit: t("submitFailed") }));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Image helpers ──────────────────────────────────────────────────────────

  const handleImageChange = useCallback((images: ImagePreview[]) => {
    setForm((prev) => ({ ...prev, images }));
  }, []);

  const handleImageTypeError = useCallback(() => {
    setErrors((prev) => ({ ...prev, imageType: t("imageTypeError") }));
    // Auto-clear after 4 s
    setTimeout(() => {
      setErrors((prev) => ({ ...prev, imageType: undefined }));
    }, 4000);
  }, [t]);

  if (!open) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t("modalTitle")}
    >
      {/* Modal card */}
      <div
        ref={scrollRef}
        className="relative w-full max-w-[752px] mx-4 max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFF8E1] p-10 flex flex-col gap-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

          {/* ── Section A: Title ──────────────────────────────────────────── */}
          <h2 className="text-[32px] font-bold font-[Montserrat] text-[#00101A] text-center leading-10">
            {t("modalTitle")}
          </h2>

          {/* ── Section B: Người nhận ─────────────────────────────────────── */}
          <div className="flex flex-row items-center gap-4">
            {/* Label */}
            <div className="flex items-center gap-0.5 shrink-0 w-[146px]">
              <span className="text-[22px] font-bold font-[Montserrat] text-[#00101A] leading-7">
                {t("recipientLabel")}
              </span>
              <span className="text-base font-bold font-[Noto_Sans_JP] text-[#CF1322] leading-5">
                *
              </span>
            </div>

            {/* Search input + dropdown */}
            <div className="relative flex-1" ref={searchRef}>
              <div
                className={`flex items-center justify-between px-6 py-4 rounded-lg border bg-white cursor-text ${
                  errors.recipient ? "border-[#D4271D]" : "border-[#998C5F]"
                }`}
                onClick={() => setDropdownOpen(true)}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder={t("recipientPlaceholder")}
                  className="flex-1 text-base font-bold font-[Montserrat] text-[#999] placeholder:text-[#999] bg-transparent outline-none leading-6"
                  aria-autocomplete="list"
                  aria-expanded={dropdownOpen}
                />
                {/* Chevron down */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 ml-2">
                  <path d="M6 9l6 6 6-6" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Dropdown list */}
              {dropdownOpen && filteredRecipients.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-[#998C5F] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredRecipients.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF8E1] transition-colors text-left"
                        onMouseDown={(e) => {
                          // mousedown fires before blur; prevent input blur before select
                          e.preventDefault();
                          selectRecipient(r);
                        }}
                      >
                        <Image
                          src={r.avatarUrl}
                          alt={r.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold font-[Montserrat] text-[#00101A] truncate">
                            {r.name}
                          </p>
                          <p className="text-xs font-[Montserrat] text-[#999] truncate">
                            {r.department}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {errors.recipient && (
                <p className="mt-1 text-xs text-[#D4271D] font-[Montserrat]">
                  {errors.recipient}
                </p>
              )}
            </div>
          </div>

          {/* ── Section: Danh hiệu ────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-4">
              {/* Label */}
              <div className="flex items-center gap-0.5 shrink-0 w-[146px]">
                <span className="text-[22px] font-bold font-[Montserrat] text-[#00101A] leading-7">
                  {t("titleLabel")}
                </span>
                <span className="text-base font-bold font-[Noto_Sans_JP] text-[#CF1322] leading-5">
                  *
                </span>
              </div>

              {/* Input */}
              <div className="flex-1 border border-[#998C5F] rounded-lg bg-white px-6 py-4">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder={t("titlePlaceholder")}
                  className="w-full text-base font-bold font-[Montserrat] text-[#999] placeholder:text-[#999] bg-transparent outline-none leading-6"
                />
              </div>
            </div>

            {/* Helper lines */}
            <div className="ml-[162px] text-base font-bold font-[Montserrat] text-[#999] leading-6 tracking-[0.15px]">
              <p>{t("titleHelperExample")}</p>
              <p>{t("titleHelperNote")}</p>
            </div>
          </div>

          {/* ── Section C+D: Nội dung ─────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            {/* Toolbar row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ToolbarBtn label="Bold" first>
                  <Image src="/sun-kudos/icon-bold.svg" alt="Bold" width={24} height={24} />
                </ToolbarBtn>
                <ToolbarBtn label="Italic">
                  <Image src="/sun-kudos/icon-italic.svg" alt="Italic" width={24} height={24} />
                </ToolbarBtn>
                <ToolbarBtn label="Strikethrough">
                  <Image src="/sun-kudos/icon-strikethrough.svg" alt="Strikethrough" width={24} height={24} />
                </ToolbarBtn>
                <ToolbarBtn label="Numbered list">
                  <Image src="/sun-kudos/icon-number-list.svg" alt="Numbered list" width={24} height={24} />
                </ToolbarBtn>
                <ToolbarBtn label="Link">
                  <Image src="/sun-kudos/icon-link.svg" alt="Link" width={24} height={24} />
                </ToolbarBtn>
                <ToolbarBtn label="Quote" last>
                  <Image src="/sun-kudos/icon-quote.svg" alt="Quote" width={24} height={24} />
                </ToolbarBtn>
              </div>
              <button
                type="button"
                className="text-base font-bold font-[Montserrat] text-[#E46060] leading-6 tracking-[0.15px] hover:underline"
              >
                {t("communityStandards")}
              </button>
            </div>

            {/* Textarea */}
            <textarea
              value={form.content}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, content: e.target.value }));
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              placeholder={t("contentPlaceholder")}
              rows={6}
              className={`w-full min-h-[120px] px-6 py-4 border rounded-bl-lg rounded-br-lg bg-white text-base font-[Montserrat] text-[#00101A] placeholder:text-[#999] outline-none resize-y leading-6 ${
                errors.content ? "border-[#D4271D]" : "border-[#998C5F]"
              }`}
            />

            {errors.content && (
              <p className="text-xs text-[#D4271D] font-[Montserrat]">
                {errors.content}
              </p>
            )}

            {/* Mention hint */}
            <p className="text-base font-bold font-[Montserrat] text-[#00101A] leading-6 tracking-[0.5px] text-right">
              {t("contentMentionHint")}
            </p>
          </div>

          {/* ── Section E: Hashtag ────────────────────────────────────────── */}
          <div className="flex flex-row items-start gap-4">
            <div className="flex items-center gap-0.5 shrink-0 w-[108px] pt-2">
              <span className="text-[22px] font-bold font-[Montserrat] text-[#00101A] leading-7">
                {t("hashtagLabel")}
              </span>
              <span className="text-base font-bold font-[Noto_Sans_JP] text-[#CF1322] leading-5">
                *
              </span>
            </div>

            <div className="flex-1">
              <WriteKudoHashtags
                tags={form.hashtags}
                suggestions={hashtagSuggestions}
                error={errors.hashtags}
                onChange={(tags) => {
                  setForm((prev) => ({ ...prev, hashtags: tags }));
                  if (tags.length > 0) {
                    setErrors((prev) => ({ ...prev, hashtags: undefined }));
                  }
                }}
              />
            </div>
          </div>

          {/* ── Section F: Image ──────────────────────────────────────────── */}
          <div className="flex flex-row items-start gap-4">
            <div className="flex items-center gap-0.5 shrink-0 w-[74px] pt-2">
              <span className="text-[22px] font-bold font-[Montserrat] text-[#00101A] leading-7">
                {t("imageLabel")}
              </span>
            </div>
            <div className="flex-1">
              <WriteKudoImages
                images={form.images}
                typeError={errors.imageType}
                onChange={handleImageChange}
                onTypeError={handleImageTypeError}
              />
            </div>
          </div>

          {/* ── Section G: Anonymous ──────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                role="checkbox"
                aria-checked={form.isAnonymous}
                tabIndex={0}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isAnonymous: !prev.isAnonymous,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setForm((prev) => ({
                      ...prev,
                      isAnonymous: !prev.isAnonymous,
                    }));
                  }
                }}
                className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  form.isAnonymous
                    ? "bg-[#FFEA9E] border-[#998C5F]"
                    : "bg-white border-[#999]"
                }`}
              >
                {form.isAnonymous && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 7l4 4 6-6" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[22px] font-bold font-[Montserrat] text-[#999] leading-7">
                {t("anonymousLabel")}
              </span>
            </label>

            {/* Reveal anonymous name field when checked */}
            {form.isAnonymous && (
              <div className="ml-10">
                <input
                  type="text"
                  value={form.anonymousName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      anonymousName: e.target.value,
                    }))
                  }
                  placeholder={t("anonymousNamePlaceholder")}
                  className="w-full border border-[#998C5F] rounded-lg bg-white px-6 py-3 text-base font-[Montserrat] text-[#00101A] placeholder:text-[#999] outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit error (server-side failure) */}
          {errors.submit && (
            <p className="text-sm font-[Montserrat] text-[#D4271D]" role="alert">
              {errors.submit}
            </p>
          )}

          {/* ── Section H: Footer buttons ─────────────────────────────────── */}
          <div className="flex flex-row items-center gap-6">
            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-10 py-4 border border-[#998C5F] rounded bg-[rgba(255,234,158,0.10)] text-base font-bold font-[Montserrat] text-[#00101A] hover:bg-[rgba(255,234,158,0.25)] transition-colors"
            >
              {t("cancelButton")}
              {/* Close icon */}
              <Image src="/sun-kudos/icon-close.svg" alt="" width={24} height={24} aria-hidden="true" />
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="flex-1 flex items-center justify-center gap-2 h-[60px] rounded-lg bg-[#FFEA9E] text-[22px] font-bold font-[Montserrat] text-[#00101A] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:brightness-95"
            >
              {submitting ? (
                /* Loading spinner */
                <svg className="animate-spin w-5 h-5 text-[#00101A]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  {t("submitButton")}
                  {/* Send icon — existing asset, overriding fill via CSS filter */}
                  <Image src="/sun-kudos/icon-send.svg" alt="" width={24} height={24} aria-hidden="true" className="[filter:invert(1)_sepia(1)_saturate(0)_brightness(0)]" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
