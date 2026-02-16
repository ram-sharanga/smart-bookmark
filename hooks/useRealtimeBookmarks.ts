"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Bookmark } from "@/types/bookmark";

type Props = {
  userId: string;
  onInsert: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
};

export function useRealtimeBookmarks({ userId, onInsert, onDelete }: Props) {
  // Use refs so the effect never needs to re-run but always calls latest handlers
  const onInsertRef = useRef(onInsert);
  const onDeleteRef = useRef(onDelete);

  useEffect(() => {
    onInsertRef.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    onDeleteRef.current = onDelete;
  }, [onDelete]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onInsertRef.current(payload.new as Bookmark);
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
          onDeleteRef.current(payload.old.id as string);
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]); // only userId — handlers come from refs, no stale closure
}