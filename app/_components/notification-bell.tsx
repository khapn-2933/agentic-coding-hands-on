"use client";

import { useRef, useState } from "react";
import { useCloseOnOutside } from "@/lib/use-close-on-outside";

function BellIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2.5C7.96 2.5 5.5 4.96 5.5 8V14L3.5 16V17H18.5V16L16.5 14V8C16.5 4.96 14.04 2.5 11 2.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 17C9 18.1 9.9 19 11 19C12.1 19 13 18.1 13 17"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutside(containerRef, open, () => setOpen(false));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
      >
        <BellIcon />
        {/* Stub: always show unread badge */}
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFEA9E]"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-white/15 bg-[#0B0F12] shadow-xl z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white">Thông báo</p>
          </div>
          {/* Stub: empty state */}
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-white/40">Chưa có thông báo</p>
          </div>
        </div>
      )}
    </div>
  );
}
