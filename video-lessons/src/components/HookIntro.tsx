import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { shake } from '../lib/camera';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT } from '../theme/tokens';
import { PaperBreath } from './stage/PaperBreath';

/*
  HookIntro: a cold open before a lesson's title, in the launch-video manner: one spoken promise,
  punched onto the screen in hard beats.

    GIVE ME            slams in
    30 SECONDS         a giant vermilion numeral; a stopwatch ring sweeps half a turn round it
    — hard cut —
    and I'll teach you how to
    hook               a fishing line drops in, its hook catches the word …
    YOUR AUDIENCE.
    — exit —           … and yanks it up out of frame, which is the cut into the lesson.

  All timings are frames relative to the start of the intro, so a lesson places it in a <Sequence>.
*/

export type HookBeats = {
  giveMe: number;
  thirty: number;
  seconds: number;
  teach: number;
  hook: number;
  audience: number;
  /** The yank: the hook and the word fly up and the intro ends `exitDur` frames later. */
  out: number;
};

export const HOOK_EXIT = 26;

/** A slam: overshoots in from 118% in 4 frames, then a damped shake. Returns a CSS transform and opacity. */
const slam = (frame: number, fps: number, at: number, amp = 7) => {
  const t = frame - at;
  if (t < -4) return { opacity: 0, transform: 'scale(1.18)' };
  const k = Math.min(1, Math.max(0, (t + 4) / 4));
  return { opacity: Math.min(1, k * 1.5), transform: `translateX(${shake(frame, fps, at, amp, 14, 0.07)}px) scale(${1.18 - 0.18 * k})` };
};

const display: React.CSSProperties = { fontFamily: FONT.display, fontWeight: 600, textTransform: 'uppercase', color: COLOR.ink, lineHeight: 0.9, letterSpacing: '0.01em' };

export const HookIntro: React.FC<{ beats: HookBeats; seconds?: number }> = ({ beats: b, seconds = 30 }) => {
  // `seconds` (the number shown) and `b.seconds` (the frame the word lands) are different things
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;

  // ---- act 1: GIVE ME 30 SECONDS ----
  if (frame < b.teach) {
    const ring = snap(frame, fps, b.thirty + 4, Math.max(20, b.teach - b.thirty - 10));
    const sweep = (seconds / 60) * 360 * ring;
    const r = 272;
    const cx = 470;
    const cy = 660;
    const a = ((sweep - 90) * Math.PI) / 180;
    const ex = cx + r * Math.cos(a);
    const ey = cy + r * Math.sin(a);
    const s30 = slam(frame, fps, b.thirty, 10);
    return (
      <AbsoluteFill style={{ background: COLOR.paper }}>
        <div style={{ position: 'absolute', left: 160, top: 150, ...display, fontSize: 150, ...slam(frame, fps, b.giveMe) , transformOrigin: '0 50%' }}>Give me</div>
        {frame >= b.thirty - 4 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, opacity: s30.opacity }}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLOR.ink} strokeOpacity={0.14} strokeWidth={6} />
              {Array.from({ length: 12 }, (_, i) => {
                const t = (i * 30 * Math.PI) / 180;
                return <line key={i} x1={cx + (r - 22) * Math.sin(t)} y1={cy - (r - 22) * Math.cos(t)} x2={cx + (r - 8) * Math.sin(t)} y2={cy - (r - 8) * Math.cos(t)} stroke={COLOR.ink} strokeOpacity={0.4} strokeWidth={3} />;
              })}
              {sweep > 0.5 ? <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${ex} ${ey}`} fill="none" stroke={COLOR.red} strokeWidth={12} strokeLinecap="round" /> : null}
              {sweep > 0.5 ? <circle cx={ex} cy={ey} r={13} fill={COLOR.red} /> : null}
            </svg>
            <div style={{ position: 'absolute', left: cx - 260, top: cy - 160, width: 520, textAlign: 'center', ...display, fontSize: 300, fontWeight: 650, color: COLOR.red, letterSpacing: '-0.03em', ...s30, transformOrigin: '50% 50%' }}>{seconds}</div>
            <div style={{ position: 'absolute', left: 800, top: cy + 40, ...display, fontSize: 150, ...slam(frame, fps, b.seconds, 5), transformOrigin: '0 50%' }}>Seconds.</div>
          </>
        ) : null}
        <PaperBreath />
      </AbsoluteFill>
    );
  }

  // ---- act 2: and I'll teach you how to HOOK your audience ----
  const yank = interpolate(frame, [b.out, b.out + HOOK_EXIT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lift = -1300 * yank * yank * yank; // accelerates away, like a line pulled taut
  const drop = snap(frame, fps, b.hook - 10, 22); // the line lowers onto the word
  const line = interpolate(drop, [0, 1], [-520, 0]);
  const hookIn = slam(frame, fps, b.hook, 6);
  const others = 1 - snap(frame, fps, b.out, 14);
  const teachP = snap(frame, fps, b.teach, 18);
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <div style={{ position: 'absolute', left: 166, top: 236, fontFamily: FONT.serif, fontSize: 66, color: COLOR.ink, opacity: teachP * others, transform: `translateY(${(1 - teachP) * 16}px)` }}>
        and I’ll teach you how to
      </div>

      {/* the word, the line and the hook travel together when yanked */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${lift}px)` }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <g transform={`translate(0 ${line})`}>
            {/* fishing line from above the frame to the hook's eye */}
            <line x1={940} y1={-600} x2={940} y2={318} stroke={COLOR.ink} strokeWidth={2.5} />
            {/* the hook: eye, shank, bend and barbed point, curling under the end of the word */}
            <circle cx={940} cy={330} r={12} fill="none" stroke={COLOR.ink} strokeWidth={6} />
            <path d="M 940 342 L 940 600 C 940 694, 806 704, 790 622 L 786 582" fill="none" stroke={COLOR.ink} strokeWidth={9} strokeLinecap="round" />
            <path d="M 786 582 L 810 608" fill="none" stroke={COLOR.ink} strokeWidth={8} strokeLinecap="round" />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 150, top: 300, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 330, fontWeight: 420, color: COLOR.red, lineHeight: 1, letterSpacing: '-0.02em', ...hookIn, transformOrigin: '30% 60%' }}>
          hook
        </div>
      </div>

      <div style={{ position: 'absolute', left: 160, top: 760, ...display, fontSize: 130, opacity: others, ...(frame < b.out ? slam(frame, fps, b.audience, 5) : {}), transformOrigin: '0 50%' }}>
        your audience.
      </div>
      <PaperBreath />
    </AbsoluteFill>
  );
};
