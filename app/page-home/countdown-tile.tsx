interface CountdownTileProps {
  value: string;
  label: string;
  /** "sm" = homepage hero (51×82 tile); "lg" = prelaunch (77×123 tile). */
  size?: "sm" | "lg";
}

// Tile specs taken from Figma node I2167:9040 (homepage, mms_B1.3.1) and
// I2268:35141 (prelaunch, Group 5). Both share the same glass-morphism
// aesthetic (cream border, opacity 0.5, white gradient, backdrop blur).
const SIZE_CONFIG = {
  sm: {
    tileH: 82,
    tileW: 51,
    radius: 8,
    border: "0.5px",
    blur: 16.64,
    digit: 50,
    digitGlow: "0 0 6px rgba(255, 234, 158, 0.35)",
    gapDigits: 14,
    gapLabel: 14,
    label: "text-2xl leading-8",
    groupGap: 40,
  },
  lg: {
    tileH: 123,
    tileW: 77,
    radius: 12,
    border: "0.75px",
    blur: 24.96,
    digit: 74,
    digitGlow: "0 0 8px rgba(255, 234, 158, 0.4)",
    gapDigits: 21,
    gapLabel: 21,
    label: "text-4xl leading-[48px]",
    groupGap: 60,
  },
} as const;

function LcdDigit({ digit, cfg }: { digit: string; cfg: (typeof SIZE_CONFIG)[keyof typeof SIZE_CONFIG] }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        height: `${cfg.tileH}px`,
        width: `${cfg.tileW}px`,
        borderRadius: `${cfg.radius}px`,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.05) 100%)",
        border: `${cfg.border} solid #FFEA9E`,
        backdropFilter: `blur(${cfg.blur}px)`,
        WebkitBackdropFilter: `blur(${cfg.blur}px)`,
      }}
    >
      <span
        className="select-none"
        style={{
          fontFamily: '"DSEG7 Classic", monospace',
          fontSize: `${cfg.digit}px`,
          lineHeight: 1,
          color: "#FFFFFF",
          textShadow: cfg.digitGlow,
          paddingBottom: "4px",
        }}
      >
        {digit}
      </span>
    </div>
  );
}

export default function CountdownTile({ value, label, size = "lg" }: CountdownTileProps) {
  const cfg = SIZE_CONFIG[size];
  const [d1, d2] = value.padStart(2, "0").split("");

  return (
    <div
      className="flex flex-col items-start"
      style={{ gap: `${cfg.gapLabel}px` }}
    >
      <div className="flex items-center" style={{ gap: `${cfg.gapDigits}px` }}>
        <LcdDigit digit={d1 ?? "0"} cfg={cfg} />
        <LcdDigit digit={d2 ?? "0"} cfg={cfg} />
      </div>
      <span className={`${cfg.label} font-bold text-white`}>{label}</span>
    </div>
  );
}
