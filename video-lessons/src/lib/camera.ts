import { snap } from './motion';

/*
  A 2D editorial camera. A shot names the point of the world at the centre of the frame and a zoom.
  A move eases from wherever the camera is to a shot on the house spring; dur 0 is a cut.
  Zoom travels in log space, so a 1× → 2× push feels as even as 2× → 4×.
*/

export type Shot = { cx: number; cy: number; s: number };
export type Move = { at: number; dur: number; shot: Shot };

export const cameraAt = (moves: Move[], frame: number, fps: number): Shot => {
  let cur: Shot = moves[0].shot;
  for (const m of moves) {
    if (frame < m.at) break;
    const p = m.dur === 0 ? 1 : snap(frame, fps, m.at, m.dur);
    cur = {
      cx: cur.cx + (m.shot.cx - cur.cx) * p,
      cy: cur.cy + (m.shot.cy - cur.cy) * p,
      s: Math.exp(Math.log(cur.s) + (Math.log(m.shot.s) - Math.log(cur.s)) * p),
    };
  }
  return cur;
};

/**
 * Rack focus 0 → 1 → 0 around key moments: each pulse rises over `rise` frames from `at`,
 * holds, and falls back over `fall` frames from `until`. Overlapping pulses take the larger value.
 */
export type Pulse = { at: number; until: number; rise?: number; fall?: number };
export const rackAt = (pulses: Pulse[], frame: number, fps: number) =>
  pulses.reduce((m, p) => Math.max(m, snap(frame, fps, p.at, p.rise ?? 22) - snap(frame, fps, p.until, p.fall ?? 30)), 0);

/**
 * A damped oscillation for impacts (a stamp landing): amplitude × e^(−t/decay) × sin(2πft).
 * Returns 0 before `at`. Deterministic, so every render shakes identically.
 */
export const shake = (frame: number, fps: number, at: number, amplitude = 9, hz = 13, decay = 0.09) => {
  const t = (frame - at) / fps;
  if (t < 0) return 0;
  return amplitude * Math.exp(-t / decay) * Math.sin(2 * Math.PI * hz * t);
};
