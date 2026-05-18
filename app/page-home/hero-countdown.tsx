"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTile from "./countdown-tile";

export interface HeroCountdownProps {
  eventStartAt: string; // ISO-8601, e.g. "2025-12-26T18:30:00+07:00"
}

interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  isPast: boolean;
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, "0");
}

function computeCountdown(eventStartAt: string): CountdownValues {
  const target = new Date(eventStartAt).getTime();
  if (isNaN(target)) return { days: "00", hours: "00", minutes: "00", isPast: true };

  const diff = target - Date.now();
  if (diff <= 0) return { days: "00", hours: "00", minutes: "00", isPast: true };

  const totalMinutes = Math.floor(diff / 60_000);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    isPast: false,
  };
}

export default function HeroCountdown({ eventStartAt }: HeroCountdownProps) {
  // SSR-safe initial state: "00 00 00" to avoid hydration mismatch
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: "00",
    hours: "00",
    minutes: "00",
    isPast: true,
  });

  useEffect(() => {
    // First tick immediately after mount
    setCountdown(computeCountdown(eventStartAt));

    // Update every 60 seconds
    const timer = setInterval(() => {
      setCountdown(computeCountdown(eventStartAt));
    }, 60_000);

    return () => clearInterval(timer);
  }, [eventStartAt]);

  const showComingSoon = !countdown.isPast;

  const eventDate = (() => {
    const d = new Date(eventStartAt);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  })();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background key visual */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepage-keyvisual.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#00101A]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24 pb-16 gap-6">
        {/* ROOT FURTHER image */}
        <Image
          src="/root-further.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          priority
          className="w-auto max-w-[80vw] md:max-w-[451px]"
        />

        {/* Coming soon label */}
        {showComingSoon && (
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
            Coming soon
          </p>
        )}

        {/* Countdown grid */}
        <div className="flex items-start gap-4 md:gap-6">
          <CountdownTile value={countdown.days} label="DAYS" />
          <span className="text-4xl md:text-5xl font-bold text-white/30 mt-2 leading-none select-none">
            :
          </span>
          <CountdownTile value={countdown.hours} label="HOURS" />
          <span className="text-4xl md:text-5xl font-bold text-white/30 mt-2 leading-none select-none">
            :
          </span>
          <CountdownTile value={countdown.minutes} label="MINUTES" />
        </div>

        {/* Event info */}
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-sm text-white/70">
            Thời gian: {eventDate}&nbsp;&nbsp;&nbsp;Địa điểm: Âu Cơ Art Center
          </p>
          <p className="text-sm text-white/70">
            Tường thuật trực tiếp qua sóng Livestream
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/awards"
            className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-[#00101A] bg-[#FFEA9E] hover:bg-[#ffe47a] transition-colors"
          >
            ABOUT AWARDS
          </Link>
          <Link
            href="/sun-kudos"
            className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-white border border-white hover:bg-white/10 transition-colors"
          >
            ABOUT KUDOS
          </Link>
        </div>
      </div>
    </section>
  );
}
