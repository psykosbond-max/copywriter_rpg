import { loadFont } from '@remotion/fonts';
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT } from './tokens';

// Fonts ship in public/fonts (SIL Open Font License), so renders never depend on a network fetch.
let loading: Promise<unknown> | null = null;

export const loadLessonFonts = () => {
  if (!loading) {
    loading = Promise.all([
      loadFont({ family: FONT.serif, url: staticFile('fonts/Newsreader-Variable.woff2'), weight: '200 800', style: 'normal' }),
      loadFont({ family: FONT.serif, url: staticFile('fonts/Newsreader-Variable-Italic.woff2'), weight: '200 800', style: 'italic' }),
      loadFont({ family: FONT.display, url: staticFile('fonts/Jost-Variable.woff2'), weight: '100 900', style: 'normal' }),
      loadFont({ family: FONT.mono, url: staticFile('fonts/JetBrainsMono-Variable.woff2'), weight: '100 800', style: 'normal' }),
    ]);
  }
  return loading;
};

// Text is measured for layout, so nothing may render until the real fonts are in.
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Loading lesson fonts'));
  useEffect(() => {
    loadLessonFonts()
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};
