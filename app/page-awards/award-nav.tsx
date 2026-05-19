"use client";

import { TargetIcon } from "./award-icons";

export interface AwardNavItem {
  id: string;
  label: string;
}

export interface AwardNavProps {
  items: readonly AwardNavItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

// Per Figma C_Menu list: each item is a 14px Montserrat 700 link with a
// 24x24 Target icon and 4px gap, padded 16px. Active items get cream
// color + 1px bottom border + warm glow text-shadow.
const ACTIVE_TEXT_SHADOW =
  "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";

export default function AwardNav({ items, activeId, onSelect }: AwardNavProps) {
  return (
    <nav
      aria-label="Hệ thống giải thưởng"
      className="sticky top-20 z-30 bg-[#00101A] py-3 -my-3 lg:top-28 lg:py-0 lg:my-0 lg:self-start"
    >
      {/* Desktop: vertical list — Figma C_Menu list (313:8459): 178px wide, 16px gap, items 16px padded */}
      <ul className="hidden lg:flex lg:flex-col lg:gap-4 lg:w-[178px]">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="flex">
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex items-center gap-1 px-4 py-4 rounded-[4px] text-sm font-bold tracking-[0.25px] leading-5 text-left transition-colors duration-150 ${
                  isActive
                    ? "text-[#FFEA9E] border-b border-[#FFEA9E]"
                    : "text-white/70 hover:text-white"
                }`}
                style={isActive ? { textShadow: ACTIVE_TEXT_SHADOW } : undefined}
              >
                <TargetIcon className="shrink-0" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile/tablet: horizontal scroll pill bar */}
      <ul className="flex lg:hidden gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="snap-start flex-shrink-0">
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex items-center gap-1 whitespace-nowrap px-4 py-2 rounded-[4px] text-sm font-bold tracking-[0.25px] transition-colors duration-150 ${
                  isActive
                    ? "bg-[#FFEA9E] text-[#00101A]"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <TargetIcon className="shrink-0" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
