import Image from "next/image";

export default function AwardsTitle() {
  return (
    <>
      {/* Keyvisual strip — ROOT FURTHER text (left) + colorful tree art (right) per Figma. */}
      <div className="relative w-full h-[300px] lg:h-[380px] overflow-hidden">
        <Image
          src="/homepage-keyvisual.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
          style={{ objectPosition: "right top" }}
        />
        {/* Left fade keeps the ROOT FURTHER logo readable against the artwork. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #00101A 0%, rgba(0, 16, 26, 0.35) 35%, rgba(0, 16, 26, 0) 65%)",
          }}
        />
        {/* Bottom fade blends keyvisual into the title area below. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 16, 26, 0) 0%, #00101A 100%)",
          }}
        />
        {/* ROOT FURTHER text overlay — Figma Frame 482 anchors it left, scaled for the awards strip. */}
        <div className="absolute inset-0 flex items-center px-4 md:px-18 lg:px-36 pt-16">
          <Image
            src="/root-further.png"
            alt="ROOT FURTHER"
            width={338}
            height={150}
            priority
            className="h-auto w-[200px] md:w-[260px] lg:w-[320px]"
          />
        </div>
      </div>

      <section className="w-full px-4 md:px-18 lg:px-36 pt-4 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
          <p className="text-base md:text-lg font-medium uppercase tracking-[0.15em] text-white/70">
            Sun* annual awards 2025
          </p>
          <h1
            className="text-4xl md:text-[57px] md:leading-[64px] font-bold text-[#FFEA9E]"
            style={{ letterSpacing: "-0.25px" }}
          >
            Hệ thống giải thưởng SAA 2025
          </h1>
        </div>
      </section>
    </>
  );
}
