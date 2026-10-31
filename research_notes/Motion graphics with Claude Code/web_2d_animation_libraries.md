# Web and 2D animation libraries an AI coding agent can drive and render deterministically to MP4 (as of 2026-10-31)

Research context: Claude Code in a Linux container with Node, headless Chromium/Playwright and ffmpeg; the target is 9:16 narrated social lesson videos with kinetic typography and illustrated scenes.

Method note: gsap.com and playwright.dev could not be fetched from this session (DNS blocked by the session's network allowlist), and the GitHub API was not enabled. Version, date and licence data below comes from the npm registry (queried live on 2026-10-31) and from the tarball of gsap@3.15.0, which I downloaded and inspected. Other facts come from web search results and GitHub READMEs fetched with WebFetch. API method names that I took from my own knowledge and did not re-verify this session are labelled as such under Inferences.

### Snapshot table: npm registry metadata (queried 2026-10-31)
Source for every row: `https://registry.npmjs.org/<package>` (for example [gsap](https://registry.npmjs.org/gsap), [motion](https://registry.npmjs.org/motion)).

| Package | Latest | Published | Licence field | Maintenance signal |
|---|---|---|---|---|
| gsap | 3.15.0 | 2026-04-13 | GSAP Standard "no charge" licence | Active |
| motion (formerly Framer Motion) | 14.9.0 | 2026-10-30 | MIT | Very active |
| animejs | 4.5.0 | 2026-06-22 | MIT | Active |
| pixi.js | 8.22.0 | 2026-10-01 | MIT | Very active |
| p5 | 2.3.4 | 2026-09-25 | LGPL-2.1 | Active (p5 2.x) |
| paper (Paper.js) | 0.16.0 | 2026-10-21 | MIT | Revived, new release |
| two.js | 0.8.24 | 2026-08-29 | MIT | Active |
| konva | 10.9.0 | 2026-10-15 | MIT | Very active |
| zdog | 1.1.3 | 2022-01-22 | MIT | Stale (no release for about 4.5 years) |
| roughjs | 4.6.6 | 2023-11-20 | MIT | Stable or slow (about 3 years) |
| vivus | 0.4.6 | 2021-04-17 | MIT | Stale |
| flubber | 0.4.2 | 2018-03-01 | MIT | Unmaintained (but small and still works) |
| kute.js | 2.2.6 | 2026-03-26 | MIT | Some 2026 activity |
| d3-transition | 3.0.1 | 2021-06-09 | ISC | Feature-complete or stable |
| popmotion | 11.0.5 | 2022-08-15 | MIT | Effectively superseded by Motion |
| @mojs/core | 1.7.1 | 2023-10-06 | MIT | Slow or stale |
| velocity-animate | 1.5.2 | 2018-07-31 | MIT | Unmaintained |
| lottie-web | 5.13.0 | 2025-05-21 | MIT | Slow (last release about 17 months ago) |
| @lottiefiles/dotlottie-web | 0.82.0 | 2026-10-30 | MIT | Very active |
| @rive-app/canvas and @rive-app/canvas-advanced | 2.49.0 | 2026-10-29 | MIT | Very active |
| @theatre/core | 0.7.2 | 2024-05-19 | Apache-2.0 (the studio editor is AGPL) | Stalled on npm since May 2024 |
| @tsparticles/engine | 4.5.0 | 2026-10-25 | MIT | Very active |
| timecut / timesnap | 0.3.3 | 2022-04-03 | BSD-3-Clause | Stale |
| timeweb | 0.3.2 | 2023-05-01 | BSD-3-Clause | Stale |
| splitting (Splitting.js) | 1.1.0 | 2024-05-31 | MIT | Slow |
| hyperframes | 0.8.223 | 2026-10-31 | Apache-2.0 | Very active (published today) |
| remotion | 4.0.539 | 2026-10-26 | Custom (see LICENSE.md) | Very active |
| chart.js | 4.6.1 | 2026-10-22 | MIT | Active |
| echarts | 6.1.0 | 2026-05-19 | Apache-2.0 | Active |

---

## Q1. Timeline/tween libraries: GSAP, Motion, anime.js v4, WAAPI, CSS (@property, scroll-driven), SVG/SMIL, Popmotion, Mo.js, Velocity

### Takeaway
GSAP is the strongest default for agent-authored motion graphics. It is free for commercial use including every former Club plugin (SplitText, MorphSVG, DrawSVG, MotionPath, Flip and others), and a paused master timeline can be seeked to any time deterministically. The one licence caveat is a clause against building no-code visual animation tools that compete with Webflow, which does not affect generating videos with code. anime.js v4 (MIT) and Motion (MIT) are good permissive alternatives. Popmotion and Velocity are superseded or unmaintained, and Mo.js is slow.

### Cited Findings
- **GSAP licence.** The gsap@3.15.0 npm README says: "Thanks to Webflow, GSAP is now 100% FREE including ALL of the bonus plugins like SplitText, MorphSVG, and all the others that were exclusively available to Club GSAP members... even for commercial use". The README links to the standard "no charge" licence at gsap.com/standard-license. — [npm gsap](https://registry.npmjs.org/gsap) (tarball inspected); [GSAP GitHub](https://github.com/greensock/gsap)
- The plugins ship in the public npm tarball (inspected): DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper, Flip, SplitText, ScrambleTextPlugin, CustomEase, CustomBounce, CustomWiggle, Physics2DPlugin, PhysicsPropsPlugin, PixiPlugin, InertiaPlugin, GSDevTools, ScrollSmoother and EaselPlugin. — [npm gsap 3.15.0](https://registry.npmjs.org/gsap)
- GSAP went free on 2025-04-30, after Webflow acquired GreenSock. GreenSock's announcement: "GSAP is now 100% FREE - including ALL of the bonus plugins". — [GreenSock on X](https://x.com/greensock/status/1917618886796574918); [CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/); [motionkit.io](https://motionkit.io/blog/gsap-is-free-what-it-means-for-wordpress)
- The standard licence grants a "non-exclusive, worldwide license... solely for Permitted Uses". Webflow can terminate the licence for non-compliance. — [GSAP Standard License](https://gsap.com/community/standard-license/)
- The licence's "Prohibited Uses" clause covers using GSAP in no-code visual animation tools that compete with Webflow's animation-building features. It defines "Competitive Products" as tools that let users create or edit animations "through a visual interface or builder similar to Webflow". Forum commentators call the wording a "legal grey zone". — [GSAP Standard License](https://gsap.com/community/standard-license/); [ScanCode LicenseDB entry gsap-standard-no-charge-2025](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html); [Blocs forum](https://forum.blocsapp.com/t/gsap-is-now-100-free/25872)
- A 2026 blog credits the GSAP 3.13 release with a rewritten SplitText. — [artofstyleframe GSAP 2026 notes](https://artofstyleframe.com/blog/gsap-2026-free-license-whats-new/). This is a secondary source; I did not verify it on gsap.com, which was blocked.
- **HyperFrames uses GSAP.** HeyGen's agent-oriented HTML-to-video framework drives GSAP with "a paused GSAP timeline registered on window.__timelines, seeked frame by frame and encoded with FFmpeg". It ships a `/gsap` skill for Claude Code. — [themenonlab blog](https://themenonlab.blog/blog/hyperframes-claude-code-writes-renders-videos); [HyperFrames claude-design guide](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/claude-design-hyperframes.md)
- **Motion.** MIT licensed and usable from vanilla JS (`import { animate } from "motion"`). Its feature list includes timelines (sequences), variants and stagger. Motion+ is a paid one-time "lifetime" membership that adds premium examples and APIs such as Cursor and Ticker. — [motiondivision/motion GitHub](https://github.com/motiondivision/motion); [motion.dev](https://motion.dev/)
- **anime.js 4.x.** MIT licensed with zero dependencies. v4 has a Timeline system and tree-shakeable ES modules. — [licenses.dev animejs 4.5.0](https://licenses.dev/npm/animejs/4.5.0); [npm animejs](https://npmjs.com/package/animejs); [mintlify anime docs mirror](https://www.mintlify.com/juliangarnier/anime)
- **Maintenance of older libraries.** Velocity.js: "no meaningful commits in several years... should be considered unmaintained". Popmotion's use case has "largely been absorbed" by Framer Motion (now Motion). Mo.js has been community-maintained since 2019. — [daily.dev 2026 list](https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024/); [awesome-web-animation](https://github.com/sergey-pimenov/awesome-web-animation). npm dates corroborate this: velocity-animate last released 2018-07-31, popmotion 2022-08-15, @mojs/core 2023-10-06. — [npm registry](https://registry.npmjs.org/velocity-animate)
- **CSS animations and transitions, SVG/SMIL animations and `element.animate()` (WAAPI)** are all time sources that timeweb has to virtualize separately from JS timers. In other words, they do not follow `requestAnimationFrame`/`Date` overrides automatically. — [tungs/timeweb README](https://github.com/tungs/timeweb)
- HyperFrames lists "GSAP, CSS, Lottie, Three.js, Anime.js, WAAPI, or your own frame adapter for seekable animation" as its supported runtimes. — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)

### Inferences
- **Recommended default for lesson videos:** one GSAP master timeline per scene (`gsap.timeline({paused:true})`), using:
  - SplitText for per-char, word or line kinetic type
  - DrawSVG for line reveals
  - MorphSVG for icon or shape morphs
  - MotionPath for objects following paths
  - Flip for layout re-arrangement transitions
  - CustomEase and CustomWiggle for character
  
  The agent renders by calling `tl.seek(frame/fps)` or `tl.progress()` per frame and taking a screenshot. These are standard GSAP API names from my knowledge (not re-verified this session).
- Generating MP4s with code is far from "building a no-code visual animation builder", so the Webflow-competition clause should not bite. If the user ever productises a visual editor on top of GSAP, that would need legal review.
- **anime.js v4:** timelines and animations expose `seek()` / `currentTime` (from my knowledge; I did not re-verify the v4 method names). It is a good MIT fallback if GSAP's licence is a concern.
- **Motion (vanilla):** `animate()` returns controls with `time` / `pause()`. Motion is WAAPI-backed for many properties, so headless seeking should go through its returned controls (or WAAPI `currentTime`) rather than relying on wall-clock time.
- **WAAPI / CSS animations:** these are deterministic if the agent pauses everything and sets time per frame, e.g. `document.getAnimations().forEach(a => { a.pause(); a.currentTime = t_ms })`. That call covers CSS animations and transitions as well as `element.animate()` (standard DOM API, from my knowledge).
- **@property** (typed custom properties) makes gradients, angles and numbers animatable in pure CSS, which is useful for counters and gradient sweeps.
- **Scroll-driven animations** (`animation-timeline: scroll()/view()`) have no role in video unless the agent scrubs `scrollTop` per frame. They are a niche fit for video.
- **SMIL:** `svgElement.pauseAnimations()` + `setCurrentTime(t)` gives seekable SMIL (standard SVGSVGElement API, from my knowledge). It is fine for simple icon animation, but AI-authored SMIL is verbose, so GSAP is more ergonomic.

### Gaps
- I could not read the full "Permitted Uses" list or the exact current wording on gsap.com (domain blocked); the clause above comes from search snippets of the official page and the ScanCode LicenseDB.
- I could not confirm the exact anime.js v4 `seek` signature or Motion's vanilla timeline-seeking API from primary docs this session.
- I found no source on GSAP 3.14/3.15 changelog contents.

---

## Q2. Canvas/WebGL 2D and SVG-drawing libraries: PixiJS v8, p5.js, Paper.js, Two.js, Konva, Zdog, Rough.js, Vivus, flubber/KUTE.js, D3 transitions, chart libraries

### Takeaway
PixiJS v8, Konva, Two.js, Paper.js (which shipped a new release in Oct 2026), p5.js 2.x and Chart.js/ECharts are all actively maintained. Zdog, Vivus, flubber and d3-transition have not had a release in years but are small and functional. The deterministic pattern is the same for all of them: disable each library's internal ticker or autoplay and render a frame from an explicit `t`. Alternatively, let GSAP drive their properties (GSAP ships a PixiPlugin).

### Cited Findings
- **Versions and licences** (npm registry, 2026-10-31):
  - pixi.js 8.22.0 (2026-10-01, MIT)
  - p5 2.3.4 (2026-09-25, **LGPL-2.1**)
  - paper 0.16.0 (2026-10-21, MIT)
  - two.js 0.8.24 (2026-08-29, MIT)
  - konva 10.9.0 (2026-10-15, MIT)
  - zdog 1.1.3 (2022-01-22, MIT)
  - roughjs 4.6.6 (2023-11-20, MIT)
  - vivus 0.4.6 (2021-04-17, MIT)
  - flubber 0.4.2 (2018-03-01, MIT)
  - kute.js 2.2.6 (2026-03-26, MIT)
  - d3-transition 3.0.1 (2021-06-09, ISC)
  - chart.js 4.6.1 (2026-10-22, MIT)
  - echarts 6.1.0 (2026-05-19, Apache-2.0)
  
  — [npm registry](https://registry.npmjs.org/pixi.js)
- GSAP's npm package includes PixiPlugin and EaselPlugin for tweening Pixi and EaselJS display objects. — [npm gsap 3.15.0](https://registry.npmjs.org/gsap)
- Vivus has 15,500+ GitHub stars. KUTE.js is MIT. Zdog is described as a pseudo-3D engine for canvas and SVG. — [awesome-web-animation](https://github.com/sergey-pimenov/awesome-web-animation); [daily.dev](https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024/)
- timeweb overrides `requestAnimationFrame`, `performance.now`, `Date`, timers, CSS transitions and animations, SVG animations, videos and `element.animate()`. Canvas libraries that tick off rAF can therefore be time-virtualized without code changes. Known failures are iframes, `event.timeStamp` and audio analyser nodes. — [tungs/timeweb](https://github.com/tungs/timeweb)

### Inferences
Fit and per-library notes (render APIs are from my knowledge and were not re-verified):
- **PixiJS v8.** Best for heavy 2D: particles, sprites, filters (blur, glow, displacement), many objects, WebGL/WebGPU. For deterministic output, use `app.ticker.stop()` (or `autoStart:false`) and call `app.render()` after setting state for time t. Headless Chromium may fall back to SwiftShader software GL, which is slower but works.
- **Konva.** Scene graph on Canvas 2D with Tween and Animation classes. Simple and agent-friendly for illustrated scenes built from shapes and images. Seek by setting node attributes from t, or by driving them with GSAP.
- **Two.js.** Renderer-agnostic (SVG, Canvas, WebGL) vector drawing. Good for flat-illustration shapes and morph-like vertex animation. Use `two.update()` manually.
- **Paper.js.** Strong vector path maths (boolean ops, path smoothing, offsets), useful for blobby organic shapes. The `onFrame` handler uses event.time, so drive it manually.
- **p5.js 2.x.** Generative and noise art (`noise()`), creative-coding idioms LLMs know very well. Call `noLoop()` + `redraw()` with a frame counter, and set `randomSeed()` / `noiseSeed()` for determinism. Its LGPL licence is fine for use, but note it if bundling.
- **Zdog.** Flat pseudo-3D "illustrated" objects (spinning icons, characters). It is stale but tiny and stable. Set rotation from t and call `illo.updateRenderGraph()`.
- **Rough.js.** Hand-drawn or sketchy rendering of shapes, which fits "illustrated lesson" aesthetics. It has a randomness seed option, which needs fixing per shape or the strokes will "boil" every frame. That boil can be a deliberate stylised effect at a low frame rate.
- **Vivus.** SVG line-drawing (stroke-dashoffset). GSAP DrawSVG or plain CSS/JS `stroke-dashoffset` give the same effect with a seekable timeline. Vivus is redundant if GSAP is used.
- **flubber / KUTE.js.** Shape morphing between arbitrary SVG paths. flubber is unmaintained but works via `interpolate(a,b)(t)`, which is a pure function and therefore perfectly deterministic. GSAP MorphSVG is now free and is the stronger choice.
- **D3 transitions.** Use d3-transition for data viz. Bypass wall-clock timers by computing interpolators (`d3.interpolate`) at explicit t, or by using timeweb or virtual time. Chart.js animations are rAF-driven, so set `animation:false` and tween data manually for seek-ability, or use virtual time. ECharts is similar.

### Gaps
- I did not verify GPU/WebGL behaviour of PixiJS v8 under headless Chromium in this container (it may need `--use-angle=swiftshader` or `--enable-unsafe-swiftshader` flags).
- I found no 2026 sources on Chart.js/ECharts deterministic export specifically.

---

## Q3. Lottie: lottie-web, dotLottie, authoring Lottie JSON by code, AI Lottie generators, rendering to MP4

### Takeaway
Lottie is a good interchange format for reusable icon and character loops, and it can be rendered frame-exactly. lottie-web supports `goToAndStop(frame, true)`, and dotlottie-web has `setFrame()`, which works regardless of play state. dotlottie-web (ThorVG/WASM, MIT) is the actively maintained runtime, while lottie-web's last release was May 2025. Agents can author Lottie JSON with python-lottie or Glaxnimate's scripting. Direct LLM-to-raw-Lottie-JSON generation is error-prone, and dedicated research models (OmniLottie, CVPR 2026) exist because of this.

### Cited Findings
- **Runtimes.** lottie-web 5.13.0 (2025-05-21, MIT). @lottiefiles/dotlottie-web 0.82.0 (2026-10-30, MIT). — [npm registry](https://registry.npmjs.org/@lottiefiles/dotlottie-web)
- **dotlottie-web internals.** It "rasterizes every frame of your animation with a native rendering engine and draws the result onto an HTML `<canvas>`", built on ThorVG compiled to WebAssembly. `dotLottie.setFrame(n)` "renders the animation at the specified frame regardless of its current state (playing, paused, or stopped)". — [LottieFiles blog: new dotLottie web player](https://lottiefiles.com/blog/working-with-lottie-animations/new-dotlottie-web-player)
- A May 2026 LottieFiles post says dotlottie-web ships WebGL and WebGPU renderer backends (`@lottiefiles/dotlottie-web/webgl`, `/webgpu`), both powered by ThorVG. — [LottieFiles blog: WebGL & WebGPU](https://lottiefiles.com/blog/working-with-lottie-animations/hardware-accelerated-lottie-on-the-web-dotlottie-web-now-ships-webgl-webgpu)
- The ThorVG docs list "headless rendering, server-side" (image and video generation) as a use case. — [LottieFiles docs: ThorVG](https://docs.lottiefiles.com/en/runtimes/overview/thorvg)
- **python-lottie** (PyPI `lottie`) is a Python framework for building animations from code using classes that emit valid Lottie JSON. Its `lottie_convert.py` renders stills and GIF/WebP and lists other formats. — [PyPI lottie](https://pypi.org/project/lottie/); [glaxnimate bundled python-lottie README](https://lxr.kde.org/source/graphics/glaxnimate/data/lib/python-lottie/README.md)
- **Glaxnimate 0.6.0** (3 March 2026) is the first stable release as part of KDE. It is a vector animation editor supporting Lottie, animated GIF, WebP and SVG, with Python scripting, and it bundles python-lottie. — [KDE apps: Glaxnimate](https://apps.kde.org/de/glaxnimate/); [Arch package glaxnimate 0.6.0](https://archlinux.org/packages/extra-testing/x86_64/glaxnimate/); [KDE post 2026-03-04](https://notestock.osa-p.net/@kde@floss.social/20260304/view?lang=zh)
- **puppeteer-lottie** (Node) renders Lottie JSON to MP4 or GIF via headless Chrome and ffmpeg. — [puppeteer-lottie readme](https://github.com/TheJizel/puppeteer-lottie/blob/master/readme.md)
- **OmniLottie** (arXiv 2603.02138; CVPR 2026 poster) generates Lottie from text, text plus image, or video. It tokenizes Lottie JSON into compact shape, effect and animation commands, and was trained on MMLottie-2M (about 2M animations). The paper notes that prior approaches emitting raw Lottie JSON have low success rates because of the strict format. A secondary summary reports about 88–93% success rates; I did not verify that figure in the paper. A fal.ai endpoint exists (`fal-ai/omnilottie`). — [arXiv 2603.02138](https://arxiv.org/pdf/2603.02138); [CVPR 2026 poster](https://cvpr.thecvf.com/virtual/2026/poster/37471); [fal.ai omnilottie](https://fal.ai/models/fal-ai/omnilottie/llms.txt); [HackerNoon summary](https://sia.hackernoon.com/omnilottie-solves-ai-animations-hardest-problem)
- The OmniLottie paper names LottieFiles "Motion Copilot" as a commercial tool automating keyframe generation. I found no details of its 2026 features. — [arXiv 2603.02138](https://arxiv.org/pdf/2603.02138)
- A community Claude skill, "lottie-animator", exists for generating Lottie. — [claudepluginhub lottie-animator](https://www.claudepluginhub.com/skills/obeskay-lottie-animator/lottie-animator)
- HyperFrames supports Lottie as a seekable adapter. Remotion has a `@remotion/lottie` package (4.0.539, 2026-10-26). — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); [npm @remotion/lottie](https://registry.npmjs.org/@remotion/lottie)

### Inferences
- For lesson videos, Lottie is best used for **pre-made assets**: LottieFiles library icons, characters and reaction loops placed into an HTML scene and seeked per frame. For bespoke scene choreography, GSAP plus SVG is easier for an agent to author and debug.
- **Authoring by code:**
  - python-lottie gives a typed object model, which is safer than hand-writing raw JSON.
  - An agent can also convert SVG to Lottie and add keyframes.
  - Validate by rendering frames to PNG and inspecting them.
- **Frame-exact rendering:**
  - lottie-web: `anim = lottie.loadAnimation({autoplay:false, renderer:'svg'})`, then `anim.goToAndStop(frameIndex, true)` per frame. This is the standard lottie-web API from my knowledge; not re-verified this session.
  - dotlottie-web: `autoplay:false` + `setFrame(n)`.
  - Map video fps to the Lottie file's own `fr` (frame rate) to avoid judder.
- The ThorVG and rlottie / Skottie (Skia) family could render Lottie without a browser, but I did not verify a maintained Node CLI for this.

### Gaps
- I could not confirm a python-lottie direct MP4 export path. The format table shows MP4 only partially, so ffmpeg is needed.
- I found no evidence of dotLottie (.lottie zip) export from python-lottie or Glaxnimate.
- I found no reliable 2026 details on LottieFiles' own AI tools (Motion Copilot, prompt-to-Lottie features).

---

## Q4. Rive: state machines, runtimes, can an agent author .riv, scripting, headless rendering

### Takeaway
Rive is designed to be authored in the Rive Editor and played by runtimes. The web runtimes (@rive-app/canvas, canvas-advanced 2.49.0, MIT) are very active, and Luau scripting launched in January 2026. An agent cannot officially author .riv files. An unofficial, source-available (not open source) "rive-mcp" server writes .riv binaries from a JSON scene spec and renders them headlessly. Frame-accurate export is possible by manually advancing the runtime in headless Chromium. For lesson videos, Rive is a niche or optional choice compared with GSAP or Lottie.

### Cited Findings
- **Runtime versions.** @rive-app/canvas and @rive-app/canvas-advanced 2.49.0, published 2026-10-29, MIT. — [npm registry](https://registry.npmjs.org/@rive-app/canvas-advanced)
- **Scripting.** Rive announced Scripting as a core platform feature on 2026-01-13. It runs across web, iOS, Android and game engines via the open-source C++ runtime. The language is Luau (a small VM, "a couple of hundred kilobytes"), and the Editor runs the same scripting engine as the runtimes. — [Rive blog: scripting is live](https://rive.app/blog/scripting-is-live-in-rive); [Rive blog: why Luau](https://rive.app/blog/why-scripting-runs-on-luau); [Rive scripting docs](https://rive.app/docs/scripting)
- **rive-mcp (ODU33104), unofficial:**
  - What it does: "create, edit, inspect, render and live-preview .riv animations" without the Rive editor. It serializes .riv from a JSON scene spec and can losslessly edit existing files.
  - Supported content: shapes, gradients, images, text (including text on path), bones and skinning, IK, mesh deformation, keyframes with easing, multi-layer state machines, listeners, events, physics baking, particles and audio. It can import SVG and Lottie and decompile .riv.
  - Rendering: uses the official @rive-app/canvas-advanced WASM in headless Chromium, with output to PNG, GIF, APNG, WebM and sprite sheets, plus Lottie JSON export.
  - Limitations: it does not generate Luau scripting or Layout; feather effects are not rendered in the preview.
  - Licence: "free for personal and commercial use" but "not open source" (no modification or redistribution). It is not affiliated with Rive, Inc. 25 stars.
  
  — [ODU33104/rive-mcp](https://github.com/ODU33104/rive-mcp)
- **Other headless renderers:**
  - breakawaydata/rive-render is a headless Rive renderer shipped as a C++ CLI with a TypeScript/Node API, exporting MP4/WebM via ffmpeg. — [breakawaydata/rive-render](https://github.com/breakawaydata/rive-render)
  - covector/rive-png-renderer is a browser tool exporting PNG sequences and MP4, "Temporary Replacement for Cloud Render". — [covector/rive-png-renderer](https://github.com/covector/rive-png-renderer)

### Inferences
- **Deterministic rendering:** with the low-level `canvas-advanced` runtime the agent owns the render loop. It can call `stateMachine.advance(dt)` / `artboard.advance(dt)` with a fixed dt = 1/fps and then draw. This is from my knowledge of the Rive low-level API; not re-verified.
- **Why Rive is rarely worth it here:** Rive's strengths are interactivity and state machines, which are irrelevant for linear video. Its proprietary binary format and editor-centric authoring make it a poor primary format for an agent. Use it only if the user supplies .riv character rigs (for example, lip-sync-capable characters with mouth-shape inputs driven from narration timing).
- The "Cloud Render" wording in covector's repo suggests Rive once offered (or plans) a cloud video render. I could not verify this.

### Gaps
- I could not confirm whether the Rive Editor currently offers native MP4 export, or the status of Rive "Cloud Render".
- I found no official Rive docs on headless or Node rendering.

---

## Q5. Theatre.js and Spline

### Takeaway
Theatre.js has a visual sequence editor (studio, AGPL) plus core (Apache-2.0) with seekable `sequence.position`. However, its npm release stalled at 0.7.2 in May 2024, development reportedly moved private, and the long-promised 1.0 has not visibly shipped. Flag it as risky or unmaintained for new work. I found nothing on Spline beyond it being a 3D web design tool, and it is outside 2D scope.

### Cited Findings
- @theatre/core 0.7.2 was last published 2024-05-19 (Apache-2.0). — [npm @theatre/core](https://registry.npmjs.org/@theatre/core)
- Theatre.js is split into @theatre/core (Apache 2.0) and @theatre/studio (AGPL 3.0). A repo mirror says the team moved development to a private repo and that "Theatre.js 1.0 is around the corner". That statement is undated. An Ecosyste.ms snapshot shows about 10.8K stars and 112 open issues. The npm `theatre` package has about 143 weekly downloads. — [theatre-js/theatre GitHub](https://github.com/theatre-js/theatre); [pointer.click mirror README](https://git.pointer.click/variablelab/theatre/raw/commit/f6b78cd9864890a9ed7f1d58cc77f317f4c6b8d9/README.md); [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Ftheatre-js%2Ftheatre); [socket.dev](https://socket.dev/npm/package/theatre)

### Inferences
- The agent cannot use the Theatre studio GUI meaningfully, though it can hand-write the exported state JSON. Its value for an agent is therefore low compared with GSAP timelines. Setting `sequence.position = t` would make it seekable (API from my knowledge; not verified).
- Spline is a 3D-scene editor with a web runtime. It is out of scope for 2D and not agent-authorable without its GUI.

### Gaps
- I could not confirm whether Theatre.js 1.0 or any 2025–2026 release exists outside npm.
- I did not research Spline (out of core scope; no time budget).

---

## Q6. Kinetic typography, particles, generative art

### Takeaway
For kinetic type, GSAP SplitText (now free) is the most capable option. It handles chars, words and lines with masking, and sequences them on a seekable timeline. Splitting.js (MIT, last release 2024) is a lightweight CSS-variable-based alternative. Variable-font axis animation and SVG text-on-path need no library beyond GSAP or CSS. tsParticles (v4.5.0, Oct 2026, MIT) is actively maintained, but it uses its own loop and needs time virtualization or seeded custom particles for determinism.

### Cited Findings
- GSAP ships SplitText, ScrambleTextPlugin and MotionPathPlugin in the free npm package. — [npm gsap 3.15.0](https://registry.npmjs.org/gsap)
- splitting 1.1.0 was released 2024-05-31 (MIT). — [npm splitting](https://registry.npmjs.org/splitting)
- @tsparticles/engine 4.5.0 was released 2026-10-25 (MIT). — [npm @tsparticles/engine](https://registry.npmjs.org/@tsparticles/engine)
- rive-mcp supports "text on a path" in generated .riv. — [ODU33104/rive-mcp](https://github.com/ODU33104/rive-mcp)
- A practitioner newsletter documents Claude-written motion-graphics prompts that rendered, broke and were fixed, i.e. evidence of an iterative agent workflow. — [roo.beehiiv.com: Claude Motion Graphics Prompts](https://roo.beehiiv.com/p/claude-motion-graphics-prompts)

### Inferences
- **Kinetic-type recipe:**
  - Split headline lines into words with SplitText.
  - Stagger y/opacity/rotation/scale from a mask (`overflow:hidden` per line) to get the "rise from mask" look.
  - Keyword emphasis: colour swap, highlight-bar scaleX, scramble-text reveal, per-char wave via stagger with `ease: sine`.
  - Animate `font-variation-settings` (`wght`/`wdth`) with GSAP or CSS for weight pulses.
  - Use MotionPath or SVG `<textPath>` with animated `startOffset` for text on a path.
  - Sync word reveals to narration by putting word timestamps from the TTS/ASR into the GSAP timeline as labels.
- **9:16 constraints:** use a fixed 1080×1920 stage (set the Playwright viewport to that size with deviceScaleFactor 1, or 2 and then downscale for crisper text). Load fonts with `document.fonts.ready` before capture to avoid fallback-font frames.
- **Particles and generative art:** for determinism, prefer custom particle systems with a seeded PRNG (e.g., mulberry32) and stateless position = f(seed, t). Simulated systems that integrate over steps must step with fixed dt from 0 to t, so cache states and step forward sequentially rather than seeking randomly. Simplex/Perlin noise (p5 `noise()`, `simplex-noise`) is deterministic given a seed.

### Gaps
- I did not verify current SplitText 3.13+ feature specifics (autoSplit, mask option) from gsap.com (blocked).
- I found no Codrops tutorials in this session (budget). Kinetic-type technique notes above are from my own knowledge, not cited.

---

## Q7. Making it deterministic for frame capture (seek per frame, virtual time, timecut/timesnap, HyperFrames, Playwright clock)

### Takeaway
There are two approaches:
1. **Explicit seeking (preferred):** every animation is paused and set to time t per frame (GSAP `seek`, WAAPI `currentTime`, lottie `goToAndStop`, Rive `advance(dt)`, canvas `render(t)`), then a screenshot or canvas readback goes to ffmpeg.
2. **Virtual time:** override `Date`, `performance.now`, `requestAnimationFrame`, timers and CSS/WAAPI/SVG/video clocks so unmodified pages advance exactly 1/fps per capture. timeweb/timesnap/timecut do this but are stale (2022–2023). Chrome's CDP virtual-time and BeginFrame control are experimental.

HyperFrames (Apache-2.0, published 2026-10-31) is the current agent-oriented packaging of approach 1 with adapters for GSAP, CSS, Lottie, Three.js, anime.js and WAAPI.

### Cited Findings
- timesnap "uses timeweb and puppeteer to open a web page, overwrite its time-handling functions, and record snapshots at virtual times", capturing slower than real time but smooth in output. timecut adds ffmpeg encoding to video. — [tungs/timesnap](https://github.com/tungs/timesnap); [tungs/timecut](https://github.com/tungs/timecut)
- timeweb overrides `performance.now()`, `Date.now()`, `new Date()`, `Date()`, `requestAnimationFrame` / `cancelAnimationFrame`, `setTimeout` / `setInterval` / clears, CSS transitions and animations, SVG animations, videos, `element.animate()` and `CustomEvent` timeStamp. Known not to work: iframes, `event.timeStamp` and audio analyser nodes. — [tungs/timeweb](https://github.com/tungs/timeweb)
- npm dates: timecut and timesnap 0.3.3 (2022-04-03), timeweb 0.3.2 (2023-05-01), all BSD-3-Clause. — [npm registry](https://registry.npmjs.org/timecut)
- A Chromium headless-dev thread says virtual time combined with manual rendering (BeginFrame) mode can render animations at a custom deterministic frame rate, but calls it experimental. — [Chromium headless-dev group](https://groups.google.com/a/chromium.org/g/headless-dev/c/s8ttGCh8jzM)
- HyperFrames:
  - Renders HTML compositions by seeking each frame in headless Chrome and encoding with FFmpeg ("same input → same output"). `@hyperframes/engine` is a "Seekable page-to-video capture engine using Puppeteer and FFmpeg", and `@hyperframes/producer` handles capture, encoding and audio mixing.
  - Runs locally, in Docker, or via AWS Lambda. Requires Node 22+ and FFmpeg. Apache-2.0 with no per-render fees.
  - The GitHub page shows about 76.3k stars, which I could not cross-check.
  
  — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); [npm hyperframes 0.8.223](https://registry.npmjs.org/hyperframes)
- A secondary source says HyperFrames seeks "using Chrome's HeadlessExperimental.beginFrame API". The README I fetched did not mention beginFrame. — [themenonlab blog](https://themenonlab.blog/blog/hyperframes-claude-code-writes-renders-videos); not confirmed by [hyperframes README](https://github.com/heygen-com/hyperframes)
- HyperFrames installs as Claude Code skills (`npx skills add heygen-com/hyperframes`, giving `/hyperframes`, `/hyperframes-cli` and `/gsap`). The workflow is `npx hyperframes init`, then `preview`, then `render`. It is listed in the Claude plugin marketplace. — [themenonlab blog](https://themenonlab.blog/blog/hyperframes-claude-code-writes-renders-videos); [Claude marketplace: hyperframes](https://claude.com/marketplace/plugins/hyperframes)
- html5-animation-video-renderer opens a headless browser and "calls seekToFrame(frameNumber) for each frame of your animation". This is the same explicit-seek contract. — [npm html5-animation-video-renderer](https://npmjs.com/package/html5-animation-video-renderer)
- Remotion (React-based; 4.0.539, 2026-10-26) is the main alternative. Its licence is free for individuals and companies of up to 3 people; larger companies need a paid Company License. — [Remotion pricing docs](https://www.remotion.dev/docs/license/pricing); [Remotion license FAQ](https://www.remotion.dev/docs/license/faq); [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)

### Inferences
- **A robust DIY Playwright recipe** (the API names are standard but I did not re-verify them this session because playwright.dev was blocked):
  1. Launch Chromium with a 1080×1920 viewport.
  2. Expose `window.renderFrame(t)` in the page. It seeks every timeline: `gsapMaster.seek(t)`, `document.getAnimations().forEach(a=>{a.pause();a.currentTime=t*1000})`, `lottieAnim.goToAndStop(t*fr, true)`, and for canvas libraries a manual render.
  3. `await page.evaluate(t => renderFrame(t))`, then wait for two rAFs or `document.fonts.ready`.
  4. Take `page.screenshot({type:'png'})` or a canvas `toDataURL`, and pipe it to `ffmpeg -f image2pipe -framerate 30 -i - -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4`.
  5. Mux narration audio afterwards with ffmpeg.
- **Playwright's clock API** (`page.clock.install()` / `pauseAt` / `runFor`) fakes `Date`, timers and (I believe) rAF. It is lighter than timeweb but does **not** control CSS animations or WAAPI. Combine it with `document.getAnimations()` seeking. Unverified this session.
- **Determinism hazards:**
  - `Math.random` (seed it or override it)
  - web fonts loading late
  - images and video decode timing (await `decode()`)
  - GPU vs SwiftShader rasterization differences (pin the Chromium version and flags)
  - CSS transitions triggered by class changes (prefer explicit timelines)
  - video elements (seek `currentTime` and await `seeked`)
  - frame-rate mismatches between Lottie `fr` and the output fps
- **Speed:** screenshot-per-frame runs at roughly a few to tens of frames per second. A 60 s 30 fps short is 1,800 frames, which takes minutes, not hours, so it is acceptable. Rough expectation, not measured.
- **Recommendation:** for a new pipeline, use HyperFrames (agent-native, Apache-2.0, GSAP-first, active) or a thin custom Playwright seek-and-capture script. Remotion is a strong alternative but carries a company licence above 3 people. Use timecut/timesnap only for legacy pages that cannot be refactored to expose a seek function.

### Gaps
- I could not verify the Playwright clock API's exact coverage (playwright.dev blocked).
- I did not confirm whether HyperFrames uses BeginFrame or plain screenshots (sources conflict or are silent).
- I did not benchmark capture speed in this container.

---

## Q8. Strengths and limits for an agent that cannot watch in real time but can screenshot frames

### Takeaway
Code-first, seekable timelines suit an agent well. Because any time t can be rendered on demand, the agent can sample keyframes (for example, every 0.5 s plus every scene boundary) as PNGs and inspect them for layout, overflow, legibility and collisions, which substitutes for watching. Weak spots are motion *quality* (easing feel, pacing, jitter, flicker), which stills cannot show, and binary or GUI-authored formats (.riv, AE-made Lottie, Theatre studio).

### Cited Findings
- HyperFrames is positioned as "Write HTML. Render video. Built for agents", with a live `preview` command and deterministic render. — [Pyasapanchi/hyperframes-claude-video-editor](https://github.com/Pyasapanchi/hyperframes-claude-video-editor); [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- A practitioner post documents Claude motion-graphics prompts that "rendered, broke and fixed", i.e. failures were found only after rendering and inspecting. — [roo.beehiiv.com](https://roo.beehiiv.com/p/claude-motion-graphics-prompts)
- The OmniLottie authors note that LLMs emitting raw Lottie JSON directly have low success rates because of the strict format. — [arXiv 2603.02138](https://arxiv.org/pdf/2603.02138)
- rive-mcp lists "screenshot detection is sensitive to small pixel changes" as a limitation of its visual-diff loop. — [ODU33104/rive-mcp](https://github.com/ODU33104/rive-mcp)

### Inferences
- **Agent QA loop:**
  1. Render contact sheets of N frames tiled into one image with ffmpeg `tile` (`ffmpeg -i out.mp4 -vf "fps=2,scale=270:-1,tile=6x4" sheet.png`) to see pacing at a glance.
  2. Render specific t values around transitions to check for overlaps.
  3. Use frame-difference metrics (ffmpeg `select='gt(scene,0.x)'` or pixel diffs) to detect unwanted jumps or flicker.
  4. Check text bounding boxes programmatically via `getBoundingClientRect` against the 9:16 safe areas (avoid the top and bottom UI overlays on TikTok/Reels/Shorts).
- **Ranking for this use case** (narrated 9:16 lessons, kinetic type, illustrated scenes):
  1. HTML/SVG + GSAP (SplitText, DrawSVG, MorphSVG, MotionPath) via HyperFrames or a custom Playwright capture.
  2. Lottie assets (dotlottie-web `setFrame`) for icons and characters.
  3. Canvas libraries (Pixi for effects or particles, Rough.js for a hand-drawn look, Zdog for pseudo-3D icons, p5 for generative backgrounds) driven from the same clock.
  4. Rive only for supplied rigs.
  5. Theatre.js: avoid (stalled).
- **Prefer SVG/DOM over canvas when possible.** The agent can then query geometry, the DOM is inspectable for debugging, and text stays crisp and accessible for layout checks.

### Gaps
- I found no published studies or benchmarks comparing LLM success rates across these libraries (e.g., GSAP versus anime.js versus Lottie authoring). The ranking above is reasoned, not measured.
