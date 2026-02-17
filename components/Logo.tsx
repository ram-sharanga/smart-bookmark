export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="w-full h-full rounded-full bg-(--accent) flex items-center justify-center overflow-hidden border border-(--divider)">
        <span className="text-white font-serif font-bold text-xl">B</span>
      </div>
    </div>
  );
}
