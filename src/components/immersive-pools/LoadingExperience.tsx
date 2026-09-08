import { EXPERIENCE_CONFIG } from "./config";

export function LoadingExperience({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden={done}
      className="pointer-events-none fixed inset-0 z-[70] flex items-end justify-between px-6 pb-10 transition-opacity duration-[1400ms] md:px-10"
      style={{
        background: EXPERIENCE_CONFIG.palette.background,
        opacity: done ? 0 : 1,
      }}
    >
      <span className="font-body text-[10px] uppercase tracking-[0.42em] text-white/45">
        {EXPERIENCE_CONFIG.brand.name}
      </span>
      <span className="font-body text-[10px] uppercase tracking-[0.42em] text-white/30">
        {EXPERIENCE_CONFIG.brand.tagline}
      </span>
    </div>
  );
}
