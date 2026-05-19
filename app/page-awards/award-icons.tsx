interface IconProps {
  className?: string;
}

/** Target / bullseye with arrow indicator — used in nav items and award row titles. */
export function TargetIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8.5L12 6M15.5 12L18 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.5 9.5L17.5 6.5M17.5 6.5H15M17.5 6.5V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Diamond gem — used in row "Số lượng giải thưởng" line. */
export function DiamondIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4h12l3.5 5.5L12 21 2.5 9.5 6 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.5h19M9 4l-2 5.5L12 21M15 4l2 5.5L12 21"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Medal with ribbons — used in row "Giá trị giải thưởng" line. */
export function LicenseIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
