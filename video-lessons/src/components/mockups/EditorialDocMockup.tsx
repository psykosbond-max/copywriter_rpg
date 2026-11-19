import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { caretOn, snap } from '../../lib/motion';
import { INK } from '../print/Print';
import { COLOR, FONT, TYPE } from '../../theme/tokens';
import { PrintGrain } from './PrintGrain';
import { Selection, SelectableLine } from './EditorialBrowserMockup';

/*
  EditorialDocMockup: a working draft in a document editor, as a flat print. A title bar with the
  document's name and a Share button; a formatting ribbon; a ruler with tick marks and terracotta
  margin stops; a paper page on a tinted canvas, with dashed margin guides; and a comment column where
  margin comments pop open and connect to the line they are about.

  Lines are the lesson's content. Each has a state: written, being typed (with a blinking caret and a
  character count), struck through, or highlighted. DOC gives positions so a lesson can aim at a line
  or a comment (a cursor, a fingertip).
*/

export const DOC = {
  w: 1240, h: 820, bar: 58, ribbon: 46, ruler: 30,
  page: { x: 56, w: 820 },
  text: { x: 56 + 84, w: 820 - 168 },
  firstLine: 58 + 46 + 30 + 120,
  lineGap: 112,
  comments: { x: 56 + 820 + 34, w: 290 },
} as const;
export const docLineY = (i: number) => DOC.firstLine + i * DOC.lineGap;

export type DocLine = {
  label: string;
  text: string;
  /** Characters typed so far (omit for fully written). */
  typed?: number;
  /** 0 → 1: struck through. */
  struck?: number;
  selection?: Selection;
  /** 0 → 1: fades in as the line becomes current. */
  show?: number;
  /** Emphasis for the line that has landed. */
  final?: boolean;
};

export type DocComment = { line: number; at: number; title: string; body?: string; resolved?: number };

const mono = (size: number, color: string = COLOR.ink): React.CSSProperties => ({
  fontFamily: FONT.mono, fontSize: size, fontWeight: 500, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color, lineHeight: 1,
});

const Comment: React.FC<{ c: DocComment }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, fps, c.at, 16);
  if (p <= 0.001) return null;
  const y = docLineY(c.line) - 16;
  const resolved = c.resolved ?? 0;
  return (
    <>
      {/* the thread from the comment back to its line */}
      <div style={{ position: 'absolute', left: DOC.text.x + DOC.text.w + 8, top: y + 36, width: (DOC.comments.x - (DOC.text.x + DOC.text.w + 8)) * p, height: 2, background: COLOR.red, opacity: 0.55 * (1 - resolved) }} />
      <div
        style={{
          // once resolved, a comment folds down to a one-line chip so the next one has room
          position: 'absolute', left: DOC.comments.x, top: y, width: DOC.comments.w * (1 - 0.3 * resolved), padding: resolved > 0.5 ? '10px 14px 10px 20px' : '16px 18px 18px 22px', boxSizing: 'border-box',
          background: '#FBFAF6', borderRadius: 10, opacity: p * (1 - 0.55 * resolved), transform: `scale(${0.86 + 0.14 * p}) translateX(${(1 - p) * 18}px)`, transformOrigin: '0 30%',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 5, borderRadius: 3, background: resolved > 0.5 ? INK.slate : COLOR.red }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: INK.terracotta, color: INK.cream, fontFamily: FONT.display, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>E</div>
          <span style={mono(11)}>Editor</span>
          <span style={mono(10, COLOR.inkSoft)}>{resolved > 0.5 ? 'Resolved' : 'now'}</span>
        </div>
        {resolved < 0.5 ? <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 650, color: COLOR.red, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 12 }}>{c.title}</div> : null}
        {c.body && resolved < 0.5 ? <div style={{ fontFamily: FONT.serif, fontSize: 19, lineHeight: 1.3, color: COLOR.ink, marginTop: 6 }}>{c.body}</div> : null}
      </div>
    </>
  );
};

export const EditorialDocMockup: React.FC<{ title: string; lines: DocLine[]; comments?: DocComment[]; style?: React.CSSProperties; children?: React.ReactNode }> = ({ title, lines, comments = [], style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = DOC.bar + DOC.ribbon + DOC.ruler;
  return (
    <div style={{ position: 'absolute', width: DOC.w, height: DOC.h, borderRadius: 14, overflow: 'hidden', background: '#EFEDE6', ...style }}>
      {/* title bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: DOC.w, height: DOC.bar, background: '#FBFAF6', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14 }}>
        <div style={{ width: 26, height: 32, background: INK.slate, borderRadius: 3, position: 'relative' }}>
          {[9, 15, 21].map((y) => <div key={y} style={{ position: 'absolute', left: 6, top: y, width: y === 21 ? 9 : 14, height: 2.5, background: INK.cream }} />)}
        </div>
        <span style={{ fontFamily: FONT.serif, fontSize: 22, color: COLOR.ink }}>{title}</span>
        <span style={mono(11, COLOR.inkSoft)}>Saved · just now</span>
        <div style={{ flex: 1 }} />
        {[INK.terracotta, INK.slate].map((col, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: col, marginLeft: -8 }} />)}
        <div style={{ marginLeft: 14, padding: '9px 18px', borderRadius: 18, background: COLOR.red, ...mono(12, COLOR.paper) }}>Share</div>
      </div>
      {/* formatting ribbon */}
      <div style={{ position: 'absolute', left: 0, top: DOC.bar, width: DOC.w, height: DOC.ribbon, background: '#F4F2EC', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 18 }}>
        <div style={{ padding: '6px 12px', borderRadius: 6, background: '#E7E4DC', fontFamily: FONT.serif, fontSize: 15 }}>Newsreader</div>
        <div style={{ padding: '6px 10px', borderRadius: 6, background: '#E7E4DC', fontFamily: FONT.mono, fontSize: 13 }}>14</div>
        <div style={{ width: 1.5, height: 22, background: COLOR.inkFaint }} />
        {['B', 'I', 'U'].map((l) => (
          <span key={l} style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: l === 'B' ? 700 : 400, fontStyle: l === 'I' ? 'italic' : 'normal', textDecoration: l === 'U' ? 'underline' : 'none', width: 18, textAlign: 'center' }}>{l}</span>
        ))}
        <div style={{ width: 16, height: 16, borderRadius: 3, background: COLOR.red }} />
        <div style={{ width: 1.5, height: 22, background: COLOR.inkFaint }} />
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: k === 1 ? 'center' : k === 2 ? 'flex-end' : 'flex-start' }}>
            {[16, 11, 14].map((w, i) => <div key={i} style={{ width: w, height: 2, background: COLOR.ink }} />)}
          </div>
        ))}
        <div style={{ width: 1.5, height: 22, background: COLOR.inkFaint }} />
        <div style={{ width: 22, height: 16, borderRadius: 3, background: INK.slate }} />
        <div style={{ flex: 1 }} />
        <span style={mono(11, COLOR.red)}>Suggesting</span>
      </div>
      {/* ruler */}
      <div style={{ position: 'absolute', left: DOC.page.x, top: DOC.bar + DOC.ribbon, width: DOC.page.w, height: DOC.ruler, background: '#FBFAF6' }}>
        {Array.from({ length: Math.floor(DOC.page.w / 21) }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: i * 21, bottom: 0, width: 1.2, height: i % 4 === 0 ? 11 : 6, background: COLOR.inkSoft }} />
        ))}
        {Array.from({ length: Math.floor(DOC.page.w / 84) }, (_, i) => (
          <span key={i} style={{ position: 'absolute', left: i * 84 + 3, top: 3, fontFamily: FONT.mono, fontSize: 9, color: COLOR.inkSoft }}>{i}</span>
        ))}
        {/* margin stops */}
        {[84, DOC.page.w - 84].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x - 6, top: 0, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `9px solid ${INK.terracotta}` }} />
        ))}
      </div>
      {/* the page */}
      <div style={{ position: 'absolute', left: DOC.page.x, top: top + 14, width: DOC.page.w, height: DOC.h, background: '#FBFAF6' }}>
        {/* dashed margin guides */}
        {[84, DOC.page.w - 84].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 0, borderLeft: `1.5px dashed ${COLOR.inkFaint}` }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 54, height: 0, borderTop: `1.5px dashed ${COLOR.inkFaint}` }} />
      </div>
      <div style={{ position: 'absolute', left: DOC.text.x, top: top + 48, ...mono(13, COLOR.red) }}>Hero headline · the so-what ladder</div>

      {lines.map((l, i) => {
        const typing = l.typed !== undefined && l.typed < l.text.length;
        const text = l.typed !== undefined ? l.text.slice(0, Math.max(0, Math.floor(l.typed))) : l.text;
        const show = l.show ?? 1;
        const struck = l.struck ?? 0;
        return (
          <div key={i} style={{ position: 'absolute', left: DOC.text.x, top: docLineY(i) - 34, width: DOC.text.w, opacity: show }}>
            <div style={{ ...mono(11, l.final ? COLOR.red : COLOR.inkSoft), marginBottom: 10 }}>{l.label}</div>
            <div style={{ position: 'relative' }}>
              <SelectableLine
                text={text || ' '}
                selection={l.selection}
                style={{ fontFamily: FONT.serif, fontSize: l.final ? 44 : 30, fontWeight: l.final ? 600 : 420, lineHeight: 1.18, color: struck > 0.5 ? COLOR.inkSoft : COLOR.ink, letterSpacing: l.final ? '-0.015em' : 0, display: 'inline' }}
              />
              {typing || (l.typed !== undefined && caretOn(frame, fps)) ? (
                <span style={{ display: 'inline-block', width: 3, height: l.final ? 46 : 32, marginLeft: 2, verticalAlign: 'text-bottom', background: COLOR.red, opacity: typing || caretOn(frame, fps) ? 1 : 0 }} />
              ) : null}
              {struck > 0 ? <div style={{ position: 'absolute', left: -4, top: '52%', height: 3, width: `calc(${struck * 100}% + 8px)`, background: COLOR.red, transform: 'rotate(-0.6deg)' }} /> : null}
            </div>
          </div>
        );
      })}

      {comments.map((c, i) => <Comment key={i} c={c} />)}
      <PrintGrain seed={31} strength={0.9} radius={14} />
      {children}
    </div>
  );
};
