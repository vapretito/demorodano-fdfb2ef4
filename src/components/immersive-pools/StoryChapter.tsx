import { contactHref, EXPERIENCE_CONFIG, type Chapter } from "./config";

const POSITION: Record<string, string> = {
  "lower-left": "left-6 bottom-[12vh] md:left-[6%] md:bottom-[14vh] max-w-[86vw] md:max-w-[42vw]",
  "left-column":
    "left-6 bottom-[12vh] md:left-[21%] md:bottom-[18vh] max-w-[86vw] md:max-w-[40vw]",
  right: "left-6 bottom-[12vh] md:left-[52%] md:bottom-[20vh] max-w-[86vw] md:max-w-[40vw]",
};

function AnimatedHeading({
  lines,
  active,
  reduced,
}: {
  lines: readonly string[];
  active: boolean;
  reduced: boolean;
}) {
  let index = 0;
  return (
    <h2 className="font-display text-[clamp(2.4rem,7.4vw,5.6rem)] leading-[0.94] tracking-[-0.01em] text-[color:var(--white)]">
      {lines.map((line) => (
        <span key={line} className="block">
          {Array.from(line).map((ch, i) => {
            const delay = reduced ? 0 : index++ * 0.03;
            return (
              <span
                key={`${line}-${i}`}
                className="char inline-block whitespace-pre"
                style={{ transitionDelay: `${active ? delay : 0}s` }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

export function StoryChapter({
  chapter,
  active,
  reduced,
}: {
  chapter: Chapter;
  active: boolean;
  reduced: boolean;
}) {
  const image = EXPERIENCE_CONFIG.images.project01;

  return (
    <section
      id={chapter.id}
      aria-hidden={!active}
      data-active={active ? "true" : "false"}
      className={`chapter fixed z-30 ${POSITION[chapter.position]} ${
        active ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <span className="chapter-panel" aria-hidden />
      <p className="chapter-eyebrow font-body text-[10px] uppercase tracking-[0.4em] text-[color:var(--aqua)]">
        {chapter.eyebrow}
      </p>
      <div className="mt-4">
        <AnimatedHeading lines={chapter.title} active={active} reduced={reduced} />
      </div>
      <div className="chapter-body mt-6 flex flex-col gap-4 md:flex-row md:gap-10">
        {chapter.body.map((paragraph, i) => (
          <p
            key={paragraph}
            className={`font-body max-w-[34ch] text-[13px] font-light leading-relaxed text-white/85 md:text-[14px] ${
              i > 0 ? "hidden short:hidden sm:block" : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {"labels" in chapter && chapter.labels ? (
        <ul className="chapter-body mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {chapter.labels.map((label) => (
            <li
              key={label}
              className="font-body text-[9px] uppercase tracking-[0.34em] text-white/70"
            >
              {label}
            </li>
          ))}
        </ul>
      ) : null}

      {"showCta" in chapter && chapter.showCta ? (
        <a
          href={contactHref()}
          target="_blank"
          rel="noreferrer"
          aria-label={`${EXPERIENCE_CONFIG.contact.ctaLabel} en Instagram`}
          className="chapter-body focus-ring group mt-8 inline-flex items-center gap-3 border-b border-white/25 pb-2 font-body text-[11px] uppercase tracking-[0.34em] text-white/80 transition-colors hover:text-[color:var(--turquoise)]"
        >
          {EXPERIENCE_CONFIG.contact.ctaLabel}
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </a>
      ) : null}

      {"showImage" in chapter && chapter.showImage ? (
        <figure
          className="chapter-image fixed left-6 top-[16vh] w-[32vw] max-w-[270px] overflow-hidden border border-white/10 md:left-[6%] md:top-[20vh] md:w-[24vw]"
          aria-hidden={!active}
        >
          <img
            src={image}
            alt="Proyecto de pileta con deck de microcemento y borde recto"
            loading="lazy"
            width={1024}
            height={1024}
            className="chapter-image-inner block h-full w-full object-cover"
          />
        </figure>
      ) : null}
    </section>
  );
}
