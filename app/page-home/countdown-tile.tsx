interface CountdownTileProps {
  value: string;
  label: string;
}

const SEGMENT_MAP: Record<string, [boolean, boolean, boolean, boolean, boolean, boolean, boolean]> = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true],
};

function LcdDigit({ digit }: { digit: string }) {
  const [a, b, c, d, e, f, g] = SEGMENT_MAP[digit] ?? SEGMENT_MAP["0"];
  const ON = "#FFFFFF";
  const OFF = "rgba(120, 130, 140, 0.18)";

  return (
    <svg viewBox="0 0 51 82" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block h-full w-full">
      <defs>
        <linearGradient id="lcdBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E5E9" />
          <stop offset="100%" stopColor="#A8B0B8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="51" height="82" rx="4" fill="url(#lcdBg)" />
      {/* segment a — top horizontal */}
      <polygon points="11,6 40,6 35,12 16,12" fill={a ? ON : OFF} />
      {/* segment b — top right vertical */}
      <polygon points="42,8 42,38 37,40 37,13" fill={b ? ON : OFF} />
      {/* segment c — bottom right vertical */}
      <polygon points="42,44 42,74 37,69 37,42" fill={c ? ON : OFF} />
      {/* segment d — bottom horizontal */}
      <polygon points="11,76 40,76 35,70 16,70" fill={d ? ON : OFF} />
      {/* segment e — bottom left vertical */}
      <polygon points="9,44 9,74 14,69 14,42" fill={e ? ON : OFF} />
      {/* segment f — top left vertical */}
      <polygon points="9,8 9,38 14,40 14,13" fill={f ? ON : OFF} />
      {/* segment g — middle horizontal */}
      <polygon points="14,41 16,38 35,38 37,41 35,44 16,44" fill={g ? ON : OFF} />
    </svg>
  );
}

export default function CountdownTile({ value, label }: CountdownTileProps) {
  const [d1, d2] = value.padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-start gap-[14px]">
      <div className="flex items-center gap-[14px]">
        <div className="h-[82px] w-[51px]">
          <LcdDigit digit={d1 ?? "0"} />
        </div>
        <div className="h-[82px] w-[51px]">
          <LcdDigit digit={d2 ?? "0"} />
        </div>
      </div>
      <span className="text-2xl font-bold leading-[32px] text-white">
        {label}
      </span>
    </div>
  );
}
