import { hash01 } from './stepped';

/*
  Ink strokes as a hand makes them, not as a rule draws them.

  A stroke is a filled, tapered shape along a slightly bowed centre line: blunt where the pencil lands,
  fullest a little before the middle, thinning to a point where the hand lifts. It is revealed from the
  left with a fast-start, decelerating curve (the slash is fastest at the start and drags at the tip).
  Every stroke gets its own angle and bow from a seed, so no two are the same.
*/

export type StrokeOpts = {
  /** Length in px. */
  length: number;
  /** Full thickness in px. */
  thickness: number;
  /** Seed for this stroke's angle and bow. */
  seed: number | string;
  /** Degrees; the stroke's base slope range is picked inside ±spread around this. */
  angle?: number;
  spread?: number;
  /** Bow, as a fraction of length (positive bows downward). */
  bow?: number;
  /** Extra breathing offset for the bow (px), for living strokes. */
  wobble?: number;
};

/** Returns an SVG path and the box it needs (the path is drawn from x = 0, centred on y = height / 2). */
export const inkStroke = ({ length: L, thickness: T, seed, angle = -1.2, spread = 1, bow = 0.018, wobble = 0 }: StrokeOpts) => {
  const r1 = hash01(`${seed}-a`);
  const r2 = hash01(`${seed}-b`);
  const a = ((angle + (r1 - 0.5) * 2 * spread) * Math.PI) / 180;
  const b = bow * (0.6 + 0.8 * r2) * L + wobble;
  const slope = Math.tan(a);
  const N = 28;
  const pad = Math.abs(slope * L) + Math.abs(b) + T * 2;
  const h = pad * 2;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = u * L;
    const y = h / 2 + slope * (x - L / 2) + b * Math.sin(Math.PI * u);
    // pressure: lands blunt, peaks around 35%, lifts to a point
    const p = Math.min(1, 0.55 + 1.6 * u) * Math.pow(1 - u, 0.45) * 1.15;
    const th = Math.max(0.6, T * Math.min(1, p));
    top.push(`${x.toFixed(1)},${(y - th / 2).toFixed(2)}`);
    bottom.unshift(`${x.toFixed(1)},${(y + th / 2).toFixed(2)}`);
  }
  // a rounded landing at the start
  const d = `M ${top[0]} L ${top.slice(1).join(' L ')} L ${bottom.join(' L ')} Q ${(-T * 0.45).toFixed(1)},${(h / 2 - slope * (L / 2)).toFixed(2)} ${top[0]} Z`;
  return { d, width: L, height: h };
};

/** The hand's speed: fast off the mark, dragging at the tip. */
export const penEase = (t: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3.2);
