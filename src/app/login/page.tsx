"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">AI Plus CCTV CRM</h1>
      <button
        onClick={handleGoogleLogin}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Google로 로그인
      </button>
    </div>
  );
}
