// Design tokens shared by every lesson. Change the look here, not in the compositions.

export const COLOR = {
  paper: '#F7F5F0', // warm off-white canvas
  ink: '#141413', // deep charcoal
  inkSoft: 'rgba(20, 20, 19, 0.55)', // secondary text, captions
  inkFaint: 'rgba(20, 20, 19, 0.14)', // hairlines, struck words
  red: '#D9381E', // vermilion: strike-throughs, callouts, highlights
} as const;

export const FONT = {
  serif: 'Newsreader',
  mono: 'JetBrains Mono',
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 60,
} as const;

// Layout grid for 1920x1080: generous margins, Swiss-style left alignment.
export const GRID = {
  marginX: 160,
  headerY: 104,
  captionY: 930,
  contentWidth: 1920 - 160 * 2,
} as const;

// The house spring: overdamped, zero bounce. `durationInFrames` is set per use
// so the same curve can be quick (a strike) or slow (a camera move).
export const SPRING = {
  damping: 200,
  stiffness: 180,
  mass: 1,
} as const;

export const TYPE = {
  mono: { size: 22, tracking: '0.16em' },
  sentence: { size: 84, lineHeight: 1.18, weight: 420 },
} as const;
