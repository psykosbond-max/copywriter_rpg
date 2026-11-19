import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { snap } from '../lib/motion';

/** Words that rise into place out of a clipped line, one after another. */
export const Rise: React.FC<{ words: string[]; at: number; every: number; style: React.CSSProperties; gap?: string }> = ({ words, at, every, style, gap = '0.26em' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: 'inline-flex', gap, fontSize: style.fontSize, flexWrap: 'wrap' }}>
      {words.map((w, i) => {
        const p = snap(frame, fps, at + i * every, 26);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.1em' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, ...style }}>{w}</span>
          </span>
        );
      })}
    </span>
  );
};
