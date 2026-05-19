"use client";

export interface AwardNavItem {
  id: string;
  label: string;
}

export interface AwardNavProps {
  items: readonly AwardNavItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function AwardNav({ items, activeId, onSelect }: AwardNavProps) {
  return (
    <nav
      aria-label="Hệ thống giải thưởng"
      className="sticky top-20 z-30 bg-[#00101A] py-3 -my-3 lg:top-28 lg:py-0 lg:my-0 lg:self-start"
    >
      {/* Desktop: vertical list */}
      <ul className="hidden lg:flex lg:flex-col lg:gap-5">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "true" : undefined}
                className={`text-left text-base transition-colors duration-150 ${
                  isActive
                    ? "text-[#FFEA9E] font-semibold underline underline-offset-4"
                    : "text-white/70 hover:text-white"
                }`}
              >
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
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-[#FFEA9E] text-[#00101A] font-semibold"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
