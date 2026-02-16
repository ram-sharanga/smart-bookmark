# Bookmark.

A private, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

🔗 **Live URL:** https://your-vercel-url.vercel.app

## Tech Stack

- **Next.js 14** (App Router) — React framework with server components
- **Supabase** — Auth (Google OAuth), PostgreSQL database, Realtime WebSocket
- **Tailwind CSS** — Utility-first styling
- **next-themes** — Dark/light mode

## Features

- Google OAuth sign-in (no passwords)
- Add bookmarks with URL, title, and tags
- Auto-fetches page title when you enter a URL
- Delete bookmarks with confirmation
- Real-time sync across tabs and devices via Supabase Realtime (WebSocket)
- Filter by tag, search by title/URL/tag, sort by date or alphabetically
- Dark and light mode with system preference detection
- Fully mobile responsive

## Local Setup

1. Clone the repo:
```bash
   git clone https://github.com/YOUR_USERNAME/smart-bookmark.git
   cd smart-bookmark
   npm install
```

2. Create `.env.local`:
```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run:
```bash
   npm run dev
```

## Database Schema
```sql
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  tags text[] default '{}' not null,
  created_at timestamptz default now() not null
);
```

Row Level Security is enabled — users can only access their own bookmarks.

## Problems Encountered & Solutions

### 1. OAuth redirect failing on production
**Problem:** Sign-in worked locally but redirected to localhost after login on Vercel.  
**Solution:** Added the production Vercel URL to both Supabase's URL Configuration (Site URL + Redirect URLs) and Google Cloud Console's Authorized JavaScript Origins.

### 2. Realtime not receiving events
**Problem:** WebSocket subscription was set up but no events were firing.  
**Solution:** Realtime replication was not enabled for the `bookmarks` table. Enabled it under Supabase → Database → Replication.

### 3. Session not persisting across page refreshes in App Router
**Problem:** User was getting logged out on refresh.  
**Solution:** Used `@supabase/ssr` with the cookie-based server client instead of the default browser client, and added the `middleware.ts` session refresh logic.

### 4. Duplicate bookmarks appearing when inserting
**Problem:** When a user added a bookmark, it appeared twice — once from optimistic state update and once from the Realtime INSERT event.  
**Solution:** In the Realtime INSERT handler, checked if the bookmark ID already exists in state before adding it, and let Realtime be the single source of truth for state updates after insert.

### 5. RLS blocking deletes
**Problem:** Delete calls were silently failing with a 403.  
**Solution:** The DELETE RLS policy was missing. Added `create policy "Users can delete own bookmarks"` with `using (auth.uid() = user_id)`.