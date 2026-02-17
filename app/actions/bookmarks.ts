"use server";

import { createClient } from "@/utils/supabase/server";

export async function addBookmark(formData: {
  url: string;
  title: string;
  tags: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  try {
    new URL(formData.url);
  } catch {
    return { error: "Please enter a valid URL including https://" };
  }
  if (!formData.title.trim()) return { error: "Title cannot be empty" };

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      url: formData.url.trim(),
      title: formData.title.trim(),
      tags: formData.tags,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Broadcast the new bookmark to the user's channel
  await supabase.channel(`bookmarks:${user.id}`).send({
    type: "broadcast",
    event: "INSERT",
    payload: data,
  });

  return { success: true };
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  // Broadcast the deletion
  await supabase.channel(`bookmarks:${user.id}`).send({
    type: "broadcast",
    event: "DELETE",
    payload: { id },
  });

  return { success: true };
}

export async function fetchBookmarks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { data: data ?? [], error: null };
}
