"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { SignOutButton } from "./SignOutButton";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";

type Props = {
  email: string;
  avatarUrl?: string | null;
};

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

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

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) return <div style={{ width: "34px", height: "34px" }} />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex items-center justify-center transition-all duration-300 border border-(--divider) bg-(--bg-subtle) hover:border-(--accent) overflow-hidden"
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        flexShrink: 0,
      }}
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 bg-(--accent) opacity-0 group-hover:opacity-5 transition-opacity" />
      {isDark ? (
        <SunIcon className="w-4.5 h-4.5 text-(--accent) transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <MoonIcon className="w-4.5 h-4.5 text-(--accent) transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
};

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
