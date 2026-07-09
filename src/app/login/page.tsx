"use client";

import Image from "next/image";
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas">
      <div className="rounded-3xl bg-surface-soft px-12 py-14 flex flex-col items-center gap-6">
        <Image
          src="/logo.png"
          alt="AI Plus CCTV"
          width={211}
          height={57}
          priority
          className="h-14 w-auto"
        />
        <button
          onClick={handleGoogleLogin}
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90"
        >
          Google로 로그인
        </button>
      </div>
    </div>
  );
}
