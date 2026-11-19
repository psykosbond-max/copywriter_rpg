import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { caretOn } from '../lib/motion';
import { COLOR } from '../theme/tokens';

type Props = {
  text: string;
  /** Frame (relative to the parent Sequence) at which typing starts. */
  startFrame?: number;
  /** Frames per character. 2 at 60 fps ≈ 30 characters a second. */
  framesPerChar?: number;
  /** Reveal whole words instead of characters (better for serif sentences). */
  byWord?: boolean;
  framesPerWord?: number;
  caret?: boolean;
  /** How long the caret stays after the last character before it disappears. */
  caretHold?: number;
  caretColor?: string;
  style?: React.CSSProperties;
};

/**
 * Types text out in place. The unrevealed remainder is laid out but invisible,
 * so line breaks never jump while the text types.
 */
export const TypewriterReveal: React.FC<Props> = ({
  text, startFrame = 0, framesPerChar = 2, byWord = false, framesPerWord = 8,
  caret = true, caretHold = 40, caretColor = COLOR.red, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - startFrame;

  let shown: number;
  let total: number;
  if (byWord) {
    const parts = text.split(/(\s+)/); // keep the spaces so the string rebuilds exactly
    const words = Math.max(0, Math.min(Math.ceil((t + 1) / framesPerWord), parts.filter((p) => p.trim()).length));
    let count = 0;
    shown = 0;
    for (const p of parts) {
      if (p.trim()) {
        if (count === words) break;
        count++;
      }
      shown += p.length;
    }
    total = text.length;
  } else {
    shown = Math.max(0, Math.min(Math.floor(t / framesPerChar) + 1, text.length));
    total = text.length;
  }
  if (t < 0) shown = 0;

  const doneAt = byWord ? text.split(/\s+/).length * framesPerWord : text.length * framesPerChar;
  const showCaret = caret && t >= 0 && t < doneAt + caretHold && (t < doneAt || caretOn(frame, fps));

  return (
    <span style={{ whiteSpace: 'pre-wrap', ...style }}>
      <span>{text.slice(0, shown)}</span>
      {showCaret ? (
        <span
          style={{
            display: 'inline-block', width: '0.55em', height: '1em', marginLeft: '0.06em',
            transform: 'translateY(0.14em)', background: caretColor,
          }}
        />
      ) : null}
      <span style={{ visibility: 'hidden' }}>{text.slice(shown, total)}</span>
    </span>
  );
};
