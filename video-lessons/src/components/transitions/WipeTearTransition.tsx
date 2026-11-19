import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { hash01 } from '../../lib/stepped';
import { COLOR } from '../../theme/tokens';

/*
  WipeTearTransition: two physical ways to clear one sheet for the next.

  variant "scribble": an editor attacks the frame with a fat grease pencil. A zig-zag scrawl, drawn with
    strokeDashoffset at hand speed (fast, then dragging), is the mask: wherever the pencil has been,
    the next scene shows through. A thin vermilion trace rides the leading edge of the scrawl.

  variant "tear": the old sheet is torn away. A jagged, hand-irregular edge (seeded, so it is the same
    every render) travels across the frame and the next scene is revealed behind it, with a sliver of
    lighter torn paper fibre along the edge.

  Children are the incoming scene. Before `at` nothing renders; after `at + dur` the scene stays, unmasked.
*/

type Props = {
  at: number;
  dur?: number;
  variant?: 'scribble' | 'tear';
  seed?: number | string;
  children: React.ReactNode;
};

const W = 1920;
const H = 1080;

/** The scrawl: big diagonal zig-zags across the frame, each pass a little different. */
const scribblePath = (seed: number | string) => {
  const pts: string[] = [];
  const passes = 11;
  for (let i = 0; i <= passes; i++) {
    const x = -160 + (i / passes) * (W + 320) + (hash01(`${seed}-${i}`) - 0.5) * 120;
    const top = -260 + hash01(`${seed}-t${i}`) * 80;
    const bot = H + 260 - hash01(`${seed}-b${i}`) * 80;
    pts.push(i % 2 === 0 ? `${x.toFixed(0)},${bot.toFixed(0)}` : `${x.toFixed(0)},${top.toFixed(0)}`);
  }
  // join the points with soft curves, like a fast hand
  let d = `M ${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1].split(',').map(Number);
    const [x1, y1] = pts[i].split(',').map(Number);
    const cx = (x0 + x1) / 2 + (hash01(`${seed}-c${i}`) - 0.5) * 140;
    d += ` Q ${cx.toFixed(0)},${((y0 + y1) / 2).toFixed(0)} ${x1},${y1}`;
  }
  return d;
};

/** A torn edge as a polygon at horizontal position `edge` (px), with seeded jaggedness. */
const tearPolygon = (edge: number, seed: number | string) => {
  const steps = 46;
  const pts: string[] = ['0px 0px'];
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * H;
    // two scales of irregularity: big lazy wander plus small sharp teeth
    const wander = Math.sin((i / steps) * Math.PI * 2.3 + hash01(seed) * 6) * 46;
    const teeth = (hash01(`${seed}-${i}`) - 0.5) * 26;
    const lean = (i / steps - 0.5) * -90; // the tear runs on a slant
    pts.push(`${(edge + wander + teeth + lean).toFixed(1)}px ${y.toFixed(1)}px`);
  }
  pts.push(`0px ${H}px`);
  return `polygon(${pts.join(', ')})`;
};

export const WipeTearTransition: React.FC<Props> = ({ at, dur = 30, variant = 'scribble', seed = at, children }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / dur;
  if (t < 0) return null;
  if (t >= 1) return <AbsoluteFill style={{ background: COLOR.paper }}>{children}</AbsoluteFill>;

  if (variant === 'tear') {
    // the tear starts with a tug and runs away fast
    const k = 1 - Math.pow(1 - t, 2.2);
    const edge = -260 + k * (W + 520);
    const clip = tearPolygon(edge, seed);
    return (
      <>
        {/* a sliver of exposed fibre just ahead of the torn edge */}
        <AbsoluteFill style={{ clipPath: tearPolygon(edge + 14, `${seed}`), background: '#FFFDF8' }} />
        <AbsoluteFill style={{ clipPath: clip, background: COLOR.paper }}>{children}</AbsoluteFill>
      </>
    );
  }

  // scribble: the pencil's path is the mask
  const d = scribblePath(seed);
  const LEN = 9000;
  const k = 1 - Math.pow(1 - t, 2.6);
  const off = LEN * (1 - k);
  const mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><path d='${d}' fill='none' stroke='black' stroke-width='560' stroke-linecap='round' stroke-linejoin='round' pathLength='${LEN}' stroke-dasharray='${LEN}' stroke-dashoffset='${off}'/></svg>`,
  )}")`;
  return (
    <>
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', background: COLOR.paper }}>{children}</AbsoluteFill>
      {/* the grease pencil itself: a vermilion trace on the leading part of the scrawl */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: 1 - Math.pow(t, 3) }}>
        <path d={d} fill="none" stroke={COLOR.red} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" pathLength={LEN} strokeDasharray={`${LEN * 0.06} ${LEN}`} strokeDashoffset={-(LEN * k - LEN * 0.06)} />
      </svg>
    </>
  );
};
