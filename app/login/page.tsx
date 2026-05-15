"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import KeyVisual from "./_components/key-visual";
import LoginHeader from "./_components/login-header";
import LoginHero from "./_components/login-hero";
import LoginFooter from "./_components/login-footer";

export default function LoginPage() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");
    if (callbackError) setError(callbackError);
  }, []);

  async function handleGoogleLogin() {
    setError(null);
    setLoginLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoginLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col flex-1 min-h-screen bg-[#00101A] overflow-hidden">
      <KeyVisual />
      <LoginHeader />
      <LoginHero onLoginClick={handleGoogleLogin} loginLoading={loginLoading} />
      {error ? (
        <div className="relative z-20 flex justify-center pb-2">
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        </div>
      ) : null}
      <LoginFooter />
    </div>
  );
}
