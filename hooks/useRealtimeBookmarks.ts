"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Bookmark } from "@/types/bookmark";

type Props = {
  userId: string;
  onInsert: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
};

export function useRealtimeBookmarks({ userId, onInsert, onDelete }: Props) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onInsert(payload.new as Bookmark);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onDelete(payload.old.id as string);
        }
      )
      .subscribe();

    // Cleanup on unmount — prevents memory leaks and duplicate subscriptions
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onInsert, onDelete]);
}