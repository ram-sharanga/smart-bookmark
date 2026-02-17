"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

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

export function ThemeToggle () {
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
