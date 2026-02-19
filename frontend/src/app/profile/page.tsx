"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const userName = useMemo(() => {
    if (!session?.user?.user_metadata) return "";
    return session.user.user_metadata.full_name || session.user.user_metadata.name || "";
  }, [session]);

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
    if (isAuthReady && !session) {
      router.replace("/login");
    }
  }, [isAuthReady, router, session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-200 px-6 py-16">
        <main className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-xl shadow-black/5 backdrop-blur">
          <p className="text-sm text-zinc-500">Checking your session...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-200 px-6 py-12">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Profile
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </p>
            <h1 className="text-3xl font-semibold text-zinc-900">Your account</h1>
            <p className="text-sm text-zinc-500">Manage your profile details.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm shadow-black/5 transition hover:text-zinc-900"
            >
              Back to dashboard
            </Link>
            <Button variant="secondary" onClick={handleSignOut} disabled={!isAuthReady}>
              Sign out
            </Button>
          </div>
        </header>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Profile details</h2>
            <p className="text-sm text-zinc-500">From your Google account.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Name</p>
              <p className="text-sm font-semibold text-zinc-900">{userName || "—"}</p>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Email</p>
              <p className="text-sm font-semibold text-zinc-900">{session.user.email}</p>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Last sign in</p>
              <p className="text-sm font-semibold text-zinc-900">
                {session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
