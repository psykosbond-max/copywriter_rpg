# 3D, shader and character-animation pipelines an agent can drive on CPU (as of 2026-10-31)

Scope: what Claude Code can script inside a Linux container that has Python, Node, headless Chromium (WebGL via SwiftShader), ffmpeg and Blender 5.x as the `bpy` Python module, **no GPU**, to render motion graphics to MP4 for 9:16 narrated social lesson videos with recurring characters.

**Method note.** Besides web research, I ran **local benchmarks in this container on 2026-10-31**. Machine: 4 vCPU, 15 GB RAM, no GPU. Software: `bpy` 5.2.3 LTS (pip wheel `bpy-5.2.3-cp313-cp313-manylinux_2_28_x86_64.whl`, 403 MB, Python 3.13), Mesa llvmpipe (LLVM 20.1.2), and Playwright's Chrome Headless Shell 156.0.8078.4. All renders were 1080x1920 (9:16) unless stated. These runs are cited as "[Local test]". They are small test scenes, so treat the numbers as rough figures, not production benchmarks.

---

## 1. three.js / React Three Fiber / Babylon.js / PlayCanvas: toon shading, outlines, post-processing, headless frame-by-frame rendering, SwiftShader performance

### Takeaway
three.js in headless Chromium works for toon and cel 3D on CPU and runs fast enough for daily lesson videos. A toon scene with outlines rendered at about 60–70 ms per 1080x1920 frame when Chromium's ANGLE used Mesa llvmpipe through EGL. With the default SwiftShader it took about 140–180 ms. Full-screen post-processing passes such as `HalftonePass` are the bottleneck: 0.8 s per frame on llvmpipe and 4.2 s on SwiftShader. Pick the GL backend deliberately, and write halftone and grain as cheap custom shaders.

### Cited Findings
- **[Local test] three.js toon benchmark.** The scene had 42 meshes using `MeshToonMaterial` with a 3-step `gradientMap` (NearestFilter), ambient plus directional light, at 1080x1920. Each frame was read back with `canvas.toDataURL('image/png')`. Times are averages over 20 frames after a warm-up frame:
  - `--use-angle=swiftshader --enable-unsafe-swiftshader` reported the renderer "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))". Results: plain 142 ms/frame, `OutlineEffect` 180 ms/frame, `EffectComposer` + `HalftonePass` 4,226 ms/frame.
  - `--use-angle=gl-egl --use-gl=angle --ignore-gpu-blocklist` reported "ANGLE (Mesa, llvmpipe (LLVM 20.1.2 256 bits), OpenGL ES 3.2)". Results: plain 60 ms, outline 66 ms, halftone 762 ms. This path only worked after installing the Mesa EGL packages (`libegl1 libegl-mesa0 libgl1-mesa-dri libgbm1`).
  - At those rates, a 60-second clip at 30 fps (1,800 frames) takes about 2 minutes with toon and outlines on llvmpipe, about 5.4 minutes on SwiftShader, and over 2 hours with the stock HalftonePass on SwiftShader.
- An independent benchmark points the same way. On GPU-less servers, Chrome's default software path took about 24 s per 3D page, versus about 6 s with ANGLE pointed at Mesa llvmpipe. The same post says `--disable-gpu` silently forces SwiftShader back on. — [microlink.io blog via search summary](https://microlink.io/blog/webgl-without-a-gpu). The page itself could not be fetched because the domain is blocked by the session network policy.
- Remotion's renderer exposes the GL backend as a choice: `swiftshader`, `swangle` or `angle-egl`. Its Lambda default is `swangle`. — [Remotion renderFrames docs](https://remotion.dev/docs/render-frames)
- One three.js forum user found that reading pixels back was the main bottleneck when rendering frames server-side. — [three.js forum](https://discourse.threejs.org/t/server-side-render-and-get-pixel-data-fast/26784)
- Another user found three.js rendered black on headless Chromium with GPU flags but worked with SwiftShader. — [three.js forum](https://discourse.threejs.org/t/running-threejs-on-headless-chromium-using-gpu/18080)
- SwiftShader is a CPU rasterizer. One guide says that rarely matters for screenshots, but smooth video of complex scenes benefits from hardware. — [agent-browser.dev](https://agent-browser.dev/webgpu)
- three.js ships an `OutlineEffect` add-on for toon outlines that works only with `WebGLRenderer`. The WebGPU-renderer equivalent is `ToonOutlinePassNode`. Only objects using `MeshToonMaterial` or `MeshToonNodeMaterial` receive the outline. — [threejs.org OutlineEffect docs](https://threejs.org/docs/pages/OutlineEffect.html); [unpkg three@0.182 ToonOutlinePassNode.js](https://app.unpkg.com/three@0.182.0/files/src/nodes/display/ToonOutlinePassNode.js)
- Forum advice is to use `OutlineEffect` for permanent toon outlines. The `OutlinePass` post-process is mainly meant for highlighting objects on interaction. — [three.js forum "Rendering Style"](https://discourse.threejs.org/t/rendering-style/12593.md)
- The built-in three.js add-ons include `HalftonePass` (dot pattern with radius and shape parameters) and `DotScreenPass`. — [search summary of three.js post-processing skill pages](https://skills.sh/openaec-foundation/three.js-claude-skill-package/threejs-impl-post-processing)
- `pmndrs/postprocessing` merges effects into a single pass, which suits performance-critical and R3F apps. Do not mix its `EffectComposer` with three's built-in one, because their buffer formats are incompatible. — [skills.sh three.js post-processing package](https://skills.sh/openaec-foundation/three.js-claude-skill-package/threejs-impl-post-processing). This is a secondary source; I did not verify a pmndrs halftone effect.
- Gaussian splats can be mixed into three.js scenes with **Spark** (World Labs, MIT licence, npm `@sparkjsdev/spark`, needs three r180+). It reads PLY, SPZ, SPLAT, KSPLAT and SOG files, and `SplatMesh` behaves like a normal `Object3D`. Spark 2.0 (14 April 2026) added streamable level of detail. — [sparkjs.dev](https://sparkjs.dev/); [GitHub sparkjsdev/spark](https://github.com/sparkjsdev/spark); [radiancefields.com](https://radiancefields.com/platforms/spark)

### Inferences
- **Recommended web-3D recipe.** Launch Chromium with `--use-angle=gl-egl --use-gl=angle` and the Mesa EGL libraries installed. Use `preserveDrawingBuffer: true`, drive every animation from the frame number (`t = frame/fps`) instead of the wall clock, capture each frame, and pipe the frames to ffmpeg. Remotion's `<ThreeCanvas>` (or R3F inside Remotion) does the same thing with less custom code.
- **Effect costs.** Toon materials and inverted-hull outlines are nearly free. Full-screen passes cost per pixel. Write halftone, Ben-Day dots, grain and chromatic aberration as **one fused custom ShaderPass** (or one pmndrs `EffectPass`), not a chain of stock passes.
- **Cheaper rendering options.** Render at 720x1280 and upscale with ffmpeg for a further roughly 2x saving. A stylised look tolerates rendering at 15 fps or "on twos" (holding each drawing for two frames).
- **Babylon.js and PlayCanvas.** These are viable in the same headless-Chromium harness, since they are also WebGL engines. I found no 2026 benchmarks for them on SwiftShader or llvmpipe. three.js plus R3F has by far the largest body of examples an LLM has seen, which matters when an agent writes the code. This is unverified background knowledge.

### Gaps
- No primary-source benchmarks for Babylon.js or PlayCanvas on CPU WebGL. I found no confirmation of a pmndrs `HalftoneEffect` or `ChromaticAberrationEffect` in the current pmndrs docs; background knowledge says ChromaticAberration exists in pmndrs/postprocessing, but this is unverified.
- I did not test the WebGPU renderer on CPU, or whether Chromium's WebGPU falls back to SwiftShader-Vulkan headlessly.
- I did not verify the halftone output visually at full resolution.

---

## 2. Blender via bpy: Cycles vs EEVEE headless on CPU, Grease Pencil, geometry nodes, NPR styles, character add-ons, animation and asset sources

### Takeaway
**EEVEE does run headless without a GPU in 2026.** In this container, `bpy` 5.2.3 LTS rendered EEVEE frames through Mesa llvmpipe via EGL once the Mesa EGL libraries were installed, with no X server, Xvfb or GPU. Without `libEGL.so.1`, EEVEE fails to start. That contradicts a 2026 render-farm article claiming EEVEE-Next cannot run headless. On 4 cores, EEVEE at 1–4 samples costs about 2–5 s per 1080x1920 frame, Workbench about 0.9 s, and Cycles CPU at 16 samples with denoising about 24–47 s. For a lesson pipeline, EEVEE at low samples (or Workbench) with toon or NPR shading is the practical Blender path. Cycles is only for short hero shots.

### Cited Findings
- **[Local test] Blender `bpy` 5.2.3 LTS, headless, 4 vCPU, 1080x1920.** Times are seconds per frame for frames 1–4; the first frame includes shader compilation.
  - Before Mesa was installed, EEVEE and Workbench both failed: "Couldn't open libEGL.so.1".
  - After `apt-get install libegl1 libegl-mesa0 libgl1-mesa-dri libgbm1`, EEVEE rendered. It printed harmless `EGL_BAD_MATCH` warnings.

  | Engine and settings | Resolution | s/frame (frames 1–4) |
  |---|---|---|
  | Workbench, flat lighting, object outline | 1080x1920 | 1.40, 0.91, 0.85, 0.86 |
  | EEVEE, 1 TAA sample | 540x960 | 2.70, 1.49, 1.53, 1.46 |
  | EEVEE, 1 sample, Freestyle on | 1080x1920 | 3.08, 2.14, 2.36, 1.85 |
  | EEVEE, 1 sample, plus a Grease Pencil "Line Art (scene)" object | 1080x1920 | 5.79, 4.03, 3.37, 3.29 |
  | EEVEE, 4 samples | 1080x1920 | 11.65, 5.36, 5.34, 5.94 |
  | EEVEE, 16 samples | 1080x1920 | 20.61, 18.52, 17.75, 16.79 |
  | EEVEE, default samples (cold, single frame) | 1080x1920 | 83.3 |
  | Cycles CPU, 16 samples, denoising on | 1080x1920 | 24.4, 23.9, 35.5, 47.3 |

  - The later Cycles frames were slowed by a concurrent Chromium job.
  - The Freestyle run logged "strokes set empty". Because the test world was black, I could not visually confirm the Freestyle or Line Art lines, so treat those two rows as timing only.
  - Implied cost for a 60 s, 30 fps video (1,800 frames): Workbench about 27 min, EEVEE 1-sample about 1 h, EEVEE 4-sample about 2.7 h, Cycles 16-sample about 12–24 h.
- **Contrary claim.** An October 2026 render-farm sales article says modern EEVEE-Next cannot run as a command-line binary on headless cloud instances. — [iRender, 9 Oct 2026](https://irendering.net/eevee-next-headless-dilemma-cloud-render-farm-guide/). The local test contradicts it for the Mesa/EGL software path. It may still hold for images without Mesa EGL.
- **History.** In the 2.8 era, Blender developers said headless EEVEE was unsupported and a display was needed, because EEVEE is OpenGL-based and headless EGL was not production ready. Xvfb worked but was slow. Cycles rendered fine with no GPU and no X server. — [Blender devtalk (EEVEE)](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436); [Blender devtalk (Cycles)](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-cycles/8607)
- **Gotcha.** Passing `-E CYCLES` only sets the engine on the current scene. Other scenes in the file left on EEVEE can still trigger an EEVEE context. — [Blender devtalk](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-cycles/8607)
- A 2026 programmatic-rendering tutorial recommends EEVEE (`scene.render.engine = "BLENDER_EEVEE"`) for automated work. — [CGWire blog 2026](https://blog.cg-wire.com/blender-programmatic-rendering/)
- A ComfyUI headless-`bpy` project lists an NVIDIA GPU as a requirement but notes that EEVEE falls back to CPU without one. — [GitHub ComfyUI-BpyScenes](https://github.com/UnlimitedEditing/ComfyUI-BpyScenes)
- **Release timing.** Blender 5.0 shipped in November 2025 and Blender 5.1 on 17 March 2026. — [OSArch](https://osarch.org/2025/11/18/blender-5-0-released/); [Blender 5.1 release page (mirror)](https://hn.jakechampion.name/reader/https://www.blender.org/download/releases/5-1). Version 5.2.3 LTS is the current `bpy` wheel on PyPI ([Local test]).
- **Grease Pencil in 5.0.** Rendering gained motion blur (a "Motion Blur Steps" setting). When Grease Pencil is composited behind meshes, that compositing ignores motion blur on the current frame. A new Join Strokes mode became the default. — [Blender 5.0 release notes: Grease Pencil](https://developer.blender.org/docs/release_notes/5.0/grease_pencil/)
- **Grease Pencil in 5.1.** A new fill workflow lets you fill strokes with operators and tool settings instead of assigning materials, and the draw brush has a Stroke/Fill/Both option. Long strokes draw faster. Geometry Nodes text-to-fill setups now need a `fill_id` attribute. Lattice parenting is restored. — [Blender 5.1 release notes: Grease Pencil](https://developer.blender.org/docs/release_notes/5.1/grease_pencil/). For agents, this makes scripted GP fills from Python or Geometry Nodes simpler.
- **NPR in 5.1.** The 5.1 release page describes a new feature enabling "NPR stylization integrated with scene shading", limited to screen-space tracing in EEVEE. EEVEE materials also compile faster, with GPU pipelines precompiled in parallel, and use less texture memory. — [Blender 5.1 release page (mirror)](https://hn.jakechampion.name/reader/https://www.blender.org/download/releases/5-1). The roadmap said NPR was prototyped in 2024–25 and is now ready for development. — [Blender "Projects to look forward to in 2026" (mirror)](https://hn.jakechampion.name/reader/https://www.blender.org/development/projects-to-look-forward-to-in-2026). This is a single source, and I could not confirm the exact feature name.
- **MPFB 2** (MakeHuman for Blender, a Blender Extension) has GPLv3 code and CC0 bundled assets. CG Channel reports that content made with it is CC0 and can be used commercially. — [extensions.blender.org MPFB](https://extensions.blender.org/add-ons/mpfb/); [CG Channel, Mar 2025](https://www.cgchannel.com/2025/03/check-out-open-source-blender-character-generation-plugin-mpfb-2). A Unity-forum poster calls the output wording ambiguous. — [Unity discussions](https://discussions.unity.com/t/makehuman-license/639763)
- **Mixamo.** It still works and is free with an Adobe ID as of mid-2026, but is not maintained. It is royalty-free for commercial use and auto-rigs bipedal humanoids in T-pose only. The backend briefly broke for everyone in June 2025, and it is unavailable to Enterprise/Federated IDs and China country codes. — [Cinevva guide (Jul 2026)](https://app.cinevva.com/guides/free-character-animations-rigging); [Sorceress blog](https://sorceress.games/blog/replace-the-mixamo-auto-rig-browser-no-adobe-id). Both are vendor and secondary sources.
- **Mixamo has no API.** Downloads are manual through the web UI. Adobe's Blender add-on targeted Blender 3.6, and a community replacement on Blender Extensions lists Blender 4.2 LTS. — [Cinevva Mixamo-to-Blender 2026](https://app.cinevva.com/guides/mixamo-to-blender-2026)
- **Quaternius Universal Animation Library.** Version 1 has 120+ animations on one universal humanoid rig. Version 2 has 130+, with a free standard version (about 70%) and a paid source version that includes the .blend. Both are CC0, compatible with the "Universal Base Characters" pack, and free for commercial use. — [quaternius.com UAL](https://quaternius.com/packs/universalanimationlibrary.html); [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html); [Digital Production, Feb 2026](https://digitalproduction.com/2026/02/10/130-animations-one-rig-zero-drama/)
- **Kenney** character packs are CC0, and attribution is not mandatory. — [OpenGameArt "blocky characters"](https://opengameart.org/content/blocky-characters)
- **Poly Pizza** has over 10,600 low-poly models. Licensing is set per model, so check each one; CC BY-NC models cannot be used in commercial work. — [Cinevva rigged-characters guide](https://app.cinevva.com/tr/guides/free-rigged-3d-character-models) (secondary source)
- **Ready Player Me is dead.** Netflix acquired it on 19 December 2025, and the public service and SDK shut down on 31 January 2026 (one blog says 30 January). Avatars could not be exported or migrated. — [PocketGamer.biz](https://www.pocketgamer.biz/netflix-acquires-avatar-creation-platform-ready-player-me); [Genies blog](https://genies.com/blog/ready-player-me-shutdown)
- **Reallusion AccuRIG 2.0** is a free auto-rigger. Exporting requires a free ActorCore account. Reallusion says the software can be used commercially, but the rigged model keeps its own licence. ActorCore motions browsed inside AccuRIG can only be used there, and most of the 4,500+ motions are paid. It is a Windows desktop app, so not headless in a Linux container. — [CG Channel, Jul 2025](https://www.cgchannel.com/2025/07/rig-and-animate-3d-characters-for-free-with-accurig-2-0/); [Reallusion forum](https://forum.reallusion.com/551972/reallusion-Accu-Rig-Free); [SourceForge listing ("Windows tool")](https://sourceforge.net/app/accurig/)
- **Blender MCP** (ahujasid) lets Claude operate Blender: create objects, set materials, inspect the scene and run Python. It does not generate meshes itself. Its Hyper3D Rodin integration suits single items and has a daily trial limit. Reviewers say lighting and composition judgment still needs a human. — [GitHub blender-mcp](https://github.com/mikeysrecipes/blender-mcp); [yuv.ai](https://yuv.ai/blog/blender-mcp); [3D AI Studio](https://www.3daistudio.com/3d-generator-ai-comparison-alternatives-guide/blender-mcp)

### Inferences
- **Recommended Blender recipe for an agent.**
  - Install the pip `bpy` wheel matching the Python version (5.2.x LTS for cp313 here) and `apt install libegl1 libegl-mesa0 libgl1-mesa-dri libgbm1`.
  - Set `scene.render.engine='BLENDER_EEVEE'` and `scene.eevee.taa_render_samples` to 1–4. Toon look: a Shader-to-RGB node into a ColorRamp set to "Constant" interpolation.
  - Outlines: a Solidify modifier with flipped normals (inverted hull), or Grease Pencil Line Art (measured at roughly +1.5 s/frame).
  - Render PNG frames, then encode with ffmpeg.
  - Pre-compile shaders on a warm-up frame and render many frames per process, because the first frame costs 2–15x more.
  - Split frame ranges across processes only if you have more than 4 cores; llvmpipe already multithreads.
- **Workbench** (about 0.9 s/frame) is very cheap and gives a flat, clay-like or matcap look with object outlines. It is good for previews and some clean motion-graphics styles.
- **Style feasibility on CPU in Blender:**
  - Flat or cel toon: EEVEE, 1–4 samples.
  - Claymation look: subdivided meshes with noise-displacement "thumbprints", soft lighting, rendered on twos.
  - Stop-motion look: hold each pose for 2 frames, add slight per-frame jitter of camera and lights.
  - Halftone or Ben-Day dots: screen-space dots via a shader or compositor.
  - Painterly: Grease Pencil strokes or brush-texture shaders.

  All are achievable in EEVEE. Cycles is too slow for minute-long videos on 4 cores. These are inferences from the timing data; the style recipes are background knowledge.
- **Recurring characters.** The most reliable route is one rigged base character, either Quaternius Universal Base Characters (CC0) or an MPFB character (CC0 output), driven by the Quaternius UAL CC0 clips on the same rig. Avoid Mixamo for automation: it has no API, needs a human login, and is unmaintained. Do not plan on Ready Player Me.
- **Agent fit.** Blender via `bpy` is fully scriptable. The weak point is aesthetic judgment, so the agent should render low-res stills and inspect them (render, look, adjust) before committing to a full render.

### Gaps
- I did not confirm Auto-Rig Pro (paid add-on) or Human Generator (paid add-on) licence terms and 2026 status, nor Rigify's Blender 5.x status. Background knowledge says Rigify ships with Blender; unverified.
- I did not fetch the CMU mocap database licence or Sketchfab licence terms. Background knowledge: CMU data is free to use, Sketchfab is per-model with CC licences plus a Standard/Editorial store licence. Both unverified; confirm before use.
- No source for Blender geometry-nodes motion-graphics render costs. Geometry nodes are evaluated per frame on CPU anyway, so they are probably cheap relative to shading; untested.
- I did not visually verify Freestyle or Line Art lines in the headless render, though both ran without crashing.

---

## 3. GLSL and shader art: Shadertoy-style fragment shaders, glslViewer, ISF, noise/liquid/gradient backgrounds, SDF text

### Takeaway
Fragment shaders are the cheapest way to get rich animated backgrounds (noise, liquid, gradient mesh, grain) on CPU. The two main routes are a three.js `ShaderMaterial` full-screen quad in headless Chromium, or glslViewer `--headless` with a fixed time per frame. Cost scales with per-pixel maths: the stock HalftonePass alone took 0.76 s per 1080x1920 frame on llvmpipe, so keep background shaders simple or render them at lower resolution and upscale.

### Cited Findings
- glslViewer can record directly to video headlessly, for example `glslViewer input.frag -w 1920 -h 1920 --nocursor --headless -E record,output.mp4,0,24,60`, then recompress with ffmpeg. — [GitHub gist (devloop01)](https://Gist.github.com/devloop01)
- glslViewer can also export frame sequences (`--headless --fps 60 -E sequence,0,60`). For non-choppy motion, render each frame separately by setting the `u_time` uniform per frame (a bash loop, or OSC commands) instead of real-time capture. — [r/shaders thread (via Redlib)](https://redlib.hbubli.cc/r/shaders/comments/1kgcya4/shader_render_with_choppy_motion/mqxsq4l/?context=3)
- **ghee** is a Shadertoy-style GLSL renderer that writes raw frames to stdout for piping into ffmpeg. Its `--timestep` pins engine time to frame x S, making renders reproducible. — [PyPI ghee-render](https://pypi.org/project/ghee-render/0.2.0/)
- Shadertoy shaders use Shadertoy-specific uniforms (`iTime`, `iResolution`, channels), so they need light adapting to run in glslViewer or three.js. — [search summary of glslViewer workflows](https://Gist.github.com/devloop01)
- [Local test] A full-screen post shader on llvmpipe costs hundreds of ms per 1080x1920 frame (HalftonePass, 762 ms). SwiftShader is about 5x slower (4.2 s).

### Inferences
- **For the agent**, the simplest path reuses the headless-Chromium harness: a `ShaderMaterial` on a full-screen plane, with `uTime = frame/fps`. glslViewer is lighter but must be built or installed and needs EGL/Mesa as well. This is untested here.
- **Shadertoy licensing.** Shadertoy shaders default to CC BY-NC-SA 3.0 unless the author states otherwise (background knowledge, unverified). An agent should write its own shaders: fbm/simplex noise, domain warping for liquid, 4-point gradient mesh, film grain. Do not copy Shadertoy code into commercial videos.
- **SDF text.** troika-three-text (three.js) or msdf fonts give crisp animated text in 3D. Unverified in this research; most lesson-video text is better done in the 2D layer (HTML/CSS/Remotion), with the 3D or shader layer composited behind it.

### Gaps
- No primary ISF (Interactive Shader Format) headless renderer found. ISF is mostly VDMX/Videosync-centric. Not researched further.
- glslViewer's current (2026) build requirements and EGL headless support on llvmpipe were not verified.
- No primary-source check of Shadertoy's default licence.

---

## 4. 2D character animation by code: SVG rigs + GSAP, Spine, DragonBones, Rive, Live2D, Moho/Toon Boom, cut-out animation, Rhubarb lip sync, auto-blinks

### Takeaway
For a recurring narrated character, a **2D cut-out puppet** (layered SVG or PNG parts with pivots, driven by GSAP or Remotion timelines) plus **Rhubarb Lip Sync** mouth-shape data is the most agent-friendly, CPU-cheap and licence-clean route. Rive runtimes are MIT but the editor is a GUI. Spine and Live2D need the paid or registered editor and carry runtime licence conditions. DragonBones is effectively abandoned.

### Cited Findings
- **Rhubarb Lip Sync** is a command-line tool for Windows, macOS and Linux. Usage: `rhubarb -o out.txt recording.wav`. It accepts WAV or Ogg Vorbis and outputs TSV, XML or JSON.
  - It uses 6 basic mouth shapes (A–F) plus optional extended G, H and X (the default extended set is GHX; pass `--extendedShapes ""` for the basic 6 only). The last TSV line is always X (closed mouth).
  - Supplying the dialogue text (`--dialogFile`) improves accuracy.
  - Source: [GitHub DanielSWolf/rhubarb-lip-sync](https://github.com/DanielSWolf/rhubarb-lip-sync)
  - I tried to download and test the Linux release locally, but the agent's auto-mode safety check denied running the external binary. Not benchmarked.
- **Spine.** You can integrate the runtimes free of charge, but users of your software must hold their own Spine licence. A valid Spine Editor licence is required when the runtimes are integrated into each product. Trial licences grant no runtime rights. Esoteric says a website using only skeleton data plus runtimes still needs a Spine Editor licence. The editor and runtime licences were updated 5 April 2025. — [spine-runtimes GitHub](https://github.com/EsotericSoftware/spine-runtimes); [Spine Runtimes License](https://raw.github.com/EsotericSoftware/spine-runtimes/master/LICENSE); [Spine Editor License](https://en.esotericsoftware.com/spine-editor-license); [Esoteric forum](https://ar.esotericsoftware.com/forum/d/28670-discussion-on-using-the-spine-runtime-for-commercial-purposes)
- **Spine Essential** suffices below US$500k annual revenue, according to an Esoteric forum reply (not the licence text). — [Esoteric forum](https://ru.esotericsoftware.com/forum/d/17246-license-for-runtimes)
- **Rive.** Official runtimes are open source under MIT, for personal and commercial use. Some features may not be supported on every runtime, or may need the Rive Renderer. — [Rive runtimes docs](https://rive.app/docs/runtimes); [rive.app/runtimes](https://rive.app/runtimes). I found no official headless or offline video-export path; the web runtime in headless Chromium plus frame capture would be the route (inference).
- **Live2D Cubism SDK.** Free to start. A release licence is required only for business entities with annual sales of ¥10 million or more. General users and small-scale enterprises under ¥10M need no contract, except for "Expandable Applications" such as avatar systems. The agreement must be completed at least one month before release. — [Live2D SDK Release License](https://www.live2d.com/en/sdk/license/); [Live2D help](https://help.live2d.com/en/?p=2558). Models still have to be authored in the Cubism Editor GUI.
- **DragonBones** is abandoned. The developer (Egret) has been unresponsive for years and the download link is dead. Community runtimes for Pixi and Godot persist, and it is MIT licensed. — [AlternativeTo](https://alternativeto.net/software/dragonbones/about); [dragonbones-pixijs README](https://app.unpkg.com/dragonbones-pixijs@1.0.5/files/README.md)
- **GSAP is now free**, including formerly paid plugins such as MorphSVG and SplitText, for commercial use under the "no charge" standard licence (effective 30 April 2025, after Webflow's acquisition). The exception: tools that let users build visual animations without code, competing with Webflow, need written permission. — [CodePen blog](https://blog.codepen.io/2025/05/05/chris-corner-gsap-more-like-freesap/); [Webflow forum](https://discourse.webflow.com/t/webflow-makes-gsap-100-free/319967); [npm gsap-trial deprecation](https://npmjs.com/package/gsap-trial)
- **SVG skeletal deformation.** Google's Pose Animator (2020) rigs SVG characters with bones defined in the SVG and deforms Bezier paths with linear blend skinning. The author notes volume thinning at bent joints. — [TensorFlow blog](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html)
- A community "SVG Character Animation" agent skill animates modular SVG rigs with GSAP timelines, stable `svgOrigin` pivots and frame-accurate Remotion control. — [MCP Market listing](https://mcpmarket.com/tools/skills/svg-character-animation). Unverified beyond the listing.

### Inferences
- **Recommended 2D character stack for lesson videos:**
  - A layered SVG character: head, torso, upper and lower arms, hands, 6–9 mouth drawings matching the Rhubarb A–H/X shapes, eye-open, eye-half and eye-closed drawings, and a few brow poses.
  - Rigid parts rotate about pivots (cut-out puppet). Mesh deformation is unnecessary for this style.
  - Rhubarb JSON maps to mouth swaps keyed on frame numbers.
  - Auto-blinks are procedural: a random interval of about 2–6 s, a 3-frame close-half-open sequence, and occasional double blinks.
  - Idle breathing is a sine-wave scale of the torso of about 1–2%. Head bobs accent emphasised words, taken from TTS word timestamps.
  - All of this is deterministic code, which suits Remotion or GSAP-seeked timelines. This is the cheapest path, about as cheap as any DOM render.
- **The same mouth-shape and blink logic works on a 3D character.** Use shape keys on an MPFB or Quaternius head, or texture-swapped mouth decals on a stylised toon head, which is cheaper and more "designed"-looking.
- **Moho and Toon Boom Harmony** both have scripting (Lua and JS/Python respectively; background knowledge), but they are GUI desktop apps with commercial licences, and I found no headless Linux render path. Not suitable for a container agent.
- **Rive and Spine** are only worth it if a human artist authors the rig in the editor. The agent would then just drive state machines or animations.

### Gaps
- No Rhubarb runtime benchmark (blocked locally). Its speed on CPU and its accuracy with TTS voices remain unmeasured.
- I did not verify Rive's current editor pricing or any headless render tool.
- I did not find Moho or Toon Boom command-line render documentation.

---

## 5. Gaussian splats and AI 3D generation (Meshy, Tripo, Hunyuan3D, TRELLIS) as asset sources; AI rigging (Mixamo, AccuRIG)

### Takeaway
AI 3D generators can provide one-off props or a base character mesh, but licences differ a lot. Tripo's free tier is reportedly CC BY 4.0. Meshy's free tier is reportedly non-commercial, with commercial use on paid plans. Hunyuan3D's Tencent licence excludes the EU, UK and South Korea. TRELLIS.2's core is MIT, but its default pipeline uses a non-commercial background remover. Meshy and Tripo include auto-rigging and preset animations, and their cloud APIs suit a CPU-only agent. Running TRELLIS or Hunyuan locally needs a GPU.

### Cited Findings
- **Meshy.** Rigging costs 0 credits per model and animation 0 credits per clip; image-to-3D costs 20 credits (10 on some tiers). Reviews cite 500–600+ animation presets. Commercial use is on paid plans, and the free tier (100 credits per month) is reported as non-commercial. Pricing is roughly $0–90/month, with Pro at $20/month. — [Meshy docs: pricing & credits](https://docs.meshy.ai/en/webapp/pricing); [stork.ai comparison](https://www.stork.ai/compare/meshy-vs-tripo-ai); [costbench](https://costbench.com/compare/meshy-vs-tripo-ai/) (secondary sources, partly conflicting)
- **Tripo AI.** It offers texturing, rigging (beta in one source) and animation, and exports FBX. The free tier (200 credits per month) is reported as CC BY 4.0. Reported plan prices conflict: $9.90, $12 and up to $109.90 per month. — [stork.ai](https://www.stork.ai/compare/tripo-ai-vs-meshy); [3D AI Studio API comparison](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026); [pasqualepillitteri.it review](https://pasqualepillitteri.it/en/news/7811/tripo-ai-review-3d-model-generator)
- **TRELLIS.2 (Microsoft).** The core is MIT licensed. It depends on NVIDIA nvdiffrast and nvdiffrec (NVIDIA Source Code License), and the official pipeline uses RMBG-2.0 (CC BY-NC 4.0) for background removal. — [CGWorld.jp](https://cgworld.jp/flashnews/01-202601-TRELLIS2.html); [3daistudio blog](https://www.3daistudio.com/blog/is-trellis-2-free-pricing-how-to-get-started)
- **Hunyuan3D 2.x (Tencent Community License).** Commercial use is allowed with conditions. The licence does not apply in the EU, UK or South Korea. A separate licence is needed above 1M monthly users, and military use is banned. — [Hunyuan3D-2 GitHub issue](https://github.com/Tencent-Hunyuan/Hunyuan3D-2/issues/6); [creativeainews](https://www.creativeainews.com/articles/best-open-source-ai-3d-models-2026/) (secondary)
- **Mixamo** auto-rigs humanoids only; there is no API and it is unmaintained (see Q2). **AccuRIG** is a free Windows desktop app that needs an ActorCore account to export (see Q2). — sources as in Q2.
- **Gaussian splats** can be rendered in three.js via Spark (MIT; see Q1). — [sparkjs.dev](https://sparkjs.dev/)

### Inferences
- **For a recurring lesson character**, AI-generated meshes are risky: topology and texture vary between generations, so one generated character must be frozen and reused, never regenerated. Low-poly AI output with baked textures looks "asset-store generic". A hand-designed (or agent-coded) stylised character with a consistent palette usually reads as more branded.
- **Licence-safe priority order:**
  1. CC0 kits (Quaternius, Kenney).
  2. MPFB (CC0 output).
  3. Paid Meshy or Tripo outputs (check terms on the vendor's own page).
  4. Avoid Hunyuan3D outputs if the audience or creator is in the EU or UK.
  5. Avoid the default TRELLIS pipeline for commercial use unless RMBG-2.0 is swapped out.
- **Gaussian splats** are photoreal captured scenes. They are heavy to sort and render on CPU (untested) and mismatch an illustrated or toon style. Low fit for lesson explainers.

### Gaps
- Primary vendor licence pages for Meshy and Tripo were not fetched; prices and terms conflict across sources.
- No CPU-only performance data for Spark splat rendering.
- Hyper3D Rodin licence terms were not researched.

---

## 6. Practical lessons: why primitive-built characters look uncanny, and what stylisation makes code-built characters appealing

### Takeaway
Research suggests appeal depends less on realism than on **consistency between shape stylisation and material stylisation**. Mismatches, such as abstract primitive shapes with realistic shading, rate as eerie. A primitive-built character should therefore commit fully to a graphic style (flat or cel shading, bold outlines, limited palette, designed proportions) rather than half-realistic lighting on spheres and capsules.

### Cited Findings
- A TU Dortmund study found the degree of realism is a bad predictor of appeal or eeriness. Appeal, eeriness and attractiveness were mainly driven by the stylisation level of the **material**, not the shape; shape mattered more for perceived realism. — [Zell et al., SIGGRAPH Asia 2015 slides](https://cg.cs.tu-dortmund.de/downloads/publications/2015/sigasia2015-slides.pdf); [paper PDF](https://ls7-gv.cs.tu-dortmund.de/publications/2015-stylize.pdf)
- Strong mismatches between material and shape stylisation made characters unappealing and eerie; abstract shapes with realistic materials were rated especially eerie. — [arXiv 2110.04083](https://arxiv.org/pdf/2110.04083)
- A later thesis likewise concluded that realism is an unreliable predictor of appeal, contrary to the uncanny-valley hypothesis. — [zaguan.unizar.es thesis record](https://zaguan.unizar.es/record/70189?ln=en)
- Design heuristics (not tested findings): circles read as friendly and approachable, squares as stable and sturdy, triangles as dynamic or cunning. — [search summary of shape-language guides](https://linode.nexstar.tv/Download_PDFS/mL9004/604389/Creating%20Stylized%20Characters.pdf) (low-quality mirror; heuristic only)
- [Local test] In my three.js test, a capsule-plus-sphere "character" with 3-tone toon shading read as a clean graphic shape. The same sphere under EEVEE soft shadows read as a neutral 3D primitive. This is my own subjective observation from the render montage.

### Inferences
These are design guidance synthesised from the above plus general animation practice; they are not individually sourced.

- **Why primitive characters look off:**
  - Smooth realistic shading on geometric primitives (the material/shape mismatch above).
  - Mechanical, perfectly symmetric proportions.
  - Dead eyes: no highlights, no blinks, no saccades.
  - Rigid linear motion with no easing, overlap or squash and stretch.
  - Floaty contact with no shadow or grounding.
  - Generic default colours.
- **What makes code-built characters appealing:**
  - Flat or 2–3-tone cel shading with a bold, consistent outline (inverted hull or OutlineEffect).
  - Big head-to-body ratio (about 1:1.5 to 1:2) and large, simple eyes with a specular dot.
  - A limited brand palette.
  - Silhouette-first design with one distinctive feature: hair tuft, glasses, scarf.
  - Squash and stretch on emphasis, eased motion (GSAP ease or Blender F-curves), secondary motion such as antennae or hair lag.
  - Constant subtle life: idle breathing, blinks, eye darts.
  - Lip sync from Rhubarb.
  - Animate on twos for a handmade feel.
  - A contact shadow blob.
  - Grain or halftone texture to unify 3D with 2D graphics.
- **For recurring characters**, define the character as code or data (a parameter file: proportions, palette, outline width, expression library). Every episode then renders identically, and the agent can only vary pose and expression.

### Gaps
- No primary 2025–26 practitioner write-ups (Codrops, Blender Artists) on code-built character appeal were retrieved within the time budget.

---

## 7. Fit for 9:16 narrated social lesson videos with recurring characters: catalogue and recommendation

### Takeaway
Best overall fit on a CPU-only container:
1. **2D cut-out SVG character (GSAP/Remotion) + Rhubarb lip sync + shader or CSS backgrounds.** Fastest, most consistent, licence-clean.
2. **three.js toon 3D in headless Chromium with ANGLE→llvmpipe.** About 60–70 ms per 1080x1920 frame, so a 60 s video renders in minutes.
3. **Blender `bpy` EEVEE at 1–4 samples** for richer 3D, Grease Pencil, Line Art, claymation or stop-motion looks. About 2–5 s per frame, so 1–3 hours per minute of video on 4 cores.

Cycles is only for hero stills or very short clips.

### Cited Findings
- All throughput numbers come from the [Local test] runs in Q1 and Q2 (4 vCPU, 1080x1920).
- Asset and licence facts are cited in Q2, Q4 and Q5: Quaternius and Kenney CC0, MPFB CC0 output, Mixamo free but unmaintained, Ready Player Me shut down 31 January 2026, Spine and Live2D licence conditions, Rive runtimes MIT, GSAP free.

### Inferences
Catalogue (render times are per 1080x1920 frame on 4 CPU cores):

| Option | Achievable styles | How the agent scripts it | CPU render cost | Assets and licence | Fit for 9:16 lessons with recurring character |
|---|---|---|---|---|---|
| SVG/DOM cut-out puppet + GSAP/Remotion + Rhubarb | Flat vector, cut-out, motion-comic | JSON/TSX timelines; mouth swaps from Rhubarb JSON; procedural blinks | DOM-level, cheapest | Self-drawn SVG; GSAP free; Rhubarb open source | **Excellent**: consistent, cheap, easy lip sync |
| three.js / R3F toon in headless Chromium | Cel/toon 3D, outlines, low-poly, gradients, shader backgrounds, splats (Spark) | JS scene; frame-indexed time; Playwright or Remotion capture | ~60–70 ms (llvmpipe), ~140–180 ms (SwiftShader); full-screen post passes 0.8–4 s | Quaternius/Kenney glTF CC0 | **Very good**: fast; post-FX need custom fused shaders |
| Blender bpy EEVEE (1–4 samples) | Toon, NPR, Grease Pencil 2D-in-3D, Line Art, claymation, stop-motion, painterly | Python `bpy` scripts; render PNG frames, then ffmpeg | ~2 s (1 sample) to ~5.4 s (4 samples); Line Art about +1.5 s | MPFB CC0, Quaternius UAL CC0, Mixamo (manual) | **Good for premium episodes**: 1–3 h per minute of video |
| Blender Workbench | Flat, matcap, clay previews with outlines | `bpy` | ~0.9 s | same | Good for previews and a "designed clay" look |
| Blender Cycles CPU | Photoreal, soft GI | `bpy` | ~24–47 s (16 samples + denoise) | same | Poor: too slow |
| glslViewer / fragment shaders | Noise, liquid, gradient-mesh backgrounds | GLSL file plus a `u_time` per frame | Hundreds of ms for heavy per-pixel shaders at full resolution | Write your own (Shadertoy code often NC) | Good as background layer only |
| Rive / Spine / Live2D | Professional 2D rigs, mesh deformation | Needs a human-authored rig in the GUI editor; runtimes drive it | Cheap at runtime | Rive MIT runtimes; Spine needs an editor licence; Live2D free under ¥10M | Only if an artist builds the rig |
| AI 3D (Meshy, Tripo, Hunyuan, TRELLIS) | Generic stylised or realistic props and characters | Cloud API calls (no local GPU needed) | n/a (cloud) | Mixed: CC BY, paid-only commercial, territorial, NC dependencies | Props OK; recurring hero character risky |

- **Practical pipeline.** Pre-render a 2D or 3D character layer with alpha, composite it over shader backgrounds and kinetic typography in Remotion or ffmpeg, and lip-sync to the TTS track via Rhubarb.
- Reuse one frozen character definition across episodes.
- Budget for the 4-core CPU: three.js or 2D for daily output, Blender EEVEE for occasional stylised specials.

### Gaps
- No end-to-end test combining character, lip sync and narration was run. Rhubarb was blocked by the auto-mode safety check.
- Timing is from tiny scenes. Real character scenes (skinned meshes, more lights, textures, Line Art on complex geometry) will be slower, possibly 2–5x. This is unmeasured.
