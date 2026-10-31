# Code-driven video and animation frameworks for an AI coding agent (Claude Code in a Linux container), as of 2026-10-31

Research note: in this session www.remotion.dev, snapcn.dev and thakicloud.github.io could not be fetched because they are outside the allowed network domains. Remotion facts below therefore come from the Remotion GitHub repos, search-result snippets of remotion.dev pages, and a third-party research document (Meldron09/Understand-Anything, 24 Oct 2026) that cites primary pages. Where a figure comes only from a search snippet or a third-party blog, it is marked as such.

## Remotion (React video): rendering, licence, agent skills, captions, audio, 9:16

### Takeaway
Remotion is the most mature and most widely used code-to-video framework for Claude Code. It has official Agent Skills (Jan 2026), an official Claude Code plugin, a TikTok-style captions pipeline (Whisper.cpp to @remotion/captions), and server, Lambda and in-browser (WebCodecs) renderers. Its main drawback is the licence: it is source-available, not open source, and any for-profit company with 4 or more employees must buy a Company Licence.

### Cited Findings
- **Version and activity:** v4.0.538 was released 2026-10-22, and the repo was pushed 2026-10-24 — [Meldron09 research doc citing remotion releases](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md); [remotion releases](https://github.com/remotion-dev/remotion/releases)
- **Free licence:** free for individuals, non-profits, and "a for-profit organization with up to 3 employees". Evaluation is also free while you are "not yet using it in a commercial way". Free use covers commercial video output, but you may not resell Remotion or a derivative of it — [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- **Company Licence:** required "if you are not within the group of entities eligible for a Free License". It adds prioritised support. Prices are not in LICENSE.md, which points to remotion.pro/license. LICENSE.md also says "In Remotion 5.0, the license will slightly change" (PR #3750) — [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- **Pricing (third-party, not verified on remotion.pro):** Creators cost $25 per seat per month. Automators cost $0.01 per render with a $100 per month minimum. One search snippet of Remotion's own page mentioned "Remotion for Automators… starting at $500 per month", which conflicts with the $100 minimum, so treat both as unverified — [Meldron09 doc citing remotion.pro/license](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md); [autoae.online "Is Remotion free"](https://autoae.online/blog/is-remotion-free); [wireflow Remotion pricing](https://www.wireflow.ai/blog/remotion-pricing)
- **Lambda costs:** for Lambda rendering, companies of 4 or more people need a Company Licence "in addition to the AWS cost" (search snippet of the Remotion license docs) — [remotion.dev/docs/license](https://remotion.dev/docs/license)
- **Telemetry:** voluntary on the Free and Creators plans, and reportedly mandatory for Automators from v5.0 — [Meldron09 doc citing remotion.dev/docs/license/faq](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **Rendering paths:**
  - CLI: `npx remotion render`.
  - Node: `renderMedia()` in @remotion/renderer, with `--frames` ranges and `--concurrency` (default is half the CPU threads).
  - Chrome Headless Shell downloads automatically.
  - Linux needs extra system dependencies.
  - `npx remotion benchmark` exists, but no per-minute render speed was found.
  - Source: [Meldron09 doc citing remotion.dev docs: cli/render, renderer/render-media, performance, linux-dependencies](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **Client-side rendering:** `@remotion/web-renderer` provides `renderMediaOnWeb()` and `renderStillOnWeb()`. It encodes with WebCodecs through Mediabunny instead of FFmpeg and needs no Node server or Lambda. One version of the docs calls it an experimental alpha, and a newer one says it is "stable from 4.0.491". It supports only a subset of HTML elements. Minimum browsers are Chrome 94+, Firefox 130+ and Safari 26+ — [remotion.dev client-side rendering](https://remotion.dev/docs/client-side-rendering/); [remotion.dev web renderer](https://www.remotion.dev/docs/web-renderer/)
- **Mediabunny:** Remotion sponsors Mediabunny at $1000 per month. It deprecated its own Media Parser on 1 Feb 2026 in favour of Mediabunny — [Remotion blog: mediabunny](https://www.remotion.dev/blog/mediabunny)
- **Official Agent Skills:**
  - Announced 20 Jan 2026: "Remotion now has Agent Skills - make videos just with Claude Code! $ npx skills add remotion-dev/skills" — [Remotion on X](https://x.com/Remotion/status/2013626968386765291)
  - The repo `remotion-dev/skills` has about 6.0k stars. Install with `npx skills add remotion-dev/skills`, `gh skill install remotion-dev/skills`, or `bun create video`.
  - Skills: `/remotion-best-practices`, `/remotion-create`, `/remotion-markup` (animations, layout, typography, media, effects, audio, fonts, timing), `/remotion-studio`, `/remotion-render`, `/remotion-maps`, `/remotion-captions`, `/remotion-saas`, `/remotion-interactivity`, `/remotion-docs`, `/remotion-upgrade`, `/remotion-multimedia`.
  - Source: [github.com/remotion-dev/skills](https://github.com/remotion-dev/skills)
- **Official Claude Code plugin:** `claude plugin marketplace add remotion-dev/claude-code-plugin` then `claude plugin install remotion@remotion`. It includes the Agent Skills and a remotion-create skill (search snippet of the Remotion docs) — [remotion.dev/docs/ai/claude-code-plugin](https://www.remotion.dev/docs/ai/claude-code-plugin); [remotion.dev/docs/ai/skills](https://www.remotion.dev/docs/ai/skills)
- **No official Remotion MCP server** appeared on the skills repo page — [github.com/remotion-dev/skills](https://github.com/remotion-dev/skills)
- **Captions:** convert Whisper output with `toCaptions()` from @remotion/install-whisper-cpp, then group the words into "pages" with per-word timings using `createTikTokStyleCaptions()` from @remotion/captions. Its `combineTokensWithinMilliseconds` option controls how many words appear per page. `convertToCaptions()` was deprecated in 4.0.216 — [remotion.dev convert-to-captions](https://www.remotion.dev/docs/install-whisper-cpp/convert-to-captions)
- **TikTok template:** the official `template-tiktok` repo generates TikTok-style captions with Whisper.cpp. For non-English audio, change `WHISPER_MODEL` to a model without the `.en` suffix — [remotion-dev/template-tiktok](https://github.com/remotion-dev/template-tiktok); [remotion.dev/templates/tiktok](https://remotion.dev/templates/tiktok)
- **9:16 usage in community guides:**
  - Tutorials set up 9:16 vertical canvases.
  - One guide suggests safe zones at 1080x1920: 150px from the top, 170px from the bottom, 60px at each side.
  - Sources: [chaseai.io guide](https://chaseai.io/blog/how-to-create-videos-claude-code-remotion); [openreplay blog](https://blog.openreplay.com/making-videos-claude-code-remotion/); [heyuan110 post, 2026-01-26](https://www.heyuan110.com/posts/ai/2026-01-26-claude-code-remotion-video/)
- **Licence risk for distribution:** one research team rejected Remotion as the default for a marketplace plugin because "companies of 4+ people need a paid license" and end users inherit that obligation — [Meldron09 issue #3](https://github.com/Meldron09/Understand-Anything/issues/3)

### Inferences
- For 9:16 narrated lessons, Remotion covers every requirement:
  - **Resolution:** the composition width and height set it, so 1080x1920 is just a prop.
  - **Brand fonts:** load with @remotion/google-fonts or local font files.
  - **Brand colours:** plain React and CSS.
  - **Voiceover:** an `<Audio>` track.
  - **Word-level captions:** the Whisper.cpp to createTikTokStyleCaptions pipeline.
- These API names (`<Audio>`, `<Composition>`, `useCurrentFrame`, `interpolate`, `spring`, @remotion/google-fonts) come from background knowledge of Remotion and could not be re-checked this session because remotion.dev was blocked.
- Rendering is frame-by-frame, driven by `useCurrentFrame()`, so it is deterministic when the code avoids wall-clock time and CSS animations. HyperFrames' comparison table warns that Remotion's "wall-clock patterns need care".
- **Licence check:** a solo creator or a company of 3 or fewer people can use Remotion free. Anyone larger must budget for Creators or Automators.

### Gaps
- Exact current Remotion Company Licence prices: remotion.pro could not be fetched, and the sources conflict ($100 vs $500 monthly minimum).
- Remotion 5.0 release status and its final licence changes.
- Lambda pricing and benchmark figures per minute of video.

## Motion Canvas and Revideo (TypeScript generator-based animation)

### Takeaway
Motion Canvas core is effectively dormant: the last stable release was Dec 2024, and it has no documented headless CLI. Revideo, an MIT-licensed fork with headless rendering, continues at midrender/revideo (0.11.0, July 2026) but moves slowly and has a smaller community. Neither has official agent skills, and neither is a strong first choice for an agent pipeline in late 2026.

### Cited Findings
- **Motion Canvas (MIT):**
  - Last stable release v3.17.2 on 2024-12-14.
  - Last feature commit 2025-02-16. Since then there has been only a docs-domain commit on 2026-07-02.
  - Video export goes through the editor UI with an FFmpeg exporter plugin, with no headless CLI documented.
  - Sources: [Meldron09 doc citing motion-canvas repo and motioncanvas.io/docs/rendering/video](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md); [Meldron09 issue #3: "stagnant, no stable release since Dec 2024"](https://github.com/Meldron09/Understand-Anything/issues/3)
- **Motion Canvas status, Hacker News:** an HN commenter in 2026 said "Motion Canvas is also abandoned, the main site is down" — [HN comment](https://news.ycombinator.com/item?id=47191103)
- **Canvas Commons:** a community fork created July 2025 for the editor workflow (third-party aggregator, not verified against the repo) — [snapcn Remotion alternatives (search snippet)](https://snapcn.dev/remotion-alternatives)
- **Revideo (MIT):**
  - npm 0.11.0 was tagged 2026-07-10, with the last push 2026-07-15 and 63 open issues. It is now maintained under the `midrender` org.
  - Install with `npm init @revideo@latest`, which needs Node >= 22.12.
  - It depends on Puppeteer, which downloads Chrome, and on a bundled `@ffmpeg-installer/ffmpeg`.
  - Rendering uses the `renderVideo()` API or the CLI endpoint and launches Puppeteer headless with `--single-process`.
  - Parallel rendering uses `workers` and `renderPartialVideo({workerId, numWorkers})`.
  - Anonymous PostHog telemetry is on by default; disable it with `DISABLE_TELEMETRY=true`.
  - Source: [Meldron09 doc citing midrender/revideo README and render-video.ts](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **Revideo assessment:** "thinner and slower-moving" than the alternatives — [Meldron09 issue #3](https://github.com/Meldron09/Understand-Anything/issues/3)
- **Revideo features (aggregator):** headless rendering, a render endpoint and CLI, Cloud Run deployment, parallel rendering, a React player, and audio and video export. Docs were last updated 2026-07-09 — [snapcn Remotion alternatives (search snippet)](https://snapcn.dev/remotion-alternatives); [midrender.com/revideo docs](https://midrender.com/revideo/docs/guide/designing-animations/designing-animations)

### Inferences
- Revideo's generator/`yield*` timeline model maps well to "narration beat then animation" sequencing, and it renders headless in Docker or Cloud Run. However, an LLM has much less training data and fewer docs for it than for Remotion, and it has no official skills. For an agent, that is likely to mean more errors.
- Do not start new agent pipelines on Motion Canvas core, because it needs its GUI editor to render.

### Gaps
- Revideo render speed per minute of output, and how it handles audio and captions: no sources found.
- Whether the old Revideo cloud service (re.video) still operates. The re.video domain was not checked.

## Manim Community edition and ManimGL

### Takeaway
Manim Community (MIT) is very active: v0.22.1 shipped on 27 Oct 2026. It renders headless from the CLI through PyAV with no separate ffmpeg install. It is excellent for maths, diagrams, graphs and geometric explainers, and newer versions add Typst text without LaTeX. It is less natural for brand-styled kinetic typography and social captions. ManimGL (3b1b) is less suited to containers.

### Cited Findings
- **Releases:**

  | Version | Date | Highlights |
  |---|---|---|
  | v0.22.1 | 27 Oct | Bug fixes |
  | v0.22.0 | 08 Oct | Output and video encoding reworked; new `Manager`; `[video_encoder]` config with `--video-codec` and `--pixel-format`; the `[ffmpeg]` config section renamed `[media]`; the OpenGL renderer now writes files by default |
  | v0.21.0 | 10 Aug | Typst and MathTypst mobjects "without requiring a TeX installation"; 2.2x Cairo speedup on animation-heavy scenes; parallel partial-movie encoding (`--max-inflight-encoders`) cut one benchmark by 56% |
  | v0.19.2 | — | Python 3.14 support; minimum Python 3.11 |
  | v0.19.0 | Jan 2025 | Video writing moved from an external ffmpeg process to PyAV |

  The year 2026 for v0.22.x is corroborated by [Meldron09 doc: v0.22.0 released 2026-10-08](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md). Release list: [ManimCommunity/manim releases](https://github.com/ManimCommunity/manim/releases)
- **Simpler install:** from v0.19.0, installation "only needs pip" and no separate ffmpeg — [r/manim release thread (mirror)](https://lr.us.psf.lt/r/manim/comments/1i5s5eb/manim_community_v0190_has_been_released)
- **Licence and rendering:**
  - MIT, copyright 3Blue1Brown LLC.
  - CLI: `manim render file.py Scene`, with `-q` quality presets.
  - Each Scene renders independently, so concatenating scenes happens outside Manim.
  - No telemetry was found.
  - Source: [Meldron09 doc](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **Manim CE as a fallback:** recommended as the fallback "for math/science concepts", and described as "very active" — [Meldron09 issue #3](https://github.com/Meldron09/Understand-Anything/issues/3)
- **ManimGL (MIT):** pushed 2026-09-09, but the latest release is v1.7.2 (2024-12-13), and its headless story is not established — [Meldron09 doc citing github.com/3b1b/manim](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **ManimGL vs CE:** a community post says ManimGL has better OpenGL support than CE — [r/manim mirror](https://lr.us.psf.lt/r/manim)

### Inferences
- Manim's Cairo renderer needs no GPU or display, so it runs headless in containers. This is background knowledge plus the CLI-only workflow above; it was not explicitly documented in the sources.
- Manim has no built-in audio-timeline sync for voiceover. Adding audio, captions and 9:16 layout would need:
  - setting the frame width and height to 1080x1920 in config;
  - timing animations by hand (or with the community add-on manim-voiceover, which is background knowledge and was not verified this session);
  - muxing audio and burning in captions with ffmpeg afterwards.
- It can follow a brand style (custom fonts through `Text(font=...)`, colours), but it reads as a maths look by default.

### Gaps
- Status of the manim-voiceover plugin in 2026.
- Benchmarks of Manim render speed per minute of 1080x1920 output.

## Other options: HTML-to-video, editing libraries, API services, frame capture, Lottie, WebCodecs

### Takeaway
HyperFrames (HeyGen, Apache-2.0, launched 2026) is the main new rival to Remotion for agents. You write plain HTML plus GSAP, it renders through deterministic seek-per-frame headless Chrome and FFmpeg, and it ships its own Claude Code plugin and skills with no licence fees. The older Node libraries are stale or limited:
- Editly: last pushed May 2025, latest tag is an rc.
- FFCreator: no recent release information found.
- Etro and Diffusion Studio Core: browser-only.
- MoviePy: compositing only, no animation model.

Cloud JSON APIs (Shotstack, Creatomate, JSON2Video) cost about $0.10–0.40 per rendered minute. Generic Puppeteer frame-capture tools such as timecut are old and miss CSS animations.

### Cited Findings
**HyperFrames (heygen-com/hyperframes)**
- **Overview:**
  - Apache 2.0, "with no per-render fees or commercial-use thresholds". Tagline: "Write HTML. Render video. Built for agents."
  - Packages: `hyperframes` (CLI), `@hyperframes/core`, `@hyperframes/engine` (Puppeteer and FFmpeg capture), `@hyperframes/producer` (capture, encode, audio mixing), plus studio, player, shader-transitions and aws-lambda.
  - The renderer "seeks each frame in headless Chrome and encodes the result with FFmpeg". "The same input produces the same video", backed by golden regression tests.
  - Renders locally or in Docker, with distributed rendering on AWS Lambda.
  - About 76.3k stars. Used in production at HeyGen.
  - Source: [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- **Agent use:**
  - Claude Code plugin through `claude plugin marketplace add` / `claude plugin install`.
  - `npx skills add heygen-com/hyperframes`.
  - Seven skills: `/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`, `/figma`, `/slideshow`, `/remotion-to-hyperframes`.
  - CLI commands: `npx hyperframes init|preview|lint|render|add <block>|catalog`. The CLI is non-interactive by default.
  - Sources: [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); [MindStudio explainer](https://www.mindstudio.ai/blog/what-is-hyperframes-html-video-renderer-ai-agents)
- **Audio and captions:** audio uses `<audio>` elements with `data-start`, `data-duration` and `data-volume`, mixed by the producer. `/media-use` covers voiceover, music and SFX through "HeyGen or free local tools". A captions block is in the catalog — [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- **Its own Remotion comparison:** no build step vs a bundler; plain HTML vs JSX; seekable adapters vs "wall-clock patterns need care"; Apache 2.0 vs the "source-available Remotion License" — [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- **Version, setup and speed** (all from the [Meldron09 doc citing hyperframes docs (cli.mdx, performance.mdx, rendering.mdx)](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)):
  - v0.8.193, released 2026-10-24 (pre-1.0). Repo created 2026-03-10, 302 open issues.
  - Needs Node 22+ and system FFmpeg. Chrome Headless Shell is fetched with `hyperframes browser ensure`.
  - Linux container compatibility exception for the Chromium sandbox; `--docker` mode. Site capture fails through HTTP proxies.
  - Outputs: MP4, WebM/MOV with alpha, GIF, PNG sequence, HLS.
  - Speed: 1080p, 300 frames (10 s) took 25.0 s unoptimised and 9.8 s optimised (median of 3, machine unspecified). That works out to about 1–2.5 minutes of rendering per output minute.
  - `--experimental-fast-capture` claims about 2x. `--workers` 1–24 (about 256 MB per Chrome).
  - Telemetry is on by default; turn it off with `HYPERFRAMES_NO_TELEMETRY=1`.
  - About 450 catalog blocks and a first-party "faceless explainer" workflow.
- **Recommended over Remotion:** one research team chose HyperFrames over Remotion as the default "for explainers, mechanisms, charts, kinetic text, code walkthroughs", with Manim as the fallback — [Meldron09 issue #3](https://github.com/Meldron09/Understand-Anything/issues/3)
- **HeyGen research post:** describes HyperFrames as their answer to AI video rendering — [HeyGen research: HTML to video](https://www.heygen.com/research/html-to-video)

**Editly, FFCreator, Etro, Twick, Diffusion Studio, MoviePy**
- **Editly (MIT):**
  - Node and FFmpeg, with a JSON5 spec, CLI and JS API, built for editing and slideshows.
  - Last push 2025-05-12. Latest tag v0.15.0-rc.1. Needs system FFmpeg and headless-gl.
  - Sources: [Meldron09 doc citing github.com/mifi/editly](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md); [npm editly](https://www.npmjs.com/package/editly)
- **FFCreator:** a Node short-video library with about 3.1k stars in an older directory snapshot. No recent release information was found — [LibHunt FFCreator vs editly](https://www.libhunt.com/compare-FFCreator-vs-editly)
- **Etro:** a TypeScript browser-based editing framework with video, audio, image and text layers and GLSL effects, about 1.1k stars (older snapshot) — [LibHunt video-editor topic](https://www.libhunt.com/topic/video-editor)
- **Twick:**
  - A React SDK for building video editors: canvas timeline, AI captions, and "serverless MP4 export" (server-side FFmpeg and AWS Lambda).
  - It has a small community. A 2026 roundup says its last npm release was May 2026.
  - Sources: [github.com/ncounterspecialist/twick](https://github.com/ncounterspecialist/twick); [img.ly 2026 roundup](https://img.ly/blog/best-open-source-video-editor-sdks-2025-roundup/)
- **Diffusion Studio Core (MPL-2.0):** a browser-only WebCodecs compositing engine that needs special HTTP headers and is not a CLI renderer. Last push 2025-11-18. The company now focuses on an AI browser editor — [Meldron09 doc citing github.com/diffusionstudio/core](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md); [YC: Diffusion Studio](https://ycombinator.com/companies/diffusion-studio)
- **MoviePy (MIT):** v2.2.1, released 2025-05-21. Clip compositing only, with no animation model — [Meldron09 doc citing github.com/Zulko/moviepy](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)

**API render services (Shotstack, Creatomate, JSON2Video)**
- **Typical cost:** third-party 2026 comparisons put these at about $0.10–$0.40 per rendered minute — [wireflow JSON2Video pricing](https://www.wireflow.ai/blog/json2video-pricing); [motionbox JSON2Video alternatives, Aug 2026](https://motionbox.io/blog/best-json2video-alternatives-in-2026)
- **Shotstack:**
  - About $0.16, $0.13 and $0.10 per minute on Starter, Pro and Scale ($39 per month Starter, 1080p max on Starter).
  - Another source quotes $0.40 per minute pay-as-you-go and $0.20 per minute from $39 per month.
  - Sources conflict on whether credits roll over.
  - Sources: [motionbox](https://motionbox.io/blog/best-json2video-alternatives-in-2026); [autoae Creatomate vs Shotstack](https://autoae.online/blog/creatomate-vs-shotstack-2026)
- **Creatomate:** credits scale with pixels and frame rate. About 37 credits per minute at 1080p30. Entry tier $41–54 per month for 2,000 credits — [wireflow Creatomate pricing](https://www.wireflow.ai/blog/creatomate-pricing)
- **JSON2Video:** 1 credit per second of video at any resolution. About $0.25 per minute on Professional ($49.95) and about $0.20 per minute on Startup. Hobby tier $16.95 per month — [wireflow JSON2Video pricing](https://www.wireflow.ai/blog/json2video-pricing)

**Puppeteer/Playwright frame capture with virtual time**
- **timesnap, timecut and timeweb:**
  - These override the page's JS time functions and screenshot each frame. timecut then encodes with ffmpeg; defaults are 800x600, 60 fps, 5 s, yuv420p.
  - Caveat: "pages where changes occur via other means (e.g. through video or transitions/animations from CSS rules) will likely not render as intended."
  - The original tungs/timecut was last pushed 2023-07-18, so it is stale, though forks exist.
  - Sources: [github.com/tungs/timecut](https://github.com/tungs/timecut); [awesome.ecosyste.ms timecut](https://awesome.ecosyste.ms/projects/github.com%2Ftungs%2Ftimecut)
- **puppeteer-capture:** uses Chrome HeadlessExperimental (BeginFrame) to capture frames deterministically, "better quality than using screencast". It must override `setTimeout`, `requestAnimationFrame` and `Date.now`. macOS is unsupported, last publish was 2024-10-31, and it has about 10 stars — [github.com/alexey-pelykh/puppeteer-capture](https://github.com/alexey-pelykh/puppeteer-capture); [npm puppeteer-capture](https://npmjs.com/package/puppeteer-capture)
- **Real-time screen recording:** vendor marketing says it introduces dropped frames and out-of-sync animations (unverified marketing claim) — [saashub HyperFrames app](https://www.saashub.com/hyperframes-app)

**Lottie to MP4**
- **puppeteer-lottie:** renders Lottie through Puppeteer and lottie-web to image, GIF or MP4; MP4 needs ffmpeg — [github.com/mahboubii/puppeteer-lottie](https://github.com/mahboubii/puppeteer-lottie)
- **lottie-render:** lottie-web in Chromium plus FFmpeg H.264, usable as an npm library or a self-hosted HTTP service — [github.com/steven-panxd/lottie-render](https://github.com/steven-panxd/lottie-render)
- **lottie-to-video:** a Puppeteer PNG-to-ffmpeg pipeline with a transparent background option, WebM with alpha, and TikTok/Instagram/YouTube presets — [github.com/followLemmi/lottie-to-video](https://github.com/followLemmi/lottie-to-video)
- **rasterlottie:** a Rust crate (v0.2.1) for rasterising Lottie without a browser — [docs.rs rasterlottie](https://docs.rs/crate/rasterlottie/latest/source/README.md)
- **rlottie vs ThorVG:** Canva's iOS app moved from rLottie to ThorVG — [moonb Lottie explainer](https://www.moonb.io/blog/what-is-lottie-animation)

### Inferences
- **ffmpeg filter graphs** (no source fetched this session; based on background knowledge of ffmpeg):
  - The filters drawtext, overlay, xfade, zoompan, subtitles/ass and amix can build simple 9:16 lessons: Ken-Burns stills, burned-in ASS captions with brand fonts, crossfades, and muxed voiceover.
  - They are fully deterministic and very fast. But writing complex motion graphics directly in filter syntax is brittle for an agent.
  - In practice ffmpeg is best as the final assembly and caption-burn step after Remotion, HyperFrames or Manim.
- **Theatre.js:** no 2025–2026 maintenance or video-export information was found. It is best treated as an animation-authoring library you would wrap in a frame-capture pipeline, not as a renderer.
- **WebCodecs:** the practical WebCodecs path in 2026 is Remotion's `@remotion/web-renderer` (through Mediabunny) or Diffusion Studio Core. In a headless container, Node-side rendering is simpler.
- **API services:** they avoid the container's Chromium/ffmpeg work but add per-minute cost, vendor lock-in and JSON-template limits on motion design. They suit high-volume templated output more than bespoke lesson animation.

### Gaps
- Theatre.js maintenance status and export options: nothing found.
- puppeteer-screen-recorder current status: not found.
- Etro's latest release date: not found.
- Twick licence: not verified.
- Vendor-verified prices for Shotstack, Creatomate and JSON2Video: only third-party or competitor blogs were reachable.
- HyperFrames 9:16 presets and caption formats are not documented on the README; only a 1920x1080 example is shown.

## What agents are commonly using in 2025–2026 (Claude Code skills, demos, blog posts)

### Takeaway
Two stacks dominate agent-made video in 2026:
- **Remotion with its official Agent Skills and Claude Code plugin** has had the most tutorials since January 2026.
- **HeyGen's HyperFrames with its plugin and skills** launched in March 2026 and grew to about 70k+ GitHub stars.

There are many community skills and toolkits, such as claude-remotion-skill and claude-code-video-toolkit. Most public demos are promotional, and their speed and quality claims are unverified.

### Cited Findings
- **Remotion launch:** Remotion announced Agent Skills on 20 Jan 2026 with a prompt-only demo animation — [Remotion on X](https://x.com/Remotion/status/2013626968386765291)
- **Install pattern:** run `npx remotion skills add` inside a project, then start Claude Code there. The skills are not Claude-only — [Tella blog](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code); [Mervin Praison, May 2026](https://mer.vin/2026/05/remotion-agent-skills-install-remotion-dev-skills-for-claude-code-and-cursor/)
- **Community skill:** "claude-remotion-skill" (unofficial) covers editing, B-roll, captions and sound design — [github.com/haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill)
- **Community workflows:**
  - Point Claude at a product URL. It scrapes the branding, takes screenshots, rebuilds the UI and produces a demo or explainer.
  - Make 9:16, 15-second shorts with animated text.
  - Sources: [chaseai.io](https://chaseai.io/blog/how-to-create-videos-claude-code-remotion); [sabrina.dev prompts](https://www.sabrina.dev/p/5-insane-claude-code-video-prompts?open=false); [OpenReplay blog](https://blog.openreplay.com/making-videos-claude-code-remotion/)
- **Data visualisations:** Will Larson (lethain.com) wrote about building visualisations with Remotion for his 2026 blog recap — [lethain.com](https://lethain.com/blog-recap-2026/)
- **claude-code-video-toolkit:** a third-party post reports running this Claude Code video toolkit; its content was not reachable in this session — [thakicloud post](https://thakicloud.github.io/en/technique/claude-code-video-toolkit/)
- **Curated roundups:** several roundups list video skills among the top Claude skills of 2026 — [Medium: 10 must-have skills](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051); [Composio top Claude skills](https://composio.dev/blog/top-claude-skills); [Medium: 5 best GitHub repos for Claude videos](https://tamimbuilds.medium.com/5-best-github-repo-for-claude-videos-51678130fea3)
- **HyperFrames for agents:** HyperFrames is installed through skills (`npx skills add heygen-com/hyperframes`) and ships a `/remotion-to-hyperframes` migration skill — [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); [MindStudio](https://www.mindstudio.ai/blog/what-is-hyperframes-ai-video-rendering)

### Inferences
- **"Claude Motion":** a comparison page title, "claude-motion-vs-remotion" (layer3labs, Oct 2026), and a Canva connector tool named "import-claude-motion-from-url" both suggest a first-party Anthropic product or feature called "Claude Motion". I found no primary source describing it, so it needs separate verification.
- For a Claude Code agent, an official skill plus a large corpus of public examples lowers the error rate. That favours Remotion and HyperFrames over Revideo, Motion Canvas or Etro.

### Gaps
- No primary Anthropic announcement about video skills was found.
- What "Claude Motion" is.
- Independent, reproducible quality and speed comparisons of Remotion vs HyperFrames for agent-written videos.

## Cross-cutting comparison: determinism, speed, audio, captions, and fit for 9:16 narrated lessons

### Takeaway
For 9:16 narrated lesson videos with captions, voiceover sync and brand fonts and colours, run headless in a container, the best fits are:
1. **Remotion:** most mature captions and audio APIs, official skills and template-tiktok. Licence cost applies for companies of 4 or more.
2. **HyperFrames:** Apache-2.0, agent-native HTML, deterministic seek capture, audio mixing and a captions block. It is young (pre-1.0, rapid releases).

Manim suits maths-style segments, and ffmpeg suits final muxing and caption burn-in. Most other tools are stale, browser-only or paid APIs.

### Cited Findings
- **Determinism:**
  - Remotion and HyperFrames both render frame by frame in headless Chrome. HyperFrames claims "the same input produces the same video" and seeks each frame — [HyperFrames repo](https://github.com/heygen-com/hyperframes)
  - Virtual-time capture tools (timecut) miss CSS animations and video elements — [tungs/timecut](https://github.com/tungs/timecut)
  - BeginFrame capture (puppeteer-capture) needs timer overrides — [puppeteer-capture](https://github.com/alexey-pelykh/puppeteer-capture)
- **Speed data points:**
  - HyperFrames: 10 s of 1080p in 9.8–25 s — [Meldron09 doc](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
  - Manim CE 0.21: 2.2x Cairo speedup — [Manim releases](https://github.com/ManimCommunity/manim/releases)
  - Remotion: no figure found; default concurrency is half the CPU threads — [Meldron09 doc](https://github.com/Meldron09/Understand-Anything/blob/research/programmatic-video/docs/research/programmatic-video.md)
- **Captions:**
  - Remotion: Whisper.cpp, then toCaptions, then createTikTokStyleCaptions — [Remotion docs](https://www.remotion.dev/docs/install-whisper-cpp/convert-to-captions)
  - HyperFrames: captions block in its catalog — [HyperFrames repo](https://github.com/heygen-com/hyperframes)
  - Twick: AI captions — [Twick](https://github.com/ncounterspecialist/twick)

### Inferences
Summary table:

| Tool | Licence/cost | Headless in container | Deterministic | Audio | Captions | 9:16 lesson fit |
|---|---|---|---|---|---|---|
| Remotion | Source-available; free for 3 or fewer employees, otherwise paid | Yes (Chrome Headless Shell plus Linux dependencies) | Yes, if frame-driven | Strong | Strong (Whisper to TikTok-style) | Excellent |
| HyperFrames | Apache-2.0, free | Yes (`--docker`, Lambda) | Yes (seek per frame) | Mixer, `data-start` | Catalog block | Very good; young |
| Revideo | MIT | Yes (Puppeteer) | Yes | Export supported | Manual | Fair; slow-moving |
| Motion Canvas | MIT | No (editor UI export) | n/a | n/a | n/a | Poor (dormant) |
| Manim CE | MIT | Yes (CLI, PyAV) | Yes | External mux | Manual or ffmpeg | Good for maths segments |
| Editly | MIT | Yes (headless-gl) | Yes | Yes | Basic titles | Fair (stale since 2025) |
| MoviePy | MIT | Yes | Yes | Yes | TextClip | Fair for simple assembly |
| ffmpeg filters | LGPL/GPL | Yes | Yes | Yes | ASS/drawtext | Good as final step |
| Shotstack, Creatomate, JSON2Video | ~$0.10–0.40 per minute | Cloud | Yes | Yes | Yes | Good for templates; recurring cost |
| timecut, puppeteer-capture | MIT-style, stale | Yes | Partial | No (mux separately) | No | Niche |
| Lottie to MP4 | Various OSS | Yes | Yes | No | No | For animated assets only |

- The ffmpeg licence, the MoviePy and Editly caption capabilities, and the Manim headless claim are background knowledge, not verified this session.
- A practical agent pipeline in the container:
  1. Generate TTS.
  2. Run Whisper (whisper.cpp) for word timestamps.
  3. Build a Remotion or HyperFrames composition at 1080x1920 with brand fonts and colours and word-highlight captions.
  4. Render to MP4.
  5. Optionally use ffmpeg for loudness normalisation and final mux.
  6. Use Manim only for diagram or maths inserts, rendered as clips and composited in.

### Gaps
- Benchmarks of Remotion vs HyperFrames on identical 60 s 1080x1920 scenes in a container: no independent data found.
- Confirmed HyperFrames caption-highlighting API details and 9:16 presets.
