import { useEffect, useRef } from "react";
import { scrollState } from "./scrollStore";

const FRAME_COUNT = 180;
const pad = (value: number) => String(value).padStart(3, "0");

type ScrollPoolFramesProps = {
  reducedMotion: boolean;
};

/**
 * Canvas-based scroll sequence. Frames are WebP exports of pool-scroll.mp4;
 * keeping a desktop and mobile set prevents loading full-resolution imagery on
 * small screens. Only the current frame and a nearby window are requested.
 */
export function ScrollPoolFrames({ reducedMotion }: ScrollPoolFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const frameSet = isMobile ? "mobile" : "desktop";
    const preloadRadius = isMobile ? 6 : 14;
    const maxCachedFrames = isMobile ? 22 : 56;
    const frames = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    let animationFrame = 0;
    let lastTarget = -1;
    let lastDrawn = -1;
    let frameReady = false;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      frameReady = true;
    };

    const drawFrame = (frameIndex: number) => {
      const image = frames.get(frameIndex);
      if (!image || !image.complete || !image.naturalWidth) return false;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.max(viewportWidth / image.naturalWidth, viewportHeight / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.fillStyle = "#071012";
      context.fillRect(0, 0, viewportWidth, viewportHeight);
      context.drawImage(image, (viewportWidth - width) / 2, (viewportHeight - height) / 2, width, height);
      lastDrawn = frameIndex;
      return true;
    };

    const pruneFrameCache = () => {
      if (frames.size <= maxCachedFrames) return;
      const staleFrames = [...frames.keys()].sort(
        (left, right) => Math.abs(right - lastTarget) - Math.abs(left - lastTarget),
      );
      while (frames.size > maxCachedFrames && staleFrames.length) {
        frames.delete(staleFrames.shift()!);
      }
    };

    const requestFrame = (frameIndex: number) => {
      if (frameIndex < 0 || frameIndex >= FRAME_COUNT || frames.has(frameIndex) || loading.has(frameIndex)) return;
      loading.add(frameIndex);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loading.delete(frameIndex);
        frames.set(frameIndex, image);
        pruneFrameCache();
        frameReady = true;
      };
      image.onerror = () => loading.delete(frameIndex);
      image.src = `/videos/pool-frames/${frameSet}/frame-${pad(frameIndex + 1)}.webp`;
    };

    const preloadNearbyFrames = (target: number, direction: number) => {
      requestFrame(target);
      for (let offset = 1; offset <= preloadRadius; offset++) {
        requestFrame(target + offset);
        requestFrame(target - offset);
      }
      // Bias a small amount of the network window toward the direction of travel.
      for (let offset = preloadRadius + 1; offset <= preloadRadius + 8; offset++) {
        requestFrame(target + offset * direction);
      }
    };

    const render = () => {
      const target = reducedMotion ? 0 : Math.round(scrollState.raw * (FRAME_COUNT - 1));
      if (target !== lastTarget) {
        const direction = target >= lastTarget ? 1 : -1;
        preloadNearbyFrames(target, direction);
        lastTarget = target;
      }
      if (frameReady || target !== lastDrawn) {
        frameReady = !drawFrame(target);
      }
      animationFrame = requestAnimationFrame(render);
    };

    resizeCanvas();
    requestFrame(0);
    requestFrame(1);
    window.addEventListener("resize", resizeCanvas);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      frames.clear();
      loading.clear();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 block bg-[#071012]" aria-hidden />;
}
