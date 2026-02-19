"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Bookmark } from "@/features/bookmarks/bookmarksSlice";

type BookmarkListProps = {
  items: Bookmark[];
  onDelete: (id: string) => void;
  onVisit?: (id: string) => void;
  onDeleteRequest?: (id: string, title: string) => void;
};

export default function BookmarkList({ items, onDelete, onVisit, onDeleteRequest }: BookmarkListProps) {
  if (!items.length) {
    return <p className="text-sm text-zinc-500">No bookmarks yet.</p>;
  }

  const resolveUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const handleDeleteClick = (id: string, title: string) => {
    if (onDeleteRequest) {
      onDeleteRequest(id, title);
    }
  };

  const handleLinkClick = (bookmarkId: string) => {
    if (onVisit) {
      onVisit(bookmarkId);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {items.map((bookmark) => (
          <Card key={bookmark.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">{bookmark.title}</p>
              <div className="flex items-center gap-2">
                <a
                  href={resolveUrl(bookmark.url)}
                  className="text-xs text-zinc-500 hover:text-black"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLinkClick(bookmark.id)}
                >
                  {bookmark.url}
                </a>
                {bookmark.visit_count !== undefined && bookmark.visit_count > 0 && (
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {bookmark.visit_count} visits
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" onClick={() => handleDeleteClick(bookmark.id, bookmark.title)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
