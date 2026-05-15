import LanguageSelector from "./language-selector";

export default function LoginHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4">
      {/* A.1 — Logo: text placeholder per clarifications */}
      <div className="flex flex-col leading-tight">
        <span className="text-white text-xs font-bold tracking-widest uppercase opacity-90">
          Sun
        </span>
        <span className="text-[#f5c518] text-xs font-bold tracking-widest uppercase">
          Annual Awards
        </span>
        <span className="text-white text-xs font-semibold tracking-wider opacity-80">
          2025
        </span>
      </div>

      {/* A.2 — Language selector */}
      <LanguageSelector current="VN" />
    </header>
  );
}
