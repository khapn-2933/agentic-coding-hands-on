import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AwardsTitle() {
  const t = await getTranslations("AwardsPage");
  return (
    <>
      {/* Keyvisual strip — 1440×547 per Figma node 313:8437. Tree art bg + ROOT FURTHER overlay. */}
      <div className="relative w-full h-[360px] md:h-[460px] lg:h-[547px] overflow-hidden">
        <Image
          src="/homepage-keyvisual.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 65%" }}
        />
        {/* Left fade keeps the ROOT FURTHER logo readable against the artwork. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #00101A 0%, rgba(0, 16, 26, 0.35) 35%, rgba(0, 16, 26, 0) 60%)",
          }}
        />
        {/* Bottom fade blends keyvisual into the title area below — Figma "Cover" gradient (313:8439). */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 16, 26, 0) 0%, #00101A 100%)",
          }}
        />
        {/* ROOT FURTHER overlay — Figma Frame 482 at left=144, top=184 (header is 80px so 104 from strip top). */}
        <div className="absolute inset-x-0 top-0 px-4 md:px-18 lg:px-36 pt-[80px] md:pt-[100px] lg:pt-[104px]">
          <Image
            src="/root-further.png"
            alt="ROOT FURTHER"
            width={338}
            height={150}
            priority
            className="h-auto w-[180px] md:w-[260px] lg:w-[338px]"
          />
        </div>
      </div>

      <section className="w-full px-4 md:px-18 lg:px-36 pt-4 pb-4 lg:pb-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <p className="text-2xl font-bold leading-8 text-white text-center">
            {t("subtitle")}
          </p>
          <div className="h-px w-full bg-[#2E3940]" />
          <div className="flex justify-center">
            <h1
              className="text-4xl md:text-5xl lg:text-[57px] lg:leading-[64px] font-bold text-[#FFEA9E] text-left"
              style={{ letterSpacing: "-0.25px" }}
            >
              {t("title")}
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
