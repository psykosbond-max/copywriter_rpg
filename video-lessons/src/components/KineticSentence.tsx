import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { spring } from 'remotion';
import { inkStroke, penEase } from '../lib/ink';
import { lerp, snap } from '../lib/motion';
import { Box, layoutLine, sentenceStyle, textWidth } from '../lib/sentenceLayout';
import { COLOR, FONT, TYPE } from '../theme/tokens';
import { RedlineStrike } from './RedlineStrike';
import { WordSwap } from './WordSwap';

export type Token = {
  text: string;
  /** Frame the redline starts slicing this word. The word then collapses out of the sentence. */
  cutAt?: number;
  /** Swap this word for another phrase at a frame. */
  swap?: { to: string; at: number };
  /** Underline the word in vermilion with a small mono label above it. */
  mark?: { label: string; at: number };
};

type Props = {
  tokens: Token[];
  /** Words appear one at a time from this frame. */
  revealAt: number;
  revealEvery?: number;
  maxWidth: number;
  /** Extra vertical offset in px (for moving the whole sentence). */
  offsetY?: number;
  /**
   * Until this frame every word keeps the line it was typed on, and cuts only close up each line
   * sideways. At this frame the survivors re-set into fresh, tight lines in one glide.
   */
  reflowAt?: number;
};

// Timing of a cut, in frames: the line slices, the word drains, then the gap closes.
// Hold, snap, breathe: the slash takes 6 frames (fast off the mark, dragging at the tip); the word drains;
// then the sentence closes the gap on a physical spring (damping 24, stiffness 220: one firm settle, a hair
// of overshoot), and holds.
export const CUT = { strike: 6, dimAfter: 3, dim: 14, collapseAfter: 16, collapse: 30 } as const;
const CLOSE = { damping: 24, stiffness: 220, mass: 1 } as const;
const SWAP_DUR = 40;
const REFLOW_DUR = 54;

type Ev = { i: number; start: number; dur: number; kind: 'collapse' | 'swap' | 'reflow' };

/**
 * A sentence that can lose words and change words while staying beautifully set.
 * Each layout change (a collapse or a swap) interpolates every word from its old position
 * to its new one, so words that move to another line glide there instead of jumping.
 */
export const KineticSentence: React.FC<Props> = ({ tokens, revealAt, revealEvery = 10, maxWidth, offsetY = 0, reflowAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineH = TYPE.sentence.size * TYPE.sentence.lineHeight;

  const m = useMemo(() => {
    const full = tokens.map((t) => textWidth(t.text));
    const swapped = tokens.map((t) => (t.swap ? textWidth(t.swap.to) : 0));
    const gap = textWidth('a a') - textWidth('aa');
    const evs: Ev[] = [];
    tokens.forEach((t, i) => {
      if (t.cutAt !== undefined) evs.push({ i, start: t.cutAt + CUT.collapseAfter, dur: CUT.collapse, kind: 'collapse' });
      if (t.swap) evs.push({ i, start: t.swap.at, dur: SWAP_DUR, kind: 'swap' });
    });
    if (reflowAt !== undefined) evs.push({ i: -1, start: reflowAt, dur: REFLOW_DUR, kind: 'reflow' });
    evs.sort((a, b) => a.start - b.start);
    // settled widths after the first k events
    const widthsAfter = (k: number) => {
      const w = [...full];
      for (const e of evs.slice(0, k)) if (e.kind !== 'reflow') w[e.i] = e.kind === 'collapse' ? 0 : swapped[e.i];
      return w;
    };
    // the lines the words were first typed on
    const lineOf = layoutLine(full, gap, maxWidth, lineH).map((b) => Math.round(b.y / lineH));
    const locked = (w: number[]): Box[] => {
      const xs: number[] = [];
      return w.map((wi, i) => {
        const li = lineOf[i];
        const x = xs[li] ?? 0;
        if (wi <= 0.5) return { x, y: li * lineH, w: 0 };
        const left = xs[li] === undefined ? 0 : x + gap;
        xs[li] = left + wi;
        return { x: left, y: li * lineH, w: wi };
      });
    };
    const layouts: Box[][] = [];
    for (let k = 0; k <= evs.length; k++) {
      const free = reflowAt === undefined || evs.slice(0, k).some((e) => e.kind === 'reflow');
      layouts.push(free ? layoutLine(widthsAfter(k), gap, maxWidth, lineH) : locked(widthsAfter(k)));
    }
    return { full, swapped, gap, evs, layouts };
  }, [tokens, maxWidth, lineH, reflowAt]);

  // which layout change is under way, and how far it has got
  let k = 0;
  while (k < m.evs.length && frame >= m.evs[k].start) k++;
  const active = k > 0 ? m.evs[k - 1] : null;
  // a collapse closes up on a physical spring; swaps and the reflow use the house spring
  const p = !active ? 1 : active.kind === 'collapse' ? spring({ frame: frame - active.start, fps, config: CLOSE }) : snap(frame, fps, active.start, active.dur);
  const from = active ? m.layouts[k - 1] : m.layouts[0];
  const to = active ? m.layouts[k] : m.layouts[0];

  return (
    <div style={{ position: 'relative', width: maxWidth, transform: `translateY(${offsetY}px)`, fontFamily: FONT.serif, fontSize: TYPE.sentence.size, fontWeight: TYPE.sentence.weight, color: COLOR.ink, lineHeight: `${lineH}px` }}>
      {tokens.map((t, i) => {
        const a = from[i];
        const b = to[i];
        // A word that changes line takes an L-shaped path so it never crosses another word:
        // moving up, it slides along its own line first and rises into the gap at the end;
        // moving down, it drops first and slides into place. Each original line moves as one rigid phrase.
        let px = p;
        let py = p;
        if (active && Math.abs(a.y - b.y) > 1) {
          // words that shared a line travel together, one line after another
          const order = Math.round(a.y / lineH);
          const q = snap(frame, fps, active.start + order * 9, active.dur);
          const early = Math.min(1, q / 0.6);
          const late = Math.max(0, (q - 0.4) / 0.6);
          px = b.y < a.y ? early : late;
          py = b.y < a.y ? late : early;
        }
        const places = [{ x: lerp(a.x, b.x, px), y: lerp(a.y, b.y, py), o: 1, dx: 0 }];
        const appear = snap(frame, fps, revealAt + i * revealEvery, 18);
        if (appear <= 0) return null;

        const strike = t.cutAt !== undefined ? penEase((frame - t.cutAt) / CUT.strike) : 0;
        const dim = t.cutAt !== undefined ? snap(frame, fps, t.cutAt + CUT.dimAfter, CUT.dim) : 0;
        const collapse = t.cutAt !== undefined ? snap(frame, fps, t.cutAt + CUT.collapseAfter, CUT.collapse) : 0;
        if (collapse >= 0.999) return null;

        const swapP = t.swap ? snap(frame, fps, t.swap.at, SWAP_DUR) : 0;
        const w = t.swap ? lerp(m.full[i], m.swapped[i], swapP) : m.full[i];

        const markP = t.mark ? penEase((frame - t.mark.at) / 12) : 0;
        const mk = t.mark ? inkStroke({ length: w * 1.04, thickness: 9, seed: `mark-${t.text}`, angle: -0.6, spread: 0.8, bow: 0.03 }) : null;

        return places.map((pl, j) => (
          <div key={`${i}-${j}`} style={{ position: 'absolute', left: pl.x, top: pl.y, height: lineH, opacity: appear * pl.o, transform: `translate(${pl.dx}px, ${(1 - appear) * 0.22 * TYPE.sentence.size}px)` }}>
            {t.swap ? (
              <WordSwap from={t.text} to={t.swap.to} progress={swapP} lineHeight={lineH} style={{ width: w }} />
            ) : t.cutAt !== undefined ? (
              <RedlineStrike text={t.text} width={m.full[i]} strike={strike} dim={dim} collapse={collapse} size={TYPE.sentence.size} />
            ) : (
              <span style={{ whiteSpace: 'nowrap' }}>{t.text}</span>
            )}
            {t.mark ? (
              <>
                {mk && markP > 0.001 ? (
                  <svg width={mk.width} height={mk.height} style={{ position: 'absolute', left: -w * 0.02, top: lineH * 0.92 - mk.height / 2, overflow: 'visible', clipPath: `inset(-20px ${(1 - markP) * 100}% -20px -20px)` }}>
                    <path d={mk.d} fill={COLOR.red} />
                  </svg>
                ) : null}
                <div
                  style={{
                    position: 'absolute', left: 0, top: -12, fontFamily: FONT.mono, fontSize: 18, fontWeight: 500,
                    letterSpacing: TYPE.mono.tracking, color: COLOR.red, lineHeight: '18px', whiteSpace: 'nowrap',
                    opacity: markP, transform: `translateY(${(1 - markP) * 10}px)`,
                  }}
                >
                  {t.mark.label}
                </div>
              </>
            ) : null}
          </div>
        ));
      })}
    </div>
  );
};

/** Words currently in the sentence: revealed, minus those cut (counted as they close up), plus swapped-in words. */
export const countWords = (tokens: Token[], frame: number, revealAt: number, revealEvery = 10) =>
  tokens.reduce((n, t, i) => {
    if (frame < revealAt + i * revealEvery) return n;
    if (t.cutAt !== undefined && frame >= t.cutAt + CUT.collapseAfter + CUT.collapse / 2) return n;
    if (t.swap && frame >= t.swap.at + SWAP_DUR / 2) return n + t.swap.to.split(/\s+/).length;
    return n + 1;
  }, 0);

export const sentenceLineHeight = () => TYPE.sentence.size * TYPE.sentence.lineHeight;
export { sentenceStyle };
