interface CountdownTileProps {
  value: string; // always 2 chars, zero-padded
  label: string;
}

export default function CountdownTile({ value, label }: CountdownTileProps) {
  const [d1, d2] = value.split("");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {[d1, d2].map((digit, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center w-14 h-16 md:w-16 md:h-20 rounded-md"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span
              className="text-4xl md:text-5xl font-bold tabular-nums leading-none"
              style={{ color: "#B0B8C1", fontFamily: "var(--font-montserrat), monospace" }}
            >
              {digit ?? "0"}
            </span>
          </div>
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}
