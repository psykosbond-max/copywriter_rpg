import { useCurrentFrame } from 'remotion';

/*
  Animating "on twos". Hand-made animation holds each drawing for two frames (or more); that
  stutter is what makes it read as drawn rather than computed. Secondary motion (breathing, paper
  drift, an underline settling, a figure's idle sway) runs on a stepped clock, while the main text
  keeps all 60 frames so reading stays smooth.

  step 2 at 60 fps = 30 drawings a second; step 2.5 = 24 (film's own rate).
*/
export const stepped = (frame: number, step = 2) => Math.floor(frame / step) * step;

export const useSteppedFrame = (step = 2) => stepped(useCurrentFrame(), step);

/** A small deterministic hash → 0..1, for per-object "randomness" that never changes between renders. */
export const hash01 = (seed: number | string) => {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
};
