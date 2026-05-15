import Image from "next/image";
import LanguageSelector from "./language-selector";

export default function LoginHeader() {
  return (
    <header
      className="relative z-20 flex items-center justify-between"
      style={{
        backgroundColor: "rgba(11, 15, 18, 0.8)",
        padding: "12px 144px",
        height: "80px",
      }}
    >
      <div className="flex items-center">
        <Image
          src="/sun-logo.png"
          alt="Sun Annual Awards 2025"
          width={52}
          height={48}
          priority
        />
      </div>
      <LanguageSelector current="VN" />
    </header>
  );
}
