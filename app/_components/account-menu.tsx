"use client";

import { useRef, useState } from "react";
import { useCloseOnOutside } from "@/lib/use-close-on-outside";

export interface AccountMenuProps {
  email: string;
  isAdmin?: boolean;
}

function UserCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="7" r="3" stroke="white" strokeWidth="1.5" />
      <path
        d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
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

export default function AccountMenu({ email, isAdmin = false }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnOutside(containerRef, open, () => setOpen(false));

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFEA9E] text-[#00101A] text-xs font-bold leading-none">
          {initials}
        </span>
        <span className="max-w-[120px] truncate text-sm">{email}</span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-white/15 bg-[#0B0F12] shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs text-white/40">Tài khoản</p>
            <p className="text-sm font-medium text-white truncate">{email}</p>
          </div>

          <ul role="menu">
            <li role="presentation">
              <a
                href="/profile"
                role="menuitem"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors"
              >
                <UserCircleIcon />
                Profile
              </a>
            </li>

            {isAdmin && (
              <li role="presentation">
                <a
                  href="/admin"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#FFEA9E] hover:bg-white/5 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="#FFEA9E"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="11"
                      y="2"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="#FFEA9E"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="2"
                      y="11"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="#FFEA9E"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="11"
                      y="11"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="#FFEA9E"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Admin Dashboard
                </a>
              </li>
            )}

            <li role="presentation" className="border-t border-white/10">
              <form action="/auth/sign-out" method="post">
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors text-left"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13 14l3-4-3-4M16 10H8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
