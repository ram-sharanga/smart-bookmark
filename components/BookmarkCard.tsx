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
