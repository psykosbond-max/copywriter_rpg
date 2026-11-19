import { measureText } from '@remotion/layout-utils';
import { FONT, TYPE } from '../theme/tokens';

export type Box = { x: number; y: number; w: number };

export type TextStyle = { fontSize: number; fontWeight: number; fontFamily: string; italic?: boolean };

export const sentenceStyle: TextStyle = { fontSize: TYPE.sentence.size, fontWeight: TYPE.sentence.weight, fontFamily: FONT.serif };

export const textWidth = (text: string, s: TextStyle = sentenceStyle) =>
  measureText({
    text, fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: String(s.fontWeight),
    additionalStyles: s.italic ? { fontStyle: 'italic' } : undefined,
  }).width;

/**
 * Greedy left-aligned line breaking. `widths[i]` is the current width of word i (0 = collapsed away);
 * collapsed words take no space and no gap, so the sentence closes up around them.
 */
export const layoutLine = (widths: number[], gap: number, maxWidth: number, lineHeight: number): Box[] => {
  const out: Box[] = [];
  let x = 0;
  let y = 0;
  let lineHasWord = false;
  for (const w of widths) {
    if (w <= 0.5) {
      out.push({ x, y, w: 0 });
      continue;
    }
    const need = (lineHasWord ? gap : 0) + w;
    if (lineHasWord && x + need > maxWidth) {
      x = 0;
      y += lineHeight;
      lineHasWord = false;
    }
    const left = lineHasWord ? x + gap : x;
    out.push({ x: left, y, w });
    x = left + w;
    lineHasWord = true;
  }
  return out;
};

/** Height of a layout, for vertically centring a block. */
export const layoutHeight = (boxes: Box[], lineHeight: number) =>
  boxes.reduce((m, b) => (b.w > 0 ? Math.max(m, b.y + lineHeight) : m), lineHeight);
