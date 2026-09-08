import { EXPERIENCE_CONFIG, whatsappHref, SCROLL_VH } from "./config";

export function ChapterNavigation({ active, progress }: { active: number; progress: number }) {
  const { brand, contact, chapters } = EXPERIENCE_CONFIG;

  const goToChapter = (index: number) => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const t = (index * 0.25 + 0.1) * total;
    window.scrollTo({ top: t, behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-[86px] items-center justify-between px-6 md:px-10">
        <a
          href="#proyecto"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="focus-ring font-body text-[11px] uppercase tracking-[0.42em] text-[color:var(--white)]"
        >
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} className="h-5 w-auto" />
          ) : (
            brand.name
          )}
        </a>

        <nav aria-label="Capítulos" className="hidden items-center gap-4 md:flex">
          {chapters.map((chapter, i) => (
            <span key={chapter.id} className="flex items-center gap-4">
              {i > 0 ? <span className="h-[3px] w-[3px] rounded-full bg-white/25" /> : null}
              <button
                type="button"
                onClick={() => goToChapter(i)}
                aria-current={active === i ? "true" : undefined}
                className={`focus-ring font-body text-[10px] uppercase tracking-[0.32em] transition-colors duration-500 ${
                  active === i ? "text-[color:var(--turquoise)]" : "text-white/45 hover:text-white/80"
                }`}
              >
                {chapter.nav}
              </button>
            </span>
          ))}
        </nav>

        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          aria-label={`${contact.label} por WhatsApp`}
          className="focus-ring group flex items-center gap-2 rounded-full bg-[color:var(--white)] px-4 py-2 font-body text-[9px] uppercase tracking-[0.28em] text-[#071012] transition-transform duration-300 hover:scale-[1.04] md:px-5 md:text-[10px]"
        >
          {contact.label}
          <span className="h-[9px] w-[9px] rounded-full border border-[#071012]/60 transition-transform duration-300 group-hover:scale-125" />
        </a>
      </header>

      {/* progress capsules on the far-right grid line */}
      <div
        aria-hidden
        className="fixed right-[6%] top-1/2 z-40 hidden -translate-y-1/2 translate-x-[-50%] flex-col gap-2 md:flex"
      >
        {chapters.map((chapter, i) => (
          <span
            key={chapter.id}
            className="h-8 w-[2px] overflow-hidden bg-white/12"
            title={`${SCROLL_VH}vh`}
          >
            <span
              className="block w-full origin-top bg-[color:var(--turquoise)]"
              style={{
                height: "100%",
                transform: `scaleY(${Math.max(0, Math.min(1, (progress - i * 0.25) / 0.25))})`,
                opacity: i === active ? 1 : 0.45,
              }}
            />
          </span>
        ))}
      </div>
    </>
  );
}
