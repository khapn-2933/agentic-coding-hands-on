"use client";

function PenIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2.5l2.5 2.5-9 9H4v-2.5l9-9z"
        stroke="#00101A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunStarMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="9" r="4" fill="#00101A" />
      <circle cx="9" cy="9" r="7" stroke="#00101A" strokeWidth="1.5" />
    </svg>
  );
}

export default function WidgetButton() {
  function handleClick() {
    // TODO: Open quick-action menu (future: nominate, send kudos, etc.)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Quick actions"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 h-16 rounded-full bg-[#FFEA9E] shadow-lg hover:bg-[#ffe47a] active:scale-95 transition-all duration-150 cursor-pointer"
      style={{ width: "105px", height: "64px" }}
    >
      <PenIcon />
      <span className="text-[#00101A] font-bold text-base leading-none">/</span>
      <SunStarMark />
    </button>
  );
}
