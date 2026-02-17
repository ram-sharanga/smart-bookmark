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
