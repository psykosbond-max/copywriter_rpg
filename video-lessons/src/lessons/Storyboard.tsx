import React from 'react';
import { AbsoluteFill, Freeze } from 'remotion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, TYPE } from '../theme/tokens';

/*
  A storyboard sheet: the real lesson component frozen at a few frames, laid out as panels.
  What you review here is exactly what renders, not a mock-up.
*/

type Panel = { frame: number; title: string; note: string };

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: 15, fontWeight: 500, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color: COLOR.inkSoft, lineHeight: 1.4,
};

export const makeStoryboard = (Lesson: React.FC, heading: string, panels: Panel[], fps = 60) => {
  const Board: React.FC = () => {
    const ready = useFontsReady();
    if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;
    const scale = 0.3;
    const w = 1920 * scale;
    const h = 1080 * scale;
    const gap = 48;
    const left = (1920 - panels.length * w - (panels.length - 1) * gap) / 2;
    return (
      <AbsoluteFill style={{ background: '#ECEAE4' }}>
        <div style={{ position: 'absolute', left, top: 120, fontFamily: FONT.display, fontSize: 44, fontWeight: 560, letterSpacing: '0.04em', textTransform: 'uppercase', color: COLOR.ink }}>{heading}</div>
        {panels.map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: left + i * (w + gap), top: 260 }}>
            <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', boxShadow: '0 1px 0 rgba(20,20,19,0.14), 0 12px 30px rgba(20,20,19,0.08)' }}>
              <div style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '0 0', position: 'absolute' }}>
                <Freeze frame={p.frame}>
                  <Lesson />
                </Freeze>
              </div>
            </div>
            <div style={{ marginTop: 26, display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 600, color: COLOR.red }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 560, color: COLOR.ink, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.title}</span>
            </div>
            <div style={{ ...mono, marginTop: 12, width: w }}>
              {(p.frame / fps).toFixed(1)} s · frame {p.frame}
            </div>
            <div style={{ fontFamily: FONT.serif, fontSize: 24, lineHeight: 1.35, color: COLOR.ink, marginTop: 10, width: w }}>{p.note}</div>
          </div>
        ))}
      </AbsoluteFill>
    );
  };
  return Board;
};
