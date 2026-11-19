import React, { createContext, useContext } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Move, cameraAt } from '../../lib/camera';
import { COLOR, FONT, TYPE } from '../../theme/tokens';
import { PaperBreath } from './PaperBreath';

/*
  EditorialStage: the frame every lesson from 02 on is built in.

  ┌──────────────── header ────────────────┬──── margin title ────┐
  │  STAGE (70%)                           │  EDITOR'S MARGIN     │
  │  a world of any size, seen through a   │  (30%) live metrics  │
  │  2D camera (pan, zoom, rack focus)     │  and notes; fixed,   │
  │  + a fixed foreground (the character)  │  never moves         │
  └────────────────────────────────────────┴──────────────────────┘

  Rack focus: when `rack` rises toward 1 the camera pushes in a further 8% about its centre, and every
  <Defocus> layer that is not marked active blurs (2 px) and dims (to 35%), so the eye lands on the edit.
*/

export const STAGE = { width: 1344, height: 1080, marginLeft: 1344, marginWidth: 576, headerY: 72, ruleY: 120 } as const;

const RackContext = createContext(0);

/** Wrap anything in the world that should fall out of focus during a rack. `active` keeps it sharp. */
export const Defocus: React.FC<{ active?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ active = false, children, style }) => {
  const rack = useContext(RackContext);
  const a = active ? 0 : rack;
  return <div style={{ position: 'absolute', inset: 0, filter: a > 0.01 ? `blur(${2 * a}px)` : undefined, opacity: 1 - 0.65 * a, ...style }}>{children}</div>;
};

export const stageMono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: 18, fontWeight: 500, letterSpacing: TYPE.mono.tracking,
  textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

type Props = {
  /** Camera moves over the world, in world px (the world's x runs across the stage's 1344 px). */
  moves: Move[];
  /** Rack focus 0 → 1 (see rackAt). */
  rack?: number;
  /** Header text, top left of the stage. */
  title: React.ReactNode;
  /** 0 → 1: header, rules and margin draw in. */
  open?: number;
  /** The world: positioned absolutely in world px. */
  world: React.ReactNode;
  /** Fixed over the stage, outside the camera (a presenter, a breadcrumb). */
  foreground?: React.ReactNode;
  /** The Editor's Margin column. */
  margin?: React.ReactNode;
};

export const EditorialStage: React.FC<Props> = ({ moves, rack = 0, title, open = 1, world, foreground, margin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = cameraAt(moves, frame, fps);
  const s = cam.s * (1 + 0.08 * rack);
  const cx = STAGE.width / 2;
  const cy = STAGE.height / 2;
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      {/* the stage */}
      {/* clipped just below the header rule, so the world never rides over the header */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE.width, height: STAGE.height, overflow: 'hidden', clipPath: `inset(${STAGE.ruleY + 4}px 0 0 0)` }}>
        <RackContext.Provider value={rack}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE.width, height: STAGE.height, transformOrigin: '0 0', transform: `translate(${cx - cam.cx * s}px, ${cy - cam.cy * s}px) scale(${s})` }}>
            {world}
          </div>
        </RackContext.Provider>
        {foreground}
      </div>

      {/* header across both columns */}
      <div style={{ position: 'absolute', left: 120, top: STAGE.headerY, width: STAGE.width - 120 - 64, opacity: open, ...stageMono, fontSize: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 13, height: 13, background: COLOR.red, display: 'inline-block' }} />
        {title}
      </div>
      <div style={{ position: 'absolute', left: STAGE.marginLeft + 48, top: STAGE.headerY, opacity: open, ...stageMono, fontSize: 20, color: COLOR.inkSoft }}>Editor’s margin</div>
      <div style={{ position: 'absolute', left: 120, right: 120, top: STAGE.ruleY, height: 2, background: COLOR.ink, transformOrigin: '0 50%', transform: `scaleX(${open})` }} />
      {/* the vertical hairline between stage and margin */}
      <div style={{ position: 'absolute', left: STAGE.marginLeft, top: STAGE.ruleY, width: 1.5, height: 1080 - STAGE.ruleY - 80, background: COLOR.inkFaint, transformOrigin: '50% 0', transform: `scaleY(${open})` }} />
      <div style={{ position: 'absolute', left: STAGE.marginLeft + 48, top: STAGE.ruleY + 48, width: STAGE.marginWidth - 48 - 120 + 64, bottom: 80, opacity: open }}>{margin}</div>

      <PaperBreath />
    </AbsoluteFill>
  );
};
