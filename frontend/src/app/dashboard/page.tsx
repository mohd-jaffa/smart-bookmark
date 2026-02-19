"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import BookmarkList from "@/components/bookmarks/BookmarkList";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Notification from "@/components/ui/Notification";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addBookmark, clearBookmarks, deleteBookmark, fetchBookmarks, trackBookmarkVisit } from "@/features/bookmarks/bookmarksSlice";
import type { Session } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.bookmarks);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [listView, setListView] = useState<"all" | "latest" | "most-visited">("latest");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const token = session?.access_token || null;
  const userId = session?.user.id || null;

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
      if (!newSession) {
        dispatch(clearBookmarks());
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthReady && !session) {
      router.replace("/login");
    }
  }, [isAuthReady, router, session]);

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(fetchBookmarks({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (!userId || !token) {
      return;
    }

    // Subscribe to real-time changes
    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
        (payload) => {
          // Immediately refetch on any change
          dispatch(fetchBookmarks({ token }));
        }
      )
      .subscribe();

    // Refetch when window regains focus
    const handleFocus = () => {
      dispatch(fetchBookmarks({ token }));
    };
    
    // Poll every 5 seconds (more aggressive)
    const pollInterval = setInterval(() => {
      dispatch(fetchBookmarks({ token }));
    }, 5000);

    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", handleFocus);
      clearInterval(pollInterval);
    };
  }, [dispatch, token, userId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAdd = (title: string, url: string) => {
    dispatch(addBookmark({ token, title, url }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBookmark({ token, id }));
    setDeleteConfirm(null);
    setNotification({ type: "success", message: "Bookmark deleted successfully!" });
  };

  const handleBookmarkClick = (bookmarkId: string) => {
    dispatch(trackBookmarkVisit({ token, bookmarkId }));
    // Refetch bookmarks after a delay to show updated visit counts
    setTimeout(() => {
      dispatch(fetchBookmarks({ token }));
    }, 500);
  };

  const visibleItems = useMemo(() => {
    if (listView === "most-visited") {
      return [...items].sort((a, b) => (b.visit_count || 0) - (a.visit_count || 0));
    }
    if (listView === "latest") {
      return items.slice(0, 5);
    }
    return items;
  }, [items, listView]);

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
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </p>
            <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">Your private bookmarks</h1>
            <p className="text-sm text-zinc-500">
              Save links instantly, sync in real-time, and keep everything private.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-400">Signed in</p>
              <p className="text-sm text-zinc-600">{userName || session.user.email}</p>
            </div>
            <Link
              href="/profile"
              className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm shadow-black/5 transition hover:text-zinc-900"
            >
              Profile
            </Link>
            <Button variant="secondary" onClick={handleSignOut} disabled={!isAuthReady}>
              Sign out
            </Button>
          </div>
        </header>

        <section className="flex flex-col items-center gap-6">
          {error && (
            <Card className="w-full max-w-2xl border-rose-200 bg-rose-50/70 text-rose-700">
              <p className="text-sm font-semibold">Something went wrong</p>
              <p className="text-xs">{error}</p>
            </Card>
          )}
          <Card className="w-full max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Add a new bookmark</h2>
                <p className="text-sm text-zinc-500">Keep a tidy, private list of your favorite links.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Private
              </span>
            </div>
            <BookmarkForm onSubmit={handleAdd} disabled={!session} />
          </Card>
        </section>

        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Your bookmarks</h2>
              <p className="text-sm text-zinc-500">Choose how to sort bookmarks.</p>
            </div>
            <div className="flex items-center gap-3">
              {status === "loading" && <span className="text-xs text-zinc-400">Loading...</span>}
              <select
                value={listView}
                onChange={(event) => setListView(event.target.value as "all" | "latest" | "most-visited")}
                className="rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-600 shadow-sm shadow-black/5 focus:outline-none"
              >
                <option value="most-visited">Most Visited</option>
                <option value="all">All bookmarks</option>
                <option value="latest">Latest 5</option>
              </select>
            </div>
          </div>
          <BookmarkList 
            items={visibleItems} 
            onDelete={handleDelete} 
            onVisit={handleBookmarkClick}
            onDeleteRequest={(id, title) => setDeleteConfirm({ id, title })}
          />
        </Card>

        {deleteConfirm && (
          <ConfirmModal
            title="Delete Bookmark"
            message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            isDangerous
            onConfirm={() => handleDelete(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </main>
    </div>
  );
}
