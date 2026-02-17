# Bookmark.

A private, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

🔗 **Live URL:** https://smart-bookmark-nine-nu.vercel.app/

## Tech Stack

- **Next.js 14** (App Router) - React framework with server components
- **Supabase** - Auth (Google OAuth), PostgreSQL database, Realtime WebSocket
- **Tailwind CSS** - Utility-first styling
- **next-themes** - Dark/light mode

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

Row Level Security is enabled - users can only access their own bookmarks.