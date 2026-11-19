import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EditorialCharacter, POSES } from '../components/EditorialCharacter';
import { CoffeeCup, CoffeeMachine, Desk, DeskLamp, Easel, EditorsPencil, Manuscript, Stopwatch, Strike } from '../components/EditorialObjects';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, GRID, TYPE } from '../theme/tokens';

/*
  Two stills to judge the illustrated world before it animates:
  - EditDeskScene: the editor marks up the draft; the product, the cup and the proof (40 s) sit on the desk.
  - ObjectSheet: every object on its own, large, named in the display face.
*/

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: TYPE.mono.size, fontWeight: 500, letterSpacing: TYPE.mono.tracking,
  textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

const display: React.CSSProperties = { fontFamily: FONT.display, color: COLOR.ink, lineHeight: 1 };

const STRIKES: Strike[] = [
  { line: 1, from: 64, to: 196 },
  { line: 3, from: 0, to: 150 },
  { line: 5, from: 92, to: 214 },
];

const Header: React.FC<{ left: string; right: string }> = ({ left, right }) => (
  <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: 72 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ ...mono, display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ width: 14, height: 14, background: COLOR.red, display: 'inline-block' }} />
        {left}
      </div>
      <div style={{ ...mono, color: COLOR.inkSoft }}>{right}</div>
    </div>
    <div style={{ marginTop: 22, height: 2, background: COLOR.ink }} />
  </div>
);

const at = (left: number, floor: number, height: number): React.CSSProperties => ({ position: 'absolute', left, top: floor - height });

// ---------- the scene ----------

const FLOOR = 980;
const DESK_TOP = 727;

export const EditDeskScene: React.FC = () => {
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <Header left="Lesson 01 / The adjective purge" right="Scene study" />

      {/* the rule, set in the display sans with the serif italic for the turn */}
      <div style={{ position: 'absolute', left: GRID.marginX, top: 168, display: 'flex', alignItems: 'baseline', gap: 26 }}>
        <span style={{ ...display, fontSize: 66, fontWeight: 560, letterSpacing: '0.04em', textTransform: 'uppercase' }}>If a rival could say it,</span>
        <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 78, fontWeight: 400, color: COLOR.red, lineHeight: 1 }}>cut it.</span>
      </div>

      <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: FLOOR, height: 2, background: COLOR.inkFaint }} />

      {/* the draft on its easel */}
      <Easel height={640} style={at(640, FLOOR, 640)} />
      <Manuscript height={380} strikes={STRIKES} progress={STRIKES.length + 1} style={at(690, 736, 380)} />

      {/* the editor, pencil in hand */}
      <EditorialCharacter pose={POSES.pointing} frontHand="pencil" height={640} style={at(150, FLOOR + 640 * (32 / 780), 640)} />

      {/* the desk: the product, its promise, and the proof */}
      <Desk height={253} style={at(1150, FLOOR, 253)} />
      <DeskLamp height={330} flip style={at(1463, DESK_TOP, 330)} />
      <CoffeeMachine height={230} pour={1} style={at(1180, DESK_TOP, 230)} />
      <CoffeeCup height={86} t={0} style={at(1395, DESK_TOP, 86)} />
      <Stopwatch height={104} seconds={40} showReadout={false} style={at(1505, DESK_TOP, 104)} />

      {[
        { x: 200, n: '01', t: 'The editor' },
        { x: 690, n: '02', t: 'The draft' },
        { x: 1180, n: '03', t: 'The product, the cup, the proof' },
      ].map((l) => (
        <div key={l.n} style={{ position: 'absolute', left: l.x, top: FLOOR + 30, ...mono, fontSize: 18, color: COLOR.inkSoft, display: 'flex', gap: 14 }}>
          <span style={{ color: COLOR.red }}>{l.n}</span>
          <span>{l.t}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ---------- the specimen sheet ----------

const Name: React.FC<{ x: number; y: number; n: string; name: string; note: string }> = ({ x, y, n, name, note }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <div style={{ ...display, fontSize: 26, fontWeight: 560, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', gap: 12 }}>
      <span style={{ color: COLOR.red }}>{n}</span>
      <span>{name}</span>
    </div>
    <div style={{ ...mono, fontSize: 15, color: COLOR.inkSoft, marginTop: 10, letterSpacing: '0.12em' }}>{note}</div>
  </div>
);

export const ObjectSheet: React.FC = () => {
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;
  const ROW1 = 540;
  const ROW2 = 900;
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <Header left="Editorial objects · print set" right="Jost · Newsreader · JetBrains Mono" />

      <Manuscript height={340} strikes={STRIKES} progress={STRIKES.length + 1} style={at(170, ROW1, 340)} />
      <CoffeeMachine height={360} pour={0.7} style={at(520, ROW1, 360)} />
      <CoffeeCup height={200} t={0} style={at(900, ROW1, 200)} />
      <Stopwatch height={230} seconds={40} style={at(1170, ROW1, 230)} />
      <DeskLamp height={360} style={at(1450, ROW1, 360)} />
      <Name x={170} y={ROW1 + 28} n="01" name="Manuscript" note="Strikes draw in order" />
      <Name x={540} y={ROW1 + 28} n="02" name="Espresso machine" note="Pour 0 → 1 · gauge" />
      <Name x={900} y={ROW1 + 28} n="03" name="Cup" note="Steam drifts with time" />
      <Name x={1170} y={ROW1 + 28} n="04" name="Stopwatch" note="Driven by seconds" />
      <Name x={1460} y={ROW1 + 28} n="05" name="Desk lamp" note="Jointed arms + shade" />

      <Desk height={190} style={at(170, ROW2, 190)} />
      <EditorsPencil height={40} style={at(860, ROW2 - 90, 40)} />
      <Name x={170} y={ROW2 + 24} n="06" name="Desk" note="Splayed legs · drawer" />
      <Name x={860} y={ROW2 - 30} n="07" name="Grease pencil" note="Charcoal barrel · red point" />
      <div style={{ position: 'absolute', left: 1460, top: ROW2 - 200, width: 300 }}>
        <div style={{ ...display, fontSize: 120, fontWeight: 300, letterSpacing: '-0.02em' }}>Aa</div>
        <div style={{ ...mono, fontSize: 15, color: COLOR.inkSoft, marginTop: 14, letterSpacing: '0.12em' }}>Jost · display sans for titles, numbers and names</div>
      </div>
    </AbsoluteFill>
  );
};
