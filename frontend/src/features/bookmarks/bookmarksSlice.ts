import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  visit_count?: number;
};

export type BookmarkCollection = {
  domain: string;
  count: number;
  totalVisits: number;
  bookmarks: Bookmark[];
};

type BookmarksState = {
  items: Bookmark[];
  collections: BookmarkCollection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: BookmarksState = {
  items: [],
  collections: [],
  status: "idle",
  error: null
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getDomainFromUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname.replace("www.", "");
  } catch {
    return "other";
  }
};

const computeCollections = (bookmarks: Bookmark[]): BookmarkCollection[] => {
  const groupedByDomain: Record<string, Bookmark[]> = {};

  bookmarks.forEach((bookmark) => {
    const domain = getDomainFromUrl(bookmark.url);
    if (!groupedByDomain[domain]) {
      groupedByDomain[domain] = [];
    }
    groupedByDomain[domain].push(bookmark);
  });

  return Object.entries(groupedByDomain)
    .map(([domain, bookmarks]) => ({
      domain,
      count: bookmarks.length,
      totalVisits: bookmarks.reduce((sum, b) => sum + (b.visit_count || 0), 0),
      bookmarks
    }))
    .sort((a, b) => b.totalVisits - a.totalVisits);
};

const authHeaders = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};

const getErrorMessage = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as { message?: string; details?: string; hint?: string };
      return data.message || data.details || data.hint || fallback;
    } catch {
      return fallback;
    }
  }

  try {
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
};

export const fetchBookmarks = createAsyncThunk<Bookmark[], { token: string | null }>(
  "bookmarks/fetch",
  async ({ token }) => {
    if (!apiUrl || !token) {
      return [];
    }

    const response = await fetch(`${apiUrl}/api/bookmarks`, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      }
    });

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to load bookmarks");
      throw new Error(message);
    }

    return (await response.json()) as Bookmark[];
  }
);

export const trackBookmarkVisit = createAsyncThunk<
  void,
  { token: string | null; bookmarkId: string }
>(
  "bookmarks/trackVisit",
  async ({ token, bookmarkId }) => {
    if (!apiUrl || !token) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/bookmarks/${bookmarkId}/visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token)
        }
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response, "Failed to track visit");
      }
    } catch (error) {
      // Silently fail
    }
  }
);

export const addBookmark = createAsyncThunk<Bookmark, { token: string | null; title: string; url: string }>(
  "bookmarks/add",
  async ({ token, title, url }) => {
    if (!apiUrl || !token) {
      throw new Error("Missing API URL or auth token");
    }

    const response = await fetch(`${apiUrl}/api/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      },
      body: JSON.stringify({ title, url })
    });

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to add bookmark");
      throw new Error(message);
    }

    return (await response.json()) as Bookmark;
  }
);

export const deleteBookmark = createAsyncThunk<string, { token: string | null; id: string }>(
  "bookmarks/delete",
  async ({ token, id }) => {
    if (!apiUrl || !token) {
      throw new Error("Missing API URL or auth token");
    }

    const response = await fetch(`${apiUrl}/api/bookmarks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      }
    });

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to delete bookmark");
      throw new Error(message);
    }

    const data = (await response.json()) as { id: string };
    return data.id;
  }
);

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.items = [];
      state.collections = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.collections = computeCollections(action.payload);
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load bookmarks";
      })
      .addCase(addBookmark.pending, (state) => {
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.collections = computeCollections(state.items);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add bookmark";
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.collections = computeCollections(state.items);
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete bookmark";
      })
      .addCase(trackBookmarkVisit.fulfilled, (state) => {
        // Visit tracking succeeded
      });
  }
});

export const { clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
