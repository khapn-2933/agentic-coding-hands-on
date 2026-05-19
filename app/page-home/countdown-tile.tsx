interface CountdownTileProps {
  value: string;
  label: string;
}

// Per Figma I2268:35141 (Group 5): 77×123 tile, 0.75px cream border, opacity 0.5,
// gradient bg (#FFF 0% → 10% white), border-radius 12px, backdrop-filter blur(24.96px).
// Digit text uses DSEG7 (LCD 7-segment) as the closest readily-available font to
// Figma's "Digital Numbers". Rendered white at ~74px.
function LcdDigit({ digit }: { digit: string }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden h-[123px] w-[77px] rounded-[12px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.05) 100%)",
        border: "0.75px solid #FFEA9E",
        backdropFilter: "blur(24.96px)",
        WebkitBackdropFilter: "blur(24.96px)",
      }}
    >
      <span
        className="select-none"
        style={{
          fontFamily: '"DSEG7 Classic", monospace',
          fontSize: "74px",
          lineHeight: 1,
          color: "#FFFFFF",
          textShadow: "0 0 8px rgba(255, 234, 158, 0.4)",
          paddingBottom: "4px",
        }}
      >
        {digit}
      </span>
    </div>
  );
}

export default function CountdownTile({ value, label }: CountdownTileProps) {
  const [d1, d2] = value.padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center gap-[21px]">
      <div className="flex items-center gap-[21px]">
        <LcdDigit digit={d1 ?? "0"} />
        <LcdDigit digit={d2 ?? "0"} />
      </div>
      <span className="text-4xl font-bold leading-[48px] text-white">
        {label}
      </span>
    </div>
  );
}
