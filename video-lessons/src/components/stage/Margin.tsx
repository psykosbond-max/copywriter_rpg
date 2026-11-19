import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { snap } from '../../lib/motion';
import { COLOR, FONT } from '../../theme/tokens';
import { stageMono } from './EditorialStage';

/*
  The Editor's Margin: diagnostic readouts that tick as the copy changes.
  A metric is a list of steps {at, value}; between steps the number counts to the new value on the
  house spring, and a vermilion delta (▼ 3 / ▲ 25) shows for a moment beside it.
*/

export type Step = { at: number; value: number };

const valueAt = (steps: Step[], frame: number, fps: number, dur: number) => {
  let v = steps[0].value;
  for (let i = 1; i < steps.length; i++) {
    const p = snap(frame, fps, steps[i].at, dur);
    v = v + (steps[i].value - v) * p;
  }
  return v;
};

type MetricProps = {
  label: string;
  steps: Step[];
  /** Upper end of the bar under the number. */
  max: number;
  /** Suffix after the number, e.g. "%". */
  unit?: string;
  /** Whether a fall is good (shown in ink) or bad. Purely for the delta's arrow, the colour is always vermilion. */
  appearAt?: number;
  /** Format the number: default rounds to an integer. */
  format?: (v: number) => string;
};

export const MarginMetric: React.FC<MetricProps> = ({ label, steps, max, unit = '', appearAt = 0, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = valueAt(steps, frame, fps, 36);
  const show = snap(frame, fps, appearAt, 20);
  // the most recent change, for 70 frames
  const recent = [...steps].slice(1).filter((s) => frame >= s.at && frame < s.at + 70).pop();
  const prev = recent ? steps[steps.indexOf(recent) - 1].value : 0;
  const d = recent ? recent.value - prev : 0;
  return (
    <div style={{ marginBottom: 34, opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}>
      <div style={{ ...stageMono, fontSize: 15, color: COLOR.inkSoft, letterSpacing: '0.14em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 10 }}>
        <span style={{ fontFamily: FONT.display, fontSize: 46, fontWeight: 560, color: COLOR.ink, fontVariantNumeric: 'tabular-nums', lineHeight: 1, minWidth: '2.2ch' }}>
          {format ? format(v) : `${Math.round(v)}${unit}`}
        </span>
        <span style={{ ...stageMono, fontSize: 16, color: COLOR.red, opacity: d ? 1 : 0, fontVariantNumeric: 'tabular-nums' }}>
          {d < 0 ? '▼' : '▲'} {Math.abs(d)}
          {unit}
        </span>
      </div>
      <div style={{ marginTop: 12, height: 3, background: COLOR.inkFaint, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, v / max)) * 100}%`, background: COLOR.ink }} />
      </div>
    </div>
  );
};

/** A short italic note in the margin that changes with the lesson: the newest note rises in, the old one drops away. */
export const MarginNote: React.FC<{ notes: { at: number; text: string }[] }> = ({ notes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'relative', height: 120, marginTop: 8 }}>
      {notes.map((n, i) => {
        const next = notes[i + 1];
        const inP = snap(frame, fps, n.at, 24);
        const outP = next ? snap(frame, fps, next.at, 18) : 0;
        if (inP <= 0.001 || outP >= 0.999) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, right: 0, opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 14 - outP * 14}px)` }}>
            <div style={{ width: 28, height: 2, background: COLOR.red, marginBottom: 14 }} />
            <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 30, lineHeight: 1.25, color: COLOR.ink }}>{n.text}</div>
          </div>
        );
      })}
    </div>
  );
};
