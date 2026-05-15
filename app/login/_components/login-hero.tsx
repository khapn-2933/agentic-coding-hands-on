import KeyVisual from "./key-visual";
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
    <section className="relative flex-1 flex overflow-hidden">
      {/* B.1 — Key visual: full-bleed abstract artwork fills the right side */}
      <div className="absolute inset-0">
        <KeyVisual />
      </div>

      {/* B.2 + B.3 — Content column: left side over the dark area */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 max-w-lg">
        {/* B.2 — Hero title */}
        <h1
          className="text-white font-black leading-none tracking-tight mb-6"
          style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)" }}
        >
          ROOT
          <br />
          FURTHER
        </h1>

        {/* B.2 — Description lines */}
        <p className="text-[#8ba8cc] text-base font-medium mb-1">
          Bắt đầu hành trình của bạn cùng SAA 2025.
        </p>
        <p className="text-[#8ba8cc] text-base font-medium mb-8">
          Đăng nhập để khám phá!
        </p>

        {/* B.3 — Google login CTA */}
        <div>
          <GoogleLoginButton
            onClick={onLoginClick}
            loading={loginLoading}
          />
        </div>
      </div>
    </section>
  );
}
