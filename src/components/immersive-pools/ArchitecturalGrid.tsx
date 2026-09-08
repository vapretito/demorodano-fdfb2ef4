export function ArchitecturalGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
      {/* horizontal line below header */}
      <div className="absolute left-0 right-0 top-[86px] h-px bg-[color:var(--line)]" />
      {/* vertical divisions: 5 on desktop, 3 on mobile */}
      {[20, 40, 60, 80].map((left, i) => (
        <div
          key={left}
          className={`absolute bottom-0 top-0 w-px bg-[color:var(--line)] ${
            i === 0 || i === 3 ? "" : "hidden md:block"
          }`}
          style={{ left: `${left}%` }}
        />
      ))}
      <div className="absolute inset-y-0 right-[6%] hidden w-px bg-[color:var(--line)] md:block" />
      {/* travelling dots */}
      <span className="grid-dot absolute left-[20%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[color:var(--aqua)]/40" />
      <span
        className="grid-dot absolute left-[80%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/30"
        style={{ animationDelay: "-9s", animationDuration: "26s" }}
      />
      <span
        className="grid-dot-h absolute top-[86px] h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-[color:var(--aqua)]/30"
        style={{ animationDelay: "-4s" }}
      />
    </div>
  );
}
