import Image from "next/image";

export default function HeroArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Shared key visual: spans hero + explainer per Figma mms_3.5_Keyvisual (1512×1392). */}
      <div className="absolute inset-x-0 top-0 h-[1480px] z-0 pointer-events-none overflow-hidden">
        <Image
          src="/homepage-keyvisual.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Left fade so left-side content stays legible against the artwork. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #00101A 0%, #00101A 22%, rgba(0, 16, 26, 0) 100%)",
          }}
        />
        {/* Figma "Cover" rectangle: 12deg dark fade from bottom to mid-page. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(12deg, #00101A 23.7%, rgba(0, 18, 29, 0.46) 38.34%, rgba(0, 19, 32, 0) 48.92%)",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
