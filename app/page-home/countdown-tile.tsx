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
  const OFF = "rgba(120, 130, 145, 0.18)";

  return (
    <svg viewBox="0 0 51 82" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block h-full w-full">
      <defs>
        <linearGradient id="lcdBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E5E8EC" />
          <stop offset="100%" stopColor="#9CA4AE" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="51" height="82" rx="4" fill="url(#lcdBg)" />
      {/* a — top horizontal (thick trapezoid) */}
      <polygon points="11,5 40,5 34,13 17,13" fill={a ? ON : OFF} />
      {/* b — top right vertical */}
      <polygon points="43,7 43,39 36,40 36,14" fill={b ? ON : OFF} />
      {/* c — bottom right vertical */}
      <polygon points="43,43 43,75 36,68 36,42" fill={c ? ON : OFF} />
      {/* d — bottom horizontal */}
      <polygon points="11,77 40,77 34,69 17,69" fill={d ? ON : OFF} />
      {/* e — bottom left vertical */}
      <polygon points="8,43 8,75 15,68 15,42" fill={e ? ON : OFF} />
      {/* f — top left vertical */}
      <polygon points="8,7 8,39 15,40 15,14" fill={f ? ON : OFF} />
      {/* g — middle horizontal (with notches) */}
      <polygon points="15,41 17,39 34,39 36,41 34,43 17,43" fill={g ? ON : OFF} />
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
