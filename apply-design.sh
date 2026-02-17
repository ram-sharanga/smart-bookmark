#!/bin/bash

# Smart Bookmark Design Application Script
# Run this from your project root: bash apply-design.sh

set -e

echo "🎨 Applying sage green design to Smart Bookmark app..."
echo ""

# ============================================================================
# 1. app/globals.css
# ============================================================================
echo "📝 Writing app/globals.css..."
cat > app/globals.css << 'EOF'
@import "tailwindcss";

:root {
  --bg: #f7f7f5;
  --bg-card: #ffffff;
  --bg-subtle: #f0f0ed;
  --border: #e6e6e1;
  --border-card: #eaeae5;
  --text-1: #1a1a18;
  --text-2: #6b6b66;
  --text-3: #a3a39d;
  --accent: #2d9f78;
  --accent-l: #eef9f4;
  --accent-s: rgba(45,159,120,.2);
  --tag-bg: #f0f5f3;
  --tag-col: #2d9f78;
  --divider: #e6e6e1;
  --success: #16a34a;
  --danger: #dc2626;
  --header-bg: rgba(247,247,245,.92);
  --input-bg: #f0f0ed;
  --shadow-card: 0 1px 2px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04);
  --shadow-hover: 0 2px 6px rgba(0,0,0,.07), 0 8px 20px rgba(0,0,0,.06);
  --shadow-btn: 0 2px 8px rgba(45,159,120,.25);
}

.dark {
  --bg: #0e100e;
  --bg-card: #181a18;
  --bg-subtle: #1e201e;
  --border: #282a28;
  --border-card: #232523;
  --text-1: #f0f2f0;
  --text-2: #8a8c8a;
  --text-3: #5a5c5a;
  --accent: #3db88a;
  --accent-l: rgba(61,184,138,.12);
  --accent-s: rgba(61,184,138,.25);
  --tag-bg: rgba(61,184,138,.1);
  --tag-col: #3db88a;
  --divider: #282a28;
  --success: #4ade80;
  --danger: #f87171;
  --header-bg: rgba(14,16,14,.92);
  --input-bg: #141614;
  --shadow-card: 0 1px 2px rgba(0,0,0,.4), 0 4px 12px rgba(0,0,0,.3);
  --shadow-hover: 0 2px 6px rgba(0,0,0,.5), 0 8px 20px rgba(0,0,0,.4);
  --shadow-btn: 0 2px 8px rgba(61,184,138,.3);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{background:var(--bg);color:var(--text-1);font-family:'Geist',sans-serif;min-height:100vh;transition:background .25s,color .25s}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--divider);border-radius:4px}
EOF

# ============================================================================
# 2. app/layout.tsx
# ============================================================================
echo "📝 Writing app/layout.tsx..."
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Bookmark.",
  description: "Your private bookmark manager — synced in real time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
EOF

# ============================================================================
# 3. app/page.tsx (Login)
# ============================================================================
echo "📝 Writing app/page.tsx..."
cat > app/page.tsx << 'EOF'
import { LoginButton } from "@/components/LoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-5 relative" style={{background:"var(--bg)"}}>
      <div style={{position:"absolute",top:"-80px",right:"-80px",width:"280px",height:"280px",borderRadius:"50%",background:"radial-gradient(circle,var(--accent-s),transparent 70%)",pointerEvents:"none",opacity:0.6}}/>
      <div style={{position:"absolute",bottom:"-60px",left:"-60px",width:"220px",height:"220px",borderRadius:"50%",background:"radial-gradient(circle,var(--accent-s),transparent 70%)",pointerEvents:"none",opacity:0.4}}/>
      <div className="w-full max-w-[340px] relative z-10">
        <div className="inline-flex items-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{background:"var(--accent)",boxShadow:"0 2px 8px var(--accent-s)"}}>0000</div>
          <span className="text-[28px]" style={{fontFamily:"'Instrument Serif',serif",color:"var(--text-1)",letterSpacing:"-0.01em"}}>Book<span style={{color:"var(--accent)",fontStyle:"italic"}}>mark.</span></span>
        </div>
        <h1 className="text-[34px] leading-tight mb-2" style={{fontFamily:"'Instrument Serif',serif",color:"var(--text-1)",letterSpacing:"-0.02em"}}>Your links,<br/><em style={{color:"var(--accent)",fontStyle:"italic"}}>beautifully</em> kept.</h1>
        <p className="text-sm mb-8" style={{color:"var(--text-2)",lineHeight:1.5}}>Private bookmarks. Real-time sync across every tab and device.</p>
        <div className="rounded-2xl p-5" style={{background:"var(--bg-card)",border:"1px solid var(--border-card)",boxShadow:"var(--shadow-card)"}}>
          <LoginButton/>
          <div className="mt-3.5 pt-3.5 text-center text-xs" style={{borderTop:"1px solid var(--divider)",color:"var(--text-3)",lineHeight:1.5}}>No password. Google OAuth only.</div>
        </div>
      </div>
    </main>
  );
}
EOF

# ============================================================================
# 4. components/LoginButton.tsx
# ============================================================================
echo "📝 Writing components/LoginButton.tsx..."
cat > components/LoginButton.tsx << 'EOF'
"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/auth/callback`}});
  }
  return (
    <button onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-3 px-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60" style={{background:loading?"var(--bg-subtle)":"var(--bg)",border:"1.5px solid var(--border)",borderRadius:"10px",color:"var(--text-1)",boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
      {loading?<span className="w-4 h-4 rounded-full border-2 animate-spin" style={{borderColor:"var(--divider)",borderTopColor:"var(--accent)"}}/>:<svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84-.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
      {loading?"Redirecting…":"Sign in with Google"}
    </button>
  );
}
EOF

# ============================================================================
# 5. components/DashboardHeader.tsx
# ============================================================================
echo "📝 Writing components/DashboardHeader.tsx..."
cat > components/DashboardHeader.tsx << 'EOF'
"use client";
import { useTheme } from "next-themes";
import { SignOutButton } from "./SignOutButton";
import { useSyncExternalStore } from "react";

type Props = {email:string;avatarUrl?:string|null;bookmarkCount:number};
function useIsMounted(){return useSyncExternalStore(()=>()=>{},()=>true,()=>false)}

export function DashboardHeader({email,avatarUrl,bookmarkCount}:Props){
  const {theme,setTheme}=useTheme();
  const mounted=useIsMounted();
  return (
    <header className="sticky top-0 z-30" style={{background:"var(--header-bg)",borderBottom:"1px solid var(--border)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
      <div className="max-w-2xl mx-auto px-5 flex items-center justify-between gap-3" style={{height:"52px"}}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{background:"var(--accent)",boxShadow:"0 2px 8px var(--accent-s)"}}>🔖</div>
          <span className="text-lg" style={{fontFamily:"'Instrument Serif',serif",fontWeight:600,color:"var(--text-1)",letterSpacing:"-0.01em"}}>Book<span style={{color:"var(--accent)",fontStyle:"italic"}}>mark.</span></span>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"var(--success)"}}/>
            <span className="text-[11px] hidden sm:block" style={{color:"var(--text-3)"}}>live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full hidden sm:block" style={{background:"var(--accent-l)",color:"var(--accent)"}}>{bookmarkCount} {bookmarkCount===1?"link":"links"}</span>
          {mounted&&<button onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all" style={{background:"var(--bg-subtle)",border:"1px solid var(--divider)",color:"var(--text-3)"}}>{theme==="dark"?"☀️":"🌙"}</button>}
          {avatarUrl?<img src={avatarUrl} alt="" className="w-7 h-7 rounded-full" style={{border:"1.5px solid var(--divider)"}}/>:<div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{background:"var(--accent)"}}>{email.charAt(0).toUpperCase()}</div>}
          <SignOutButton/>
        </div>
      </div>
    </header>
  );
}
EOF

# ============================================================================
# 6. components/SignOutButton.tsx
# ============================================================================
echo "📝 Writing components/SignOutButton.tsx..."
cat > components/SignOutButton.tsx << 'EOF'
"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton(){
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  async function handleSignOut(){setLoading(true);const supabase=createClient();await supabase.auth.signOut();router.push("/");router.refresh()}
  return <button onClick={handleSignOut} disabled={loading} className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50" style={{background:"transparent",color:"var(--text-3)",border:"none"}}>{loading?"…":"Sign out"}</button>;
}
EOF

# ============================================================================
# 7. components/BookmarkList.tsx (WITH REALTIME FIX)
# ============================================================================
echo "📝 Writing components/BookmarkList.tsx (with inline realtime)..."
cat > components/BookmarkList.tsx << 'EOF'
"use client";
import {useState,useMemo,useEffect} from "react";
import type {Bookmark} from "@/types/bookmark";
import {BookmarkCard} from "./BookmarkCard";
import {ToastContainer,useToast} from "./Toast";
import {AddBookmarkModal} from "./AddBookmarkModal";
import {createClient} from "@/utils/supabase/client";

type Props={initialBookmarks:Bookmark[];userId:string};

export function BookmarkList({initialBookmarks,userId}:Props){
  const [bookmarks,setBookmarks]=useState<Bookmark[]>(initialBookmarks);
  const [search,setSearch]=useState("");
  const [activeTag,setActiveTag]=useState<string|null>(null);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [sortOrder,setSortOrder]=useState<"newest"|"oldest"|"alpha">("newest");
  const {toasts,addToast,removeToast}=useToast();

  useEffect(()=>{
    const supabase=createClient();
    const channel=supabase.channel(`bookmarks-${userId}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"bookmarks",filter:`user_id=eq.${userId}`},(payload)=>{
        const newBookmark=payload.new as Bookmark;
        setBookmarks(prev=>{if(prev.find(b=>b.id===newBookmark.id))return prev;return [newBookmark,...prev]});
        addToast("Bookmark added!","success");
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"bookmarks",filter:`user_id=eq.${userId}`},(payload)=>{
        setBookmarks(prev=>prev.filter(b=>b.id!==(payload.old.id as string)));
      })
      .subscribe(status=>{if(status==="SUBSCRIBED")console.log("✓ Realtime connected")});
    return ()=>{supabase.removeChannel(channel)};
  },[userId,addToast]);

  useEffect(()=>{
    function handleKeyDown(e:KeyboardEvent){if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setIsModalOpen(true)}if(e.key==="Escape")setIsModalOpen(false)}
    window.addEventListener("keydown",handleKeyDown);
    return ()=>window.removeEventListener("keydown",handleKeyDown);
  },[]);

  const allTags=useMemo(()=>{const s=new Set<string>();bookmarks.forEach(b=>b.tags.forEach(t=>s.add(t)));return Array.from(s).sort()},[bookmarks]);
  const filtered=useMemo(()=>{
    let r=[...bookmarks];
    if(activeTag)r=r.filter(b=>b.tags.includes(activeTag));
    if(search.trim()){const q=search.toLowerCase();r=r.filter(b=>b.title.toLowerCase().includes(q)||b.url.toLowerCase().includes(q)||b.tags.some(t=>t.includes(q)))}
    if(sortOrder==="newest")r.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
    else if(sortOrder==="oldest")r.sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime());
    else r.sort((a,b)=>a.title.localeCompare(b.title));
    return r;
  },[bookmarks,activeTag,search,sortOrder]);

  return (<>
    <ToastContainer toasts={toasts} removeToast={removeToast}/>
    <AddBookmarkModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onSuccess={msg=>addToast(msg,"success")} onError={msg=>addToast(msg,"error")}/>
    <div className="flex flex-col sm:flex-row gap-2 mb-5">
      <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{color:"var(--text-3)"}}>⌕</span>
      <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title, URL or tag…" className="w-full pl-9 pr-3 py-2.5 text-sm outline-none" style={{background:"var(--bg-card)",border:"1.5px solid var(--border)",borderRadius:"10px",color:"var(--text-1)"}} onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")}/></div>
      <select value={sortOrder} onChange={e=>setSortOrder(e.target.value as typeof sortOrder)} className="px-3 py-2.5 text-sm outline-none cursor-pointer" style={{background:"var(--bg-card)",border:"1.5px solid var(--border)",borderRadius:"10px",color:"var(--text-2)"}}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="alpha">A → Z</option></select>
      <button onClick={()=>setIsModalOpen(true)} className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap active:scale-95" style={{background:"var(--accent)",borderRadius:"10px",boxShadow:"var(--shadow-btn)"}}><span className="text-base leading-none">+</span>Add Bookmark<span className="hidden sm:inline text-[10px] opacity-60 font-normal">⌘K</span></button>
    </div>
    {allTags.length>0&&<div className="flex flex-wrap gap-1.5 mb-4">{[null,...allTags].map(tag=><button key={tag||"all"} onClick={()=>setActiveTag(tag===activeTag?null:tag)} className="text-xs font-medium px-3 py-1 rounded-full" style={{background:tag===activeTag?"var(--accent)":"var(--bg-card)",color:tag===activeTag?"white":"var(--text-2)",border:`1px solid ${tag===activeTag?"var(--accent)":"var(--border)"}`}}>{tag?`#${tag}`:"All"}</button>)}</div>}
    <p className="text-xs mb-3" style={{color:"var(--text-3)"}}>{filtered.length===bookmarks.length?`${bookmarks.length} bookmark${bookmarks.length!==1?"s":""}`:`${filtered.length} of ${bookmarks.length} bookmarks`}</p>
    {filtered.length===0?<EmptyState hasBookmarks={bookmarks.length>0} onAdd={()=>setIsModalOpen(true)}/>:<div className="flex flex-col gap-2">{filtered.map(b=><BookmarkCard key={b.id} bookmark={b} onDelete={id=>setBookmarks(p=>p.filter(x=>x.id!==id))} onError={msg=>addToast(msg,"error")}/>)}</div>}
  </>);
}

function EmptyState({hasBookmarks,onAdd}:{hasBookmarks:boolean;onAdd:()=>void}){
  return <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1" style={{background:"var(--bg-subtle)",border:"1px solid var(--border)"}}>{hasBookmarks?"🔍":"🔖"}</div>
    <p className="font-semibold text-base" style={{color:"var(--text-1)",fontFamily:"'Instrument Serif',serif"}}>{hasBookmarks?"No matches":"Nothing saved yet"}</p>
    <p className="text-sm max-w-[220px]" style={{color:"var(--text-3)",lineHeight:1.5}}>{hasBookmarks?"Try different search.":"Hit Add Bookmark."}</p>
    {!hasBookmarks&&<button onClick={onAdd} className="mt-2 px-5 py-2 text-sm font-semibold text-white rounded-xl active:scale-95" style={{background:"var(--accent)",boxShadow:"var(--shadow-btn)"}}>+ Add first bookmark</button>}
  </div>;
}
EOF

# Note: Realtime subscription is now inline in BookmarkList with addToast in dependency array
# This fixes the stale closure issue permanently

# ============================================================================
# 8. Delete old realtime hook (not needed anymore)
# ============================================================================
if [ -f "hooks/useRealtimeBookmarks.ts" ]; then
  echo "🗑 Removing old hooks/useRealtimeBookmarks.ts (now inline)..."
  rm hooks/useRealtimeBookmarks.ts
fi

# ============================================================================
# Continue with remaining components...
# ============================================================================
echo "📝 Writing remaining components..."

cat > components/BookmarkCard.tsx << 'EOFCARD'
"use client";
import {useState} from "react";
import type {Bookmark} from "@/types/bookmark";
import {deleteBookmark} from "@/app/actions/bookmarks";

type Props={bookmark:Bookmark;onDelete:(id:string)=>void;onError:(msg:string)=>void};
function getFaviconUrl(url:string){try{return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`}catch{return null}}
function getDomain(url:string){try{return new URL(url).hostname.replace("www.","")}catch{return url}}
function timeAgo(d:string){const diff=Date.now()-new Date(d).getTime(),m=Math.floor(diff/60000),h=Math.floor(diff/3600000),days=Math.floor(diff/86400000);if(m<1)return"just now";if(m<60)return`${m}m ago`;if(h<24)return`${h}h ago`;if(days<30)return`${days}d ago`;return new Date(d).toLocaleDateString()}

export function BookmarkCard({bookmark,onDelete,onError}:Props){
  const [deleting,setDeleting]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [faviconError,setFaviconError]=useState(false);
  const [isHovered,setIsHovered]=useState(false);
  const favicon=getFaviconUrl(bookmark.url);
  async function handleDelete(){setDeleting(true);const r=await deleteBookmark(bookmark.id);if(r.error){onError(r.error);setDeleting(false);setShowConfirm(false)}else onDelete(bookmark.id)}
  return (
    <div className="group flex items-start gap-3 p-3.5 cursor-default" style={{background:"var(--bg-card)",border:"1px solid var(--border-card)",borderRadius:"12px",boxShadow:isHovered?"var(--shadow-hover)":"var(--shadow-card)",borderColor:isHovered?"var(--accent-s)":"var(--border-card)",transition:"all .15s"}} onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
      <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 overflow-hidden mt-px" style={{background:"var(--bg-subtle)",border:"1px solid var(--divider)"}}>
        {favicon&&!faviconError?<img src={favicon} alt="" width={18} height={18} onError={()=>setFaviconError(true)} className="w-[18px] h-[18px]"/>:<span className="text-xs font-bold" style={{color:"var(--accent)",fontFamily:"'Instrument Serif',serif"}}>{bookmark.title.charAt(0).toUpperCase()}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium truncate mb-0.5" style={{color:"var(--text-1)",textDecoration:"none"}}>{bookmark.title}</a>
        <div className="flex items-center gap-1.5"><span className="text-xs truncate" style={{color:"var(--text-3)"}}>{getDomain(bookmark.url)}</span><span style={{color:"var(--divider)"}}>·</span><span className="text-xs" style={{color:"var(--text-3)"}}>{timeAgo(bookmark.created_at)}</span></div>
        {bookmark.tags.length>0&&<div className="flex flex-wrap gap-1 mt-1.5">{bookmark.tags.map(tag=><span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full" style={{background:"var(--tag-bg)",color:"var(--tag-col)",border:"1px solid var(--border)"}}>#{tag}</span>)}</div>}
      </div>
      <div className="flex gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!showConfirm?<><a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-lg text-xs" style={{color:"var(--text-3)"}}>↗</a><button onClick={()=>setShowConfirm(true)} className="w-7 h-7 flex items-center justify-center rounded-lg text-xs" style={{color:"var(--text-3)",background:"transparent",border:"none"}}>✕</button></>:<div className="flex gap-1"><button onClick={handleDelete} disabled={deleting} className="px-2.5 py-1 text-xs font-semibold rounded-lg text-white" style={{background:"var(--danger)"}}>{deleting?"…":"Delete"}</button><button onClick={()=>setShowConfirm(false)} className="px-2.5 py-1 text-xs font-medium rounded-lg" style={{background:"var(--bg-subtle)",color:"var(--text-2)",border:"1px solid var(--divider)"}}>Cancel</button></div>}
      </div>
    </div>
  );
}
EOFCARD

cat > components/AddBookmarkModal.tsx << 'EOFMODAL'
"use client";
import {useState,useEffect,useRef,KeyboardEvent} from"react";
import {addBookmark} from"@/app/actions/bookmarks";

type Props={isOpen:boolean;onClose:()=>void;onSuccess:(m:string)=>void;onError:(m:string)=>void};
export function AddBookmarkModal({isOpen,onClose,onSuccess,onError}:Props){
  const [url,setUrl]=useState("");const [title,setTitle]=useState("");const [tagInput,setTagInput]=useState("");const [tags,setTags]=useState<string[]>([]);const [loading,setLoading]=useState(false);const [fetchingTitle,setFetchingTitle]=useState(false);const urlInputRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{if(isOpen)setTimeout(()=>urlInputRef.current?.focus(),80);else{setUrl("");setTitle("");setTagInput("");setTags([]);setLoading(false)}},[isOpen]);
  async function handleUrlBlur(){if(!url||title)return;try{new URL(url)}catch{return}setFetchingTitle(true);try{const res=await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);const data=await res.json();if(data.title)setTitle(data.title)}catch{}finally{setFetchingTitle(false)}}
  function handleTagKeyDown(e:KeyboardEvent<HTMLInputElement>){if((e.key==="Enter"||e.key===",")&&tagInput.trim()){e.preventDefault();const newTag=tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g,"");if(newTag&&!tags.includes(newTag)&&tags.length<8)setTags([...tags,newTag]);setTagInput("")}if(e.key==="Backspace"&&!tagInput&&tags.length>0)setTags(tags.slice(0,-1))}
  async function handleSubmit(e:React.FormEvent){e.preventDefault();setLoading(true);const r=await addBookmark({url,title,tags});if(r.error){onError(r.error);setLoading(false)}else{onSuccess("Bookmark saved!");onClose()}}
  if(!isOpen)return null;
  const inputStyle={background:"var(--input-bg)",border:"1.5px solid var(--border)",borderRadius:"10px",color:"var(--text-1)",width:"100%",padding:"10px 14px",fontSize:"14px",outline:"none"};
  const labelStyle:React.CSSProperties={display:"block",fontSize:"11px",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--text-3)",marginBottom:"6px"};
  return (<><div className="fixed inset-0 z-40" style={{background:"rgba(0,0,0,.3)",backdropFilter:"blur(4px)"}} onClick={onClose}/><div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"><div className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] p-6" style={{background:"var(--bg-card)",border:"1px solid var(--border-card)",boxShadow:"0 -8px 40px rgba(0,0,0,.15)"}}><div className="w-9 h-1 mx-auto rounded-full mb-5 sm:hidden" style={{background:"var(--divider)"}}/><div className="flex items-center justify-between mb-5"><h2 className="text-lg font-semibold" style={{fontFamily:"'Instrument Serif',serif",color:"var(--text-1)"}}>Add a bookmark</h2><button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm" style={{background:"var(--bg-subtle)",color:"var(--text-3)",border:"1px solid var(--divider)"}}>✕</button></div><form onSubmit={handleSubmit}><div className="flex flex-col gap-3.5"><div><label style={labelStyle}>URL</label><input ref={urlInputRef} type="url" value={url} onChange={e=>setUrl(e.target.value)} onBlur={handleUrlBlur} placeholder="https://example.com" required style={inputStyle} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlurCapture={e=>e.target.style.borderColor="var(--border)"}/></div><div><label style={labelStyle}>Title {fetchingTitle&&<span style={{color:"var(--accent)",fontWeight:400,textTransform:"none",letterSpacing:0}}>— fetching…</span>}</label><input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Page title" required style={inputStyle} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlurCapture={e=>e.target.style.borderColor="var(--border)"}/></div><div><label style={labelStyle}>Tags <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>— Enter or comma</span></label><div className="flex flex-wrap gap-1.5 min-h-[44px] p-2.5" style={{background:"var(--input-bg)",border:"1.5px solid var(--border)",borderRadius:"10px"}}>{tags.map(tag=><span key={tag} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{background:"var(--accent-l)",color:"var(--accent)",border:"1px solid var(--accent-s)"}}>#{tag}<button type="button" onClick={()=>setTags(tags.filter(t=>t!==tag))} className="opacity-60 hover:opacity-100">✕</button></span>)}<input type="text" value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tags.length===0?"design, productivity…":""} className="flex-1 min-w-[80px] bg-transparent text-sm outline-none" style={{color:"var(--text-1)"}}/></div></div><div className="flex gap-2 pt-1"><button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl" style={{background:"var(--bg-subtle)",color:"var(--text-2)",border:"1px solid var(--divider)"}}>Cancel</button><button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2" style={{background:"var(--accent)",boxShadow:"var(--shadow-btn)",border:"none"}}>{loading&&<span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:"rgba(255,255,255,.3)",borderTopColor:"white"}}/>}{loading?"Saving…":"Save bookmark"}</button></div></div></form></div></div></>);
}
EOFMODAL

cat > components/Toast.tsx << 'EOFTOAST'
"use client";
import {useEffect,useState} from"react";
export type ToastType="success"|"error"|"info";
export type ToastMessage={id:string;message:string;type:ToastType};
export function ToastContainer({toasts,removeToast}:{toasts:ToastMessage[];removeToast:(id:string)=>void}){return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 items-center w-full px-4 pointer-events-none">{toasts.map(t=><ToastItem key={t.id} toast={t} removeToast={removeToast}/>)}</div>}
function ToastItem({toast,removeToast}:{toast:ToastMessage;removeToast:(id:string)=>void}){const [visible,setVisible]=useState(false);useEffect(()=>{const show=setTimeout(()=>setVisible(true),10);const hide=setTimeout(()=>{setVisible(false);setTimeout(()=>removeToast(toast.id),300)},3500);return()=>{clearTimeout(show);clearTimeout(hide)}},[toast.id,removeToast]);const styles={success:{bg:"var(--bg-card)",accent:"var(--success)",icon:"✓"},error:{bg:"var(--bg-card)",accent:"var(--danger)",icon:"✕"},info:{bg:"var(--bg-card)",accent:"var(--accent)",icon:"ℹ"}}[toast.type];return <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium cursor-pointer select-none" style={{background:styles.bg,border:"1px solid var(--border-card)",borderRadius:"12px",boxShadow:"0 4px 24px rgba(0,0,0,.12)",color:"var(--text-1)",minWidth:"200px",maxWidth:"360px",opacity:visible?1:0,transform:visible?"translateY(0) scale(1)":"translateY(8px) scale(0.96)",transition:"all .25s cubic-bezier(.16,1,.3,1)"}} onClick={()=>{setVisible(false);setTimeout(()=>removeToast(toast.id),300)}}><span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{background:styles.accent}}>{styles.icon}</span>{toast.message}</div>}
export function useToast(){const [toasts,setToasts]=useState<ToastMessage[]>([]);function addToast(m:string,type:ToastType="info"){setToasts(p=>[...p,{id:crypto.randomUUID(),message:m,type}])}function removeToast(id:string){setToasts(p=>p.filter(t=>t.id!==id))}return{toasts,addToast,removeToast}}
EOFTOAST

cat > app/dashboard/page.tsx << 'EOFDASH'
import {createClient} from"@/utils/supabase/server";
import {redirect} from"next/navigation";
import {fetchBookmarks} from"@/app/actions/bookmarks";
import {BookmarkList} from"@/components/BookmarkList";
import {DashboardHeader} from"@/components/DashboardHeader";

export default async function DashboardPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/");
  const {data:bookmarks,error}=await fetchBookmarks();
  const avatarUrl=user.user_metadata?.avatar_url??user.user_metadata?.picture??null;
  return (
    <div className="min-h-screen" style={{background:"var(--bg)"}}>
      <DashboardHeader email={user.email??""} avatarUrl={avatarUrl} bookmarkCount={bookmarks?.length??0}/>
      <main className="max-w-2xl mx-auto px-5 py-7">
        <div className="mb-6"><h1 className="text-[30px] mb-1 leading-tight" style={{fontFamily:"'Instrument Serif',serif",fontWeight:500,color:"var(--text-1)",letterSpacing:"-0.02em"}}>Your collection<span style={{color:"var(--accent)",fontStyle:"italic"}}>.</span></h1><p className="text-sm" style={{color:"var(--text-3)"}}>Everything you've saved, always in sync.</p></div>
        {error?<div className="rounded-2xl p-4 text-sm" style={{background:"var(--accent-l)",border:"1px solid var(--accent-s)",color:"var(--accent)"}}>Failed to load: {error}</div>:<BookmarkList initialBookmarks={bookmarks??[]} userId={user.id}/>}
      </main>
    </div>
  );
}
EOFDASH

cat > app/dashboard/loading.tsx << 'EOFLOAD'
export default function DashboardLoading(){return <div className="min-h-screen" style={{background:"var(--bg)"}}><div className="sticky top-0 z-30" style={{background:"var(--header-bg)",borderBottom:"1px solid var(--border)",height:"52px"}}><div className="max-w-2xl mx-auto px-5 h-full flex items-center justify-between"><div className="w-28 h-5 rounded-full animate-pulse" style={{background:"var(--bg-subtle)"}}/><div className="flex gap-2"><div className="w-16 h-6 rounded-full animate-pulse" style={{background:"var(--bg-subtle)"}}/><div className="w-8 h-8 rounded-full animate-pulse" style={{background:"var(--bg-subtle)"}}/></div></div></div><div className="max-w-2xl mx-auto px-5 py-7"><div className="mb-6 space-y-2"><div className="w-40 h-7 rounded-xl animate-pulse" style={{background:"var(--bg-subtle)"}}/><div className="w-56 h-4 rounded-full animate-pulse" style={{background:"var(--bg-subtle)"}}/></div><div className="flex gap-2 mb-5"><div className="flex-1 h-10 rounded-xl animate-pulse" style={{background:"var(--bg-subtle)"}}/><div className="w-24 h-10 rounded-xl animate-pulse" style={{background:"var(--bg-subtle)"}}/><div className="w-36 h-10 rounded-xl animate-pulse" style={{background:"var(--bg-subtle)",opacity:.7}}/></div><div className="flex flex-col gap-2">{[...Array(6)].map((_,i)=><div key={i} className="flex items-center gap-3 p-3.5 animate-pulse" style={{background:"var(--bg-card)",border:"1px solid var(--border-card)",borderRadius:"12px",animationDelay:`${i*60}ms`}}><div className="w-[34px] h-[34px] rounded-lg shrink-0" style={{background:"var(--bg-subtle)"}}/><div className="flex-1 space-y-2"><div className="h-3.5 rounded-full w-3/5" style={{background:"var(--bg-subtle)"}}/><div className="h-3 rounded-full w-2/5" style={{background:"var(--bg-subtle)",opacity:.6}}/></div></div>)}</div></div></div>}
EOFLOAD

echo ""
echo "✅ All files written!"
echo ""
echo "🚀 Next steps:"
echo "1. Commit: git add . && git commit -m 'feat: sage green design with inline realtime'"
echo "2. Push: git push"
echo "3. Test realtime: Open 2 tabs, add bookmark in one, watch it appear in the other instantly"
echo ""
echo "Done! 🎉"
EOF

chmod +x /mnt/user-data/outputs/apply-design.sh

echo "✅ Script created: apply-design.sh"