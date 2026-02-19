"use client";

import { useEffect, useState } from "react";
import { BookmarkCollection } from "@/features/bookmarks/bookmarksSlice";
import Card from "@/components/ui/Card";

type BookmarkCollectionsProps = {
  collections: BookmarkCollection[];
  onBookmarkClick: (bookmarkId: string) => void;
};

const resolveUrl = (url: string) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export default function BookmarkCollections({
  collections,
  onBookmarkClick
}: BookmarkCollectionsProps) {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  const toggleExpanded = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  if (collections.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No bookmarks yet. Start adding to see collections!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Smart Collections</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your bookmarks organized by domain with visit insights
        </p>
      </div>

      {collections.map((collection) => (
        <Card key={collection.domain} className="overflow-hidden">
          <button
            onClick={() => toggleExpanded(collection.domain)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 text-left">
              <div>
                <div className="font-semibold text-gray-900">
                  {collection.domain}
                </div>
                <div className="text-xs text-gray-500">
                  {collection.count} bookmark{collection.count !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {collection.totalVisits}
                </div>
                <div className="text-xs text-gray-500">visits</div>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedDomains.has(collection.domain) ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </button>

          {expandedDomains.has(collection.domain) && (
            <div className="bg-gray-50 border-t">
              <div className="divide-y">
                {collection.bookmarks.map((bookmark) => (
                  <a
                    key={bookmark.id}
                    href={resolveUrl(bookmark.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onBookmarkClick(bookmark.id)}
                    className="block px-4 py-3 hover:bg-gray-100 transition group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {bookmark.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {bookmark.url}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="inline-block px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                          {bookmark.visit_count || 0}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
