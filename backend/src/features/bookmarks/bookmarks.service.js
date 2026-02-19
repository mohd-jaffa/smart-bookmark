const { supabase } = require("../../config/supabaseClient");

const listBookmarks = async (userId) => {
  return supabase
    .from("bookmarks")
    .select("id, title, url, created_at, visit_count")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

const createBookmark = async (userId, payload) => {
  return supabase
    .from("bookmarks")
    .insert({
      user_id: userId,
      title: payload.title,
      url: payload.url,
      visit_count: 0
    })
    .select("id, title, url, created_at, visit_count")
    .single();
};

const incrementVisitCount = async (userId, bookmarkId) => {
  // First get the current visit count
  const { data: bookmark, error: fetchError } = await supabase
    .from("bookmarks")
    .select("visit_count")
    .eq("id", bookmarkId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !bookmark) {
    return { data: null, error: fetchError };
  }

  // Then update with the new count
  return supabase
    .from("bookmarks")
    .update({ visit_count: (bookmark.visit_count || 0) + 1 })
    .eq("id", bookmarkId)
    .eq("user_id", userId)
    .select("id, visit_count")
    .single();
};

const deleteBookmark = async (userId, bookmarkId) => {
  return supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();
};

module.exports = {
  listBookmarks,
  createBookmark,
  deleteBookmark,
  incrementVisitCount
};
