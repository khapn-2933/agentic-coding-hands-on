import Image from "next/image";
import GoogleLoginButton from "./google-login-button";

interface LoginHeroProps {
  onLoginClick: () => void | Promise<void>;
  loginLoading?: boolean;
}

export default function LoginHero({
  onLoginClick,
  loginLoading = false,
}: LoginHeroProps) {
  return (
    <section
      className="relative z-10 flex-1 flex flex-col justify-center"
      style={{ padding: "96px 144px" }}
    >
      <div className="flex flex-col" style={{ gap: "80px" }}>
        <div className="w-full max-w-[451px]">
          <Image
            src="/root-further.png"
            alt="ROOT FURTHER"
            width={451}
            height={200}
            priority
            sizes="(max-width: 768px) 80vw, 451px"
            className="h-auto w-full"
          />
        </div>

        <div className="flex flex-col" style={{ gap: "24px", paddingLeft: "16px" }}>
          <p
            className="text-white whitespace-pre-line"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "40px",
              letterSpacing: "0.5px",
              maxWidth: "480px",
            }}
          >
            {"Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!"}
          </p>

          <div>
            <GoogleLoginButton
              onClick={onLoginClick}
              loading={loginLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
