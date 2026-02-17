"use client";
import Image from "next/image";
import { SignOutButton } from "./SignOutButton";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  email: string;
  avatarUrl?: string | null;
};

const BookmarkIcon = () => (
  <div
    className="w-3 h-5 shrink-0 bg-(--accent) [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_80%,0%_100%)]"
    aria-hidden="true"
  />
);

const Logo = () => (
  <div className="flex items-center gap-2 select-none">
    <BookmarkIcon />
    <span
      className="text-2xl leading-none"
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontWeight: 600,
        color: "var(--text-1)",
      }}
    >
      Book
      <span style={{ color: "var(--accent)", fontStyle: "italic" }}>mark.</span>
    </span>
  </div>
);

const LiveStatus = () => (
  <div className="flex items-center gap-1.5 ml-1 select-none">
    <span 
      className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse shadow-[0_0_8px_var(--success)]"
      style={{ animationDuration: '2s' }} 
    />
    
    <span className="text-[11px] font-medium hidden sm:block uppercase tracking-wider text-(--text-3)">
      live
    </span>
  </div>
);

const UserMenu = ({ url, email }: { url?: string | null; email: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="shrink-0 overflow-hidden active:scale-95 transition-transform hover:border-(--accent)"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "100%",
          display: "block",
        }}
      >
        {url ? (
          <Image
            src={url}
            alt="User"
            width={34}
            height={34}
            className="object-cover w-full h-full"
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full text-white text-xs font-bold"
            style={{ background: "var(--accent)" }}
          >
            {email?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 py-1 bg-(--bg-subtle) border border-(--divider) rounded-xl shadow-xl z-50 animate-in fade-in zoom-in duration-200"
          style={{ transformOrigin: "top right" }}
        >
          <div className="px-4 py-2 border-b border-(--divider) mb-1">
            <p className="text-[10px] text-(--text-3) uppercase tracking-wider font-bold">
              Account
            </p>
            <p className="text-xs truncate text-(--text-1)">{email}</p>
          </div>

          <div className="px-1">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export function DashboardHeader({ email, avatarUrl }: Props) {
  return (
    <header className="flex items-center justify-between w-full max-w-160 h-15 mx-auto p-4">
      <div className="flex items-center gap-3">
        <Logo />
        <LiveStatus />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu url={avatarUrl} email={email} />
      </div>
    </header>
  );
}
