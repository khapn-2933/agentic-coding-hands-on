import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LanguageSelector from "./language-selector";
import NotificationBell from "./notification-bell";
import AccountMenu from "./account-menu";

export interface SaaHeaderProps {
  user: { email: string; role?: "admin" | "user" | null } | null;
  activePath?: "about-saa" | "awards" | "sun-kudos" | null;
}

export default async function SaaHeader({ user, activePath }: SaaHeaderProps) {
  const t = await getTranslations("Header");
  const isAdmin = user?.role === "admin";

  const NAV_LINKS = [
    { label: t("navAbout"), href: "/", key: "about-saa" as const },
    { label: t("navAwards"), href: "/awards", key: "awards" as const },
    { label: t("navKudos"), href: "/sun-kudos", key: "sun-kudos" as const },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center h-20"
      style={{ background: "rgba(11, 15, 18, 0.8)", backdropFilter: "blur(12px)" }}
    >
      <div className="w-full flex items-center justify-between px-4 md:px-18 lg:px-36">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/sun-logo.png"
            alt="Sun* logo"
            width={52}
            height={48}
            priority
          />
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href, key }) => {
            const isActive = activePath === key;
            return (
              <Link
                key={key}
                href={href}
                className={`text-sm font-medium uppercase tracking-[0.5px] transition-colors duration-150 ${
                  isActive
                    ? "text-[#FFEA9E] underline underline-offset-4"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <LanguageSelector />
              <AccountMenu email={user.email} isAdmin={isAdmin} />
            </>
          ) : (
            <>
              <LanguageSelector />
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-[#00101A] bg-[#FFEA9E] rounded-full hover:bg-[#ffe47a] transition-colors"
              >
                {t("signIn")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
