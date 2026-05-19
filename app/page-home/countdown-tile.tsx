interface CountdownTileProps {
  value: string;
  label: string;
}

function LcdDigit({ digit }: { digit: string }) {
  return (
    <div
      className="relative flex h-[82px] w-[51px] items-center justify-center overflow-hidden rounded-[4px]"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F0F2F5 60%, #C9D0D8 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.18)",
      }}
    >
      {/* Faint "off" digit shows all 7 segments at low opacity */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center select-none"
        style={{
          fontFamily: '"DSEG7 Classic", monospace',
          fontSize: "62px",
          lineHeight: 1,
          color: "rgba(120, 130, 145, 0.22)",
          paddingBottom: "4px",
        }}
      >
        8
      </span>
      {/* Active digit on top */}
      <span
        className="relative flex items-center justify-center select-none"
        style={{
          fontFamily: '"DSEG7 Classic", monospace',
          fontSize: "62px",
          lineHeight: 1,
          color: "#FFFFFF",
          textShadow: "0 0 6px rgba(255,255,255,0.55)",
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
    <div className="flex flex-col items-start gap-[14px]">
      <div className="flex items-center gap-[14px]">
        <LcdDigit digit={d1 ?? "0"} />
        <LcdDigit digit={d2 ?? "0"} />
      </div>
      <span className="text-2xl font-bold leading-[32px] text-white">
        {label}
      </span>
    </div>
  );
}
