"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Notification from "@/components/ui/Notification";

type BookmarkFormProps = {
  onSubmit: (title: string, url: string) => void;
  disabled?: boolean;
};

export default function BookmarkForm({ onSubmit, disabled }: BookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !url.trim()) {
      return;
    }
    
    onSubmit(title.trim(), url.trim());
    setTitle("");
    setUrl("");
    setNotification("Bookmark added successfully!");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Bookmark title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabled}
        />
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          Add bookmark
        </Button>
      </form>

      {notification && (
        <Notification
          type="success"
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
