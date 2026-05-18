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
  const OFF = "rgba(255,255,255,0.10)";

  return (
    <svg viewBox="0 0 51 82" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block h-full w-full">
      <defs>
        <linearGradient id="lcdBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F8FA" />
          <stop offset="55%" stopColor="#C9CDD2" />
          <stop offset="100%" stopColor="#8B939B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="51" height="82" rx="4" fill="url(#lcdBg)" />
      {/* segment a — top horizontal */}
      <polygon points="11,8 40,8 36,12 15,12" fill={a ? ON : OFF} />
      {/* segment b — top right vertical */}
      <polygon points="42,10 42,38 38,41 38,14" fill={b ? ON : OFF} />
      {/* segment c — bottom right vertical */}
      <polygon points="42,44 42,72 38,68 38,41" fill={c ? ON : OFF} />
      {/* segment d — bottom horizontal */}
      <polygon points="11,74 40,74 36,70 15,70" fill={d ? ON : OFF} />
      {/* segment e — bottom left vertical */}
      <polygon points="9,44 9,72 13,68 13,41" fill={e ? ON : OFF} />
      {/* segment f — top left vertical */}
      <polygon points="9,10 9,38 13,41 13,14" fill={f ? ON : OFF} />
      {/* segment g — middle horizontal */}
      <polygon points="13,41 15,38 36,38 38,41 36,44 15,44" fill={g ? ON : OFF} />
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
