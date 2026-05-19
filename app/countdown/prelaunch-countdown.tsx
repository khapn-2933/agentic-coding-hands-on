"use client";

import { useEffect, useState } from "react";
import CountdownTile from "../page-home/countdown-tile";

export interface PrelaunchCountdownProps {
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

export default function PrelaunchCountdown({ eventStartAt }: PrelaunchCountdownProps) {
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: "00",
    hours: "00",
    minutes: "00",
    isPast: true,
  });

  useEffect(() => {
    // Sync immediately on mount, then refresh every minute. The initial setState
    // is needed because the server-rendered placeholder shows 00:00:00.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(computeCountdown(eventStartAt));
    const timer = setInterval(() => setCountdown(computeCountdown(eventStartAt)), 60_000);
    return () => clearInterval(timer);
  }, [eventStartAt]);

  return (
    <section className="flex flex-col items-center gap-[60px]">
      <h1 className="text-4xl font-bold leading-[48px] text-white text-center">
        Sự kiện sẽ bắt đầu sau
      </h1>
      <div className="flex items-start gap-10 md:gap-[60px]">
        <CountdownTile value={countdown.days} label="DAYS" />
        <CountdownTile value={countdown.hours} label="HOURS" />
        <CountdownTile value={countdown.minutes} label="MINUTES" />
      </div>
    </section>
  );
}
