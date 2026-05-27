"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import WriteKudoModal, { type WriteKudoPayload } from "./write-kudo-modal";
import { createKudos } from "@/lib/sun-kudos/actions";
import type { RecipientOption } from "@/lib/sun-kudos/queries";

interface KudosHeroProps {
  recipientOptions: RecipientOption[];
  hashtagSuggestions: string[];
}

export default function KudosHero({
  recipientOptions,
  hashtagSuggestions,
}: KudosHeroProps) {
  const t = useTranslations("SunKudos");
  const router = useRouter();
  const [composeOpen, setComposeOpen] = useState(false);

  async function handleCreate(payload: WriteKudoPayload) {
    const res = await createKudos({
      recipientId: payload.recipientId,
      title: payload.title,
      content: payload.content,
      hashtags: payload.hashtags,
      isAnonymous: payload.isAnonymous,
      anonymousName: payload.anonymousName,
    });
    // Throwing keeps the modal open; on success the modal closes itself.
    if (!res.ok) throw new Error(res.error ?? "create_failed");
    router.refresh();
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "512px" }}>
      {/* KV Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/sun-kudos/kv-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,16,26,0.15) 0%, rgba(0,16,26,0.05) 50%, rgba(0,16,26,0.5) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full min-h-[512px] px-6 md:px-36">
        {/* Title text */}
        <div className="mb-2">
          <h1
            className="font-bold leading-[44px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "36px",
              color: "#FFEA9E",
              letterSpacing: "0px",
            }}
          >
            {t("heroTitle")}
          </h1>
        </div>

        {/* Kudos wordmark */}
        <div className="mb-8">
          <Image
            src="/kudos-wordmark.png"
            alt="SAA Kudos"
            width={593}
            height={104}
            className="object-contain"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Input area: two pills */}
        <div className="flex flex-col md:flex-row gap-3 w-full max-w-[1152px]">
          {/* Send kudos input pill */}
          <div
            className="flex-1 flex items-center gap-3 px-5 py-4 rounded-full cursor-text transition-colors hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,234,158,0.4)",
              backdropFilter: "blur(8px)",
            }}
            role="button"
            tabIndex={0}
            aria-label={t("sendKudosPlaceholder")}
            onClick={() => setComposeOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setComposeOpen(true);
              }
            }}
          >
            {/* Pencil icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
                fill="#FFEA9E"
              />
            </svg>
            <span
              className="flex-1 text-sm"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {t("sendKudosPlaceholder")}
            </span>
          </div>

          {/* Search profile pill */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full cursor-text transition-colors hover:bg-white/10 md:max-w-[280px]"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,234,158,0.4)",
              backdropFilter: "blur(8px)",
            }}
            role="button"
            tabIndex={0}
            aria-label={t("searchProfilePlaceholder")}
            onClick={() => {}}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault();
            }}
          >
            {/* Magnifier icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
                fill="#FFEA9E"
              />
            </svg>
            <span
              className="text-sm whitespace-nowrap"
              style={{
                fontFamily: "Montserrat, sans-serif",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {t("searchProfilePlaceholder")}
            </span>
          </div>
        </div>
      </div>

      <WriteKudoModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        recipientOptions={recipientOptions}
        hashtagSuggestions={hashtagSuggestions}
        onSubmit={handleCreate}
      />
    </section>
  );
}
