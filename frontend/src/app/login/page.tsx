"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setIsAuthReady(true);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [router, session]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-200 px-6 py-16">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-xl shadow-black/5 backdrop-blur">
        <div className="space-y-2">
          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Smart Bookmark App
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in with Google to access your private dashboard.</p>
        </div>

        <Button onClick={handleSignIn} disabled={!isAuthReady}>
          Sign in with Google
        </Button>

        <div className="rounded-2xl bg-white/60 p-4 text-left text-sm text-zinc-500">
          <p className="font-semibold text-zinc-700">Why sign in?</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Keep your bookmarks private and secure.</li>
            <li>See updates in real-time across tabs.</li>
            <li>Sync instantly across devices.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
