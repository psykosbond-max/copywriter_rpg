import { Config } from '@remotion/cli/config';

// 1080p60 H.264 at high quality. The look is flat colour and sharp type, so a low CRF keeps edges clean.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Optional: point Remotion at an existing Chrome/Chromium instead of downloading one,
// e.g. REMOTION_BROWSER=/path/to/chrome npm run render:lesson01
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
