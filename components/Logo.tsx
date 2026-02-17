export const BookMarkIcon = ({ className = "w-3 h-5" }: { className?: string }) => (
  <div
    className={`${className} shrink-0 bg-(--accent) [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_80%,0%_100%)]`}
    aria-hidden="true"
  />
);

export const Logo = ({ size = "text-2xl" }: { size?: string }) => (
  <div className="flex items-center gap-2 select-none">
    <BookMarkIcon className="w-3 h-5 sm:w-4 sm:h-6" />
    <span
      className={`${size} leading-none`}
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
