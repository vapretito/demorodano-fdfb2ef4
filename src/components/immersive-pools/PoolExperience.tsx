import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import { EXPERIENCE_CONFIG, SCROLL_VH } from "./config";
import { scrollState, damp } from "./scrollStore";
import { PoolScene } from "./PoolScene";
import { ArchitecturalGrid } from "./ArchitecturalGrid";
import { ChapterNavigation } from "./ChapterNavigation";
import { StoryChapter } from "./StoryChapter";
import { CustomCursor } from "./CustomCursor";
import { LoadingExperience } from "./LoadingExperience";

/** Chapter visibility windows over normalized scroll. */
const WINDOWS: [number, number][] = [
  [0.02, 0.235],
  [0.275, 0.49],
  [0.53, 0.745],
  [0.785, 1.01],
];

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function PoolExperience() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(mq.matches);
      scrollState.reducedMotion = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    setWebgl(supportsWebGL());
    const t = window.setTimeout(() => setReady(true), 900);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("immersive");
    return () => document.documentElement.classList.remove("immersive");
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastRaw = 0;
    let lastActive = -1;
    let lastProgressStep = -1;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.raw = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      scrollState.pointerX = (t.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (t.clientY / window.innerHeight) * 2 - 1;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const lambda = scrollState.reducedMotion ? 12 : 3.4;
      scrollState.smooth = damp(scrollState.smooth, scrollState.raw, lambda, dt);
      const v = Math.abs(scrollState.raw - lastRaw) / Math.max(dt, 0.001);
      lastRaw = scrollState.raw;
      scrollState.energy = damp(scrollState.energy, Math.min(v * 1.6, 1), 2.4, dt);
      scrollState.px = damp(scrollState.px, scrollState.pointerX, 2.4, dt);
      scrollState.py = damp(scrollState.py, scrollState.pointerY, 2.4, dt);

      const s = scrollState.smooth;
      let next = -1;
      for (let i = 0; i < WINDOWS.length; i++) {
        if (s >= WINDOWS[i][0] && s < WINDOWS[i][1]) next = i;
      }
      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
      const showIntro = s < 0.018;
      setIntro((prev) => (prev === showIntro ? prev : showIntro));
      const step = Math.round(s * 100);
      if (step !== lastProgressStep) {
        lastProgressStep = step;
        setProgress(s);
      }
      raf = requestAnimationFrame(loop);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <main className="relative">
      <h1 className="sr-only">
        {EXPERIENCE_CONFIG.brand.name} — diseño, construcción e instalación de piletas
      </h1>

      {/* fixed WebGL layer */}
      <div className="fixed inset-0 z-0 h-screen w-screen fallback-scene" aria-hidden>
        {webgl ? (
          <Canvas
            shadows
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [11, 2, 15], fov: 42, near: 0.1, far: 300 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.92;
            }}
          >
            <Suspense fallback={null}>
              <PoolScene />
            </Suspense>
          </Canvas>
        ) : null}
      </div>

      {/* atmospheric vignette + opening darkness */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-[2200ms]"
        style={{
          opacity: ready ? 1 : 0,
          background:
            "radial-gradient(120% 90% at 50% 60%, transparent 35%, rgba(7,16,18,0.72) 100%)",
        }}
      />

      <ArchitecturalGrid />
      <ChapterNavigation active={Math.max(active, 0)} progress={progress} />

      {/* opening copy */}
      <div
        aria-hidden={!intro}
        className="chapter fixed left-6 top-1/2 z-30 -translate-y-1/2 md:left-[6%]"
        data-active={intro ? "true" : "false"}
      >
        <h2 className="font-display text-[clamp(2.2rem,6vw,4.6rem)] leading-[1.02] text-[color:var(--white)]">
          {EXPERIENCE_CONFIG.intro.title.map((line, i) => (
            <span key={line} className="block">
              {Array.from(line).map((ch, j) => (
                <span
                  key={`${i}-${j}`}
                  className="char inline-block whitespace-pre"
                  style={{ transitionDelay: reduced ? "0s" : `${(i * 20 + j) * 0.028}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="chapter-body mt-8 font-body text-[10px] uppercase tracking-[0.4em] text-white/40">
          {EXPERIENCE_CONFIG.intro.hint}
        </p>
      </div>

      {EXPERIENCE_CONFIG.chapters.map((chapter, i) => (
        <StoryChapter key={chapter.id} chapter={chapter} active={active === i} reduced={reduced} />
      ))}

      <CustomCursor />
      <LoadingExperience done={ready} />

      {/* scroll driver */}
      <div style={{ height: `${SCROLL_VH}vh` }} aria-hidden />
    </main>
  );
}
