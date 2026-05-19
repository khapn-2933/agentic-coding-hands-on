import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SunKudosBlock() {
  const t = await getTranslations("Kudos");
  return (
    <section className="w-full bg-[#00101A] py-20 px-4 md:px-18 lg:px-36 overflow-hidden">
      <div className="mx-auto max-w-[1224px]">
        {/* Card 1120×500 per Figma SunKudos group; real bg ships the gold-ribbon artwork. */}
        <div className="relative overflow-hidden rounded-[16px] min-h-[500px]">
          <Image
            src="/kudos-bg.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1120px"
            className="object-cover object-right pointer-events-none select-none"
            priority={false}
          />

          {/* Sun* + KUDOS wordmark — anchored over the ribbon area (right side of card). */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center justify-end pr-16 z-[1]">
            <Image
              src="/kudos-wordmark.png"
              alt=""
              width={364}
              height={72}
              sizes="(min-width: 1280px) 364px, 260px"
              style={{ height: "auto" }}
              className="w-[260px] xl:w-[364px]"
            />
          </div>

          {/* Text content on the left */}
          <div className="relative z-10 flex flex-col justify-center gap-8 p-8 md:p-12 lg:py-16 lg:pl-24 max-w-[520px]">
            <p className="text-2xl font-bold leading-[32px] text-white">
              {t("movementLabel")}
            </p>

            <h2
              className="text-4xl md:text-[57px] md:leading-[64px] font-bold text-[#FFEA9E]"
              style={{ letterSpacing: "-0.25px" }}
            >
              {t("title")}
            </h2>

            <p
              className="text-base font-bold text-white"
              style={{ lineHeight: "24px", letterSpacing: "0.5px" }}
            >
              <span className="block uppercase">{t("newOf2025")}</span>
              {t("description")}
            </p>

            <Link
              href="/sun-kudos"
              className="self-start mt-2 inline-flex items-center gap-2 px-4 py-4 rounded-[4px] text-sm font-bold text-[#00101A] bg-[#FFEA9E] hover:bg-[#ffe47a] transition-colors"
            >
              {t("detailsButton")}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M8 7h9v9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
