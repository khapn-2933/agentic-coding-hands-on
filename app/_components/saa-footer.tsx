import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SaaFooter() {
  const t = await getTranslations("Footer");

  const FOOTER_LINKS = [
    { label: t("navAbout"), href: "/" },
    { label: t("navAwards"), href: "/awards" },
    { label: t("navKudos"), href: "/sun-kudos" },
    { label: t("navStandards"), href: "/tieu-chuan-chung" },
  ];

  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid #2E3940" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-18 lg:px-36 py-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/sun-logo.png"
            alt="Sun* logo"
            width={52}
            height={48}
          />
        </Link>

        {/* Nav */}
        <nav
          aria-label={t("ariaLabel")}
          className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3"
        >
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Copyright bar */}
      <div
        className="w-full py-4 text-center"
        style={{ borderTop: "1px solid #2E3940" }}
      >
        <p className="text-xs text-white/40">{t("copyright")}</p>
      </div>
    </footer>
  );
}
