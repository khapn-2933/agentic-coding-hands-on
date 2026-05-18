"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTile from "./countdown-tile";

export interface HeroCountdownProps {
  eventStartAt: string;
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

  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), isPast: false };
}

export default function HeroCountdown({ eventStartAt }: HeroCountdownProps) {
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: "00",
    hours: "00",
    minutes: "00",
    isPast: true,
  });

  useEffect(() => {
    setCountdown(computeCountdown(eventStartAt));
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
    <section className="relative min-h-screen overflow-hidden">
      {/* Background key visual — artwork on the right side */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepage-keyvisual.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Left fade so content remains legible against the artwork */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0, 16, 26, 0) 100%)",
          }}
        />
        {/* Bottom fade into the next section */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0) 51.74%)",
          }}
        />
      </div>

      {/* Content — left aligned, sits over the dark side */}
      <div className="relative z-10 flex flex-col min-h-screen justify-center px-6 md:px-18 lg:px-36 pt-32 pb-24 gap-8">
        <Image
          src="/root-further.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          priority
          className="h-auto w-[280px] sm:w-[360px] md:w-[451px]"
        />

        <div className="flex flex-col gap-4">
          {showComingSoon && (
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/80">
              Coming soon
            </p>
          )}

          <div className="flex items-start gap-3 md:gap-5">
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
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-white/80">
            <span className="font-semibold">Thời gian:</span> {eventDate}
            <span className="mx-3 text-white/30">|</span>
            <span className="font-semibold">Địa điểm:</span> Âu Cơ Art Center
          </p>
          <p className="text-sm text-white/60">
            Tường thuật trực tiếp qua sóng Livestream
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-[#00101A] bg-[#FFEA9E] hover:bg-[#ffe47a] transition-colors"
          >
            ABOUT AWARDS
            <span aria-hidden="true">↗</span>
          </Link>
          <Link
            href="/sun-kudos"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-white border border-white/60 hover:bg-white/10 transition-colors"
          >
            ABOUT KUDOS
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
