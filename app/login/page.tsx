"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
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
    <div className="flex flex-col flex-1 bg-[#0a1428] min-h-screen">
      <LoginHeader />
      <LoginHero onLoginClick={handleGoogleLogin} loginLoading={loginLoading} />
      {error ? (
        <div className="flex justify-center pb-2">
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        </div>
      ) : null}
      <LoginFooter />
    </div>
  );
}
