/**
 * Mutable scroll state shared between DOM and WebGL layers.
 * Never stored in React state — it changes every frame.
 */
export const scrollState = {
  /** raw normalized scroll 0..1 */
  raw: 0,
  /** damped/smoothed progress 0..1 */
  smooth: 0,
  /** smoothed absolute scroll velocity 0..~1 */
  energy: 0,
  /** pointer, -1..1 */
  pointerX: 0,
  pointerY: 0,
  /** damped pointer */
  px: 0,
  py: 0,
  reducedMotion: false,
};

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));
