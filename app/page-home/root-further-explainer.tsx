import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function RootFurtherExplainer() {
  const t = await getTranslations("RootFurther");
  return (
    <section className="relative w-full py-20 px-4 md:px-18 lg:px-[180px]">
      <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-8">
        <Image
          src="/root-further.png"
          alt="ROOT FURTHER"
          width={290}
          height={134}
          className="h-auto w-[220px] md:w-[290px]"
        />

        <p className="w-full text-justify text-base md:text-2xl font-bold leading-[32px] text-white whitespace-pre-line">
          {t("para1")}
        </p>

        <p className="w-full text-center text-xl font-bold leading-[32px] text-white whitespace-pre-line">
          {t("quote")}
        </p>

        <p className="w-full text-justify text-base md:text-2xl font-bold leading-[32px] text-white whitespace-pre-line">
          {t("para2")}
        </p>
      </div>
    </section>
  );
}
