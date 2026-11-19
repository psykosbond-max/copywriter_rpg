import React from 'react';
import { INK } from '../print/Print';
import { COLOR, FONT, TYPE } from '../../theme/tokens';
import { PrintGrain } from './PrintGrain';

/*
  EditorialBrowserMockup: a SaaS landing page as a flat, four-ink print. Window chrome, a tab and an
  address pill; a nav row; the hero (eyebrow, headline, subheadline, primary CTA, secondary link); a
  slate spec card with a small chart; a strip of customer marks. No shadows, no gradients, no outlines.

  The hero headline is the slot the lessons edit: `selection` drags a vermilion highlight across a
  range of its words, and `headlineSwap` (0 → 1) snaps a new headline into the slot.
  HERO gives the headline's position inside the mockup, so a lesson can aim a cursor or a comment at it.
*/

export const BROWSER = { w: 1200, h: 760, chrome: 52 } as const;
export const HERO = { x: 64, y: BROWSER.chrome + 154, w: 600 } as const;

export type Selection = { from: number; to: number; p: number };

type Props = {
  headline: string;
  /** A replacement headline, rolled into the slot as `headlineSwap` goes 0 → 1. */
  nextHeadline?: string;
  headlineSwap?: number;
  headlineSize?: number;
  nextHeadlineSize?: number;
  selection?: Selection;
  /** 0 → 1: the CTA presses in (a click). */
  ctaPress?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const mono = (size: number, color: string = COLOR.ink): React.CSSProperties => ({
  fontFamily: FONT.mono, fontSize: size, fontWeight: 500, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color, lineHeight: 1,
});

/** Words of a headline, with a dragged selection box behind a range of them. */
export const SelectableLine: React.FC<{ text: string; selection?: Selection; style: React.CSSProperties }> = ({ text, selection, style }) => {
  const words = text.split(' ');
  const span = selection ? selection.to - selection.from + 1 : 0;
  const reach = selection ? selection.p * span : 0;
  return (
    <div style={style}>
      {words.map((w, i) => {
        const k = selection ? i - selection.from : -1;
        const on = selection && k >= 0 && k < span ? Math.max(0, Math.min(1, reach - k)) : 0;
        // the space after a word belongs to the word, so a selection runs on without seams
        const piece = i < words.length - 1 ? `${w}\u00a0` : w;
        const lastSelected = k === span - 1;
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}>
            {on > 0 ? (
              <span style={{ position: 'absolute', left: k === 0 ? -4 : 0, top: '0.1em', bottom: '0.02em', width: lastSelected ? `calc(${on * 100}% - 0.18em)` : `${on * 100}%`, background: 'rgba(217, 56, 30, 0.18)' }} />
            ) : null}
            <span style={{ position: 'relative' }}>{piece}</span>
            {i < words.length - 1 ? <wbr /> : null}
          </span>
        );
      })}
    </div>
  );
};

export const EditorialBrowserMockup: React.FC<Props> = ({ headline, nextHeadline, headlineSwap = 0, headlineSize = 50, nextHeadlineSize = 76, selection, ctaPress = 0, style, children }) => {
  const W = BROWSER.w;
  const H = BROWSER.h;
  const c = BROWSER.chrome;
  const swapping = nextHeadline !== undefined && headlineSwap > 0;
  const head: React.CSSProperties = { fontFamily: FONT.serif, fontWeight: 460, lineHeight: 1.08, letterSpacing: '-0.012em', color: COLOR.ink };
  return (
    <div style={{ position: 'absolute', width: W, height: H, background: COLOR.paper, borderRadius: 14, overflow: 'hidden', ...style }}>
      {/* the sheet the page is printed on is a shade deeper than the paper around it */}
      <div style={{ position: 'absolute', inset: 0, background: '#FBFAF6' }} />

      {/* window chrome */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: c, background: INK.charcoal }}>
        {[INK.terracotta, INK.slate, INK.cream].map((col, i) => (
          <div key={i} style={{ position: 'absolute', left: 22 + i * 24, top: 19, width: 14, height: 14, borderRadius: 7, background: col }} />
        ))}
        {/* the tab, cut out of the chrome in paper */}
        <div style={{ position: 'absolute', left: 112, top: 10, width: 236, height: c - 10, background: '#FBFAF6', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
          <div style={{ width: 12, height: 12, background: INK.slate, borderRadius: 2 }} />
          <span style={mono(12)}>Ledgerly · Invoices</span>
        </div>
        <div style={{ position: 'absolute', left: 380, top: 13, width: 560, height: 26, borderRadius: 13, background: '#2A2A28', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
          <div style={{ width: 9, height: 11, borderRadius: 2, border: 'none', background: INK.cream, opacity: 0.6 }} />
          <span style={{ ...mono(12, INK.cream), letterSpacing: '0.06em', textTransform: 'none' }}>ledgerly.app</span>
        </div>
      </div>

      {/* nav */}
      <div style={{ position: 'absolute', left: HERO.x, right: 56, top: c + 30, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 26, height: 26, background: INK.slate, borderRadius: 6, marginRight: 12, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 6, top: 7, width: 14, height: 3, background: INK.cream }} />
          <div style={{ position: 'absolute', left: 6, top: 13, width: 9, height: 3, background: INK.cream }} />
        </div>
        <span style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 600, color: COLOR.ink }}>Ledgerly</span>
        <div style={{ flex: 1 }} />
        {['Product', 'Pricing', 'Customers', 'Sign in'].map((t) => (
          <span key={t} style={{ ...mono(12), marginLeft: 34, color: COLOR.inkSoft }}>{t}</span>
        ))}
        <span style={{ marginLeft: 34, padding: '10px 16px', background: COLOR.ink, color: COLOR.paper, ...mono(12, COLOR.paper), borderRadius: 6 }}>Try free</span>
      </div>
      <div style={{ position: 'absolute', left: HERO.x, right: 56, top: c + 84, height: 1.5, background: COLOR.inkFaint }} />

      {/* hero */}
      <div style={{ position: 'absolute', left: HERO.x, top: c + 120, ...mono(13, COLOR.red) }}>Automation · Accounts receivable</div>
      <div style={{ position: 'absolute', left: HERO.x, top: HERO.y, width: HERO.w, height: 200, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: HERO.w, transform: swapping ? `translateY(${-110 * headlineSwap}%)` : undefined, opacity: swapping ? 1 - headlineSwap : 1 }}>
          <SelectableLine text={headline} selection={selection} style={{ ...head, fontSize: headlineSize }} />
        </div>
        {swapping ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: HERO.w, transform: `translateY(${(1 - headlineSwap) * 110}%)` }}>
            <div style={{ ...head, fontSize: nextHeadlineSize, fontWeight: 560, letterSpacing: '-0.02em' }}>{nextHeadline}</div>
          </div>
        ) : null}
      </div>
      {/* subheadline: set copy, then the paragraph's rhythm as bars */}
      <div style={{ position: 'absolute', left: HERO.x, top: HERO.y + 214, width: 520, fontFamily: FONT.serif, fontSize: 22, lineHeight: 1.4, color: COLOR.inkSoft }}>
        Ledgerly pairs every payment with the invoice it settles, across all your bank feeds.
      </div>
      {/* CTA */}
      <div style={{ position: 'absolute', left: HERO.x, top: HERO.y + 316, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ padding: '18px 28px', background: COLOR.red, borderRadius: 8, fontFamily: FONT.display, fontSize: 20, fontWeight: 600, color: COLOR.paper, transform: `translateY(${2 * ctaPress}px) scale(${1 - 0.03 * ctaPress})` }}>
          Start free trial
        </div>
        <span style={{ ...mono(13), borderBottom: `2px solid ${COLOR.ink}`, paddingBottom: 4 }}>See how it works</span>
      </div>

      {/* sidebar spec card */}
      <div style={{ position: 'absolute', left: 760, top: c + 120, width: 380, height: 400, background: INK.slate, borderRadius: 12, padding: 28, boxSizing: 'border-box' }}>
        <div style={mono(12, INK.cream)}>This month</div>
        <div style={{ fontFamily: FONT.display, fontSize: 64, fontWeight: 600, color: INK.cream, marginTop: 16, lineHeight: 1 }}>1,284</div>
        <div style={{ ...mono(12, INK.cream), opacity: 0.75, marginTop: 10 }}>payments matched</div>
        {/* a small bar chart in the print inks */}
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 92, height: 120, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          {[0.42, 0.55, 0.38, 0.7, 0.62, 0.86, 0.74, 0.95].map((v, i) => (
            <div key={i} style={{ flex: 1, height: `${v * 100}%`, background: i === 7 ? INK.terracotta : INK.cream, opacity: i === 7 ? 1 : 0.85, borderRadius: '3px 3px 0 0' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 28, display: 'flex', justifyContent: 'space-between' }}>
          {[['Banks', '14'], ['Match rate', '99.2%'], ['Avg. time', '3 s']].map(([k, v]) => (
            <div key={k}>
              <div style={{ ...mono(10, INK.cream), opacity: 0.7 }}>{k}</div>
              <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 600, color: INK.cream, marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* customer marks */}
      <div style={{ position: 'absolute', left: HERO.x, right: 56, bottom: 38, display: 'flex', alignItems: 'center', gap: 40 }}>
        <span style={mono(11, COLOR.inkSoft)}>Trusted by finance teams at</span>
        {[86, 64, 104, 72, 92].map((w, i) => (
          <div key={i} style={{ width: w, height: 18, background: COLOR.inkFaint, borderRadius: i % 2 ? 9 : 3 }} />
        ))}
      </div>

      <PrintGrain seed={23} strength={0.9} radius={14} />
      {children}
    </div>
  );
};
