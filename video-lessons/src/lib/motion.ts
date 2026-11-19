import { interpolate, spring } from 'remotion';
import { SPRING } from '../theme/tokens';

/**
 * Progress 0 → 1 of the house spring, starting at frame `at` and settling in `dur` frames.
 * Overdamped (damping 200, stiffness 180), so it never overshoots or wobbles.
 */
export const snap = (frame: number, fps: number, at: number, dur = 24) =>
  spring({ frame: frame - at, fps, config: SPRING, durationInFrames: dur });

/** Linear 0 → 1 between two frames, clamped. For things that should not ease (a caret, a counter). */
export const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A caret that blinks on a fixed 1 s cycle, so every render is identical. */
export const caretOn = (frame: number, fps: number) => frame % fps < fps / 2;
