# AI-assisted motion graphics pipelines: Claude Code + MCP servers, scripting APIs, skills, and generative AI complements (as of 2026-10-31)

Scope note: research was run on 2026-10-31 with web search plus a few page fetches. remotion.dev and eesel.ai could not be fetched from this sandbox (blocked hosts), so Remotion details come from search snippets and third-party guides. Many findings come from community READMEs and aggregators (mcpservers.org, lobehub, glama). They are labelled as such, and their star counts and versions may be out of date.

## 1. MCP servers / connectors that let Claude Code create or control motion graphics in other tools

### Takeaway
Remotion (React to MP4) is still the most mature, fully headless "Claude Code makes motion graphics" route. Desktop-app routes are now well populated:
- **Official MCP servers:** Blender Lab, Rive, LottieFiles/Lottie Creator, Figma (read-only design context), ComfyUI (Comfy-Org).
- **Official hosted connector:** Adobe for Creativity (Express/Firefly level, no After Effects).
- **Community bridges:** After Effects, Premiere, DaVinci Resolve (external scripting needs Studio), Unity, Unreal, Godot.

Almost every desktop-tool MCP needs the GUI app running locally with a bridge panel or add-on. Few run headless in a cloud container.

### Cited Findings

**Remotion (code-based video; headless)**
- Workflow: install the official Remotion agent skills, which add a SKILL.md to the project. Claude writes React components, Remotion Studio hot-reloads the preview, and the CLI renders. "No timeline editor. No After Effects. Just prompts." — [MindStudio guide](https://www.mindstudio.ai/blog/remotion-claude-code-animated-logo-reveals-motion-graphics); [ThamJiaHe claude-code-handbook Remotion guide](https://github.com/ThamJiaHe/claude-code-handbook/blob/main/docs/motion-graphics-claude-remotion-guide.md)
- Remotion licence: free for individuals and small teams. Companies above a size threshold need a paid company licence — [search summary of whaleyxbt/claude-motion and Remotion guides](https://github.com/whaleyxbt/claude-motion) (I could not fetch remotion.dev to confirm the threshold)
- Community toolkit "claude-motion" (whaleyxbt) is "a motion design toolkit for coding agents". It adds design guidance on top of the Remotion skills and suggests optional MCPs for Remotion docs, ElevenLabs voiceover, Playwright screenshots and Figma — [GitHub whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion). Note: this is a community repo, not Anthropic's "Claude Motion".
- Other community starter kits: [JJenglert1/remotion-claude-video](https://github.com/JJenglert1/remotion-claude-video), [balarabetahir/Build-AI-Motion-Graphics-with-Claude-and-Remotion](https://github.com/balarabetahir/-Build-AI-Motion-Graphics-with-Claude-and-Remotion)
- "clean-cut-mcp" is a community MCP server wrapping Remotion. Its repo has a pre-animation checklist and a "my animation problems" doc — [glama clean-cut-mcp](https://glama.ai/mcp/servers/endlessblink/clean-cut-mcp)
- Hosted alternative: Motion by Mosaic (mosaic.so) offers a remote MCP connector for Claude Code. It builds code-based motion graphics and spends Motion credits. Its docs say it cannot revise projects created in another Motion workflow — [Mosaic docs: Motion for Claude](https://docs.mosaic.so/how-to/motion-for-claude.md)

**Blender**
- **Official server:** Blender Lab's MCP server ([projects.blender.org/lab/blender_mcp](https://projects.blender.org/lab/blender_mcp); documented at blender.org/lab/mcp-server).
  - A companion add-on connects an LLM client to a running Blender session. It exposes the Python API, bundled docs, scene summaries, screenshots and code execution.
  - Requires Blender 5.1+. The add-on is v1.0.3 (2026-09-11) per one source. Sources differ on the add-on version and on 5.2 LTS support.
  - Sources: [StraySpark comparison 2026](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026); [DevelopersDigest](https://www.developersdigest.tech/mcp-servers/blender-mcp)
- Blender's own security warning: "The MCP server will execute LLM generated code in Blender without any guards in place to protect your data from removal or being sent to a remote location." — [StraySpark summary of the blender.org page](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026)
- **Community server:** ahujasid/blender-mcp (Siddharth Ahuja) is separate. Its README says it is "a community plugin, a third-party integration not made by Blender, and not to be confused with the official Blender Lab" — [StraySpark](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026)
- **Creator workflow (Windows, free):** use Claude Code to control Blender through the official MCP and build 3D models and animation, then finish in Remotion with titles and slide-in captions — [note.com TrueNorthAI](https://note.com/truenorthai/n/n9c6ef9b817f7?hl=en)
- Community skills for motion designers in Blender and After Effects: [LobzyJay/motion-design-with-claude](https://github.com/LobzyJay/motion-design-with-claude)

**After Effects**
- No official Adobe or Anthropic After Effects MCP exists as of Oct 2026. Anthropic's directory has one Adobe connector, and it does not cover AE — [Vagon: Claude Code with After Effects 2026](https://vagon.io/blog/how-to-use-claude-code-with-after-effects); [MindStudio: what the Adobe connector does and doesn't do](https://www.mindstudio.ai/blog/claude-mcp-adobe-vs-photoshop-premiere-what-it-does)
- **Community MCP servers:**
  - Dakkshin/after-effects-mcp: Node.js, MIT, roughly 250 stars per one aggregator. A bridge panel runs inside AE; setup is clone, build, install the panel script, then add to the Claude config — [lobehub](https://lobehub.com/mcp/dakkshin-after-effects-mcp); [claudemarketplaces](https://claudemarketplaces.com/mcp/dakkshin/after-effects-mcp)
  - TheLlamainator/after-effects-mcp: a fork of Dakkshin that adds audio-level analysis, waveform inspection, presets and keyframing. The mcp-bridge-auto.jsx panel must stay open in AE — [mcpservers.org](https://mcpservers.org/servers/thellamainator/after-effects-mcp)
  - sunqirui1987/ae-mcp: Go-based, installs an ExtendScript file in AE — [awesome.ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fsunqirui1987%2Fae-mcp)
- **Third-party commercial:** "Prism" (oneprism.io) connects Claude to an AE comp — [Prism docs](https://oneprism.io/docs/after-effects/connect/claude)
- LinkedIn demo of Claude controlling AE through both the Adobe connector and an AE MCP — [LinkedIn post](https://www.linkedin.com/posts/bruce-chen-153976b1_aiagent-aeagent-motiondesign-activity-7455467926129729536-xoeF)

**Headless AE rendering (nexrender / aerender)**
- nexrender wraps Adobe's `aerender` CLI. It works only in CLI mode and never launches the AE GUI. From AE 2023, aerender often will not render a comp without a configured output module — [nexrender GitHub](https://www.GitHub.com/inlife/nexrender)
- Licensing is contested:
  - The nexrender README claims it "does not require licenses for Adobe After Effects on any worker machine". It uses the `ae_render_only_node.txt` marker file for Adobe's non-royalty-bearing render-only mode (available since CS6), and nexrender's own docs call this "free trial use" — [nexrender](https://www.GitHub.com/inlife/nexrender); [Adobe community thread](https://community.adobe.com/questions-529/how-do-i-get-non-royalty-bearing-mode-to-work-in-ae-41516)
  - Adobe forum threads question whether this is allowed for web or server services — [Adobe community: AE web server license](https://community.adobe.com/questions-529/after-effects-web-server-license-69223)
  - AE still needs to be installed on Windows or macOS (no Linux build).

**Adobe (official)**
- **Adobe for Creativity** launched in Claude on 2026-04-28 as a hosted remote MCP server — [Adobe blog](https://blog.adobe.com/en/publish/2026/04/28/adobe-for-creativity-connector)
  - Coverage: 50+ tools across Photoshop, Lightroom, Firefly, Express, Premiere and more.
  - Adobe frames it as orchestrating multi-step workflows across Creative Cloud.
  - Third parties say it works at Express/Firefly level, not the full desktop Photoshop or Premiere feature set — [MindStudio](https://www.mindstudio.ai/blog/claude-mcp-adobe-vs-photoshop-premiere-what-it-does); [usecarly](https://www.usecarly.com/blog/adobe-mcp/)
- Adobe Express Developer MCP Server: helps build Express add-ons. It is not for authoring content — [Adobe developer docs](https://developer.adobe.com/express/add-ons/docs/guides/getting-started/local-development/mcp-server)
- **Premiere Pro:** full control needs a DIY UXP-scripting-plus-MCP bridge or a third-party plugin such as PremiereCopilot. Community "Adobe MCP Editor" bridges also exist (unverified) — [PremiereCopilot guide](https://www.premierecopilot.com/en/blog/how-to-use-claude-ai-in-premiere-pro); [lobehub Adobe MCP Editor](https://lobehub.com/mcp/codebuffalo0225-claude-ai-mcp-bridge)

**DaVinci Resolve**
- External Python scripting, which most Resolve MCPs use, is gated to Resolve Studio. Several servers say Studio is required and need Preferences > External scripting set to "Local" — [samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp); [lordhoell/davinci-resolve-mcp](https://github.com/lordhoell/davinci-resolve-mcp)
- Workarounds for the free version:
  - "Resolve MCP Pro" runs as Workspace > Scripts > resolve_mcp_bridge inside Resolve 20/21, free or Studio — [itch.io Resolve MCP Pro](https://y1uda.itch.io/resolve-mcp-pro)
  - emircbngl/davinci-resolve-mcp-free uses macOS UI automation, FCPXML and Lua — [GitHub](https://github.com/emircbngl/davinci-resolve-mcp-free)
- tooflex's server needs 64-bit CPython 3.10/3.11, because Resolve's module imports `imp`, which was removed in Python 3.12 — [tooflex/davinci-resolve-mcp](https://github.com/tooflex/davinci-resolve-mcp)

**Rive, Lottie, Figma**
- **Rive (official):** an MCP served by the Rive desktop app at `http://127.0.0.1:9791/mcp` (`claude mcp add --transport http rive http://127.0.0.1:9791/mcp`). It edits linear animations, state machines, keyframes and interpolation. Note that the aggregator page mixes in Lottie text — [mcpservers.org Rive](https://mcpservers.org/servers/rive-mcp)
- **Rive (community):** ODU33104/rive-mcp is free and editor-less. It can create, edit, inspect, render and live-preview .riv files — [GitHub](https://github.com/ODU33104/rive-mcp)
- **LottieFiles hosted MCP** (`https://mcp.lottiefiles.com/mcp`): search and organise workspaces and animations — [LottieFiles docs](https://docs.lottiefiles.com/en/platform/mcp)
- **Lottie Creator MCP** (`npx -y @lottiefiles/creator-mcp@latest`): the AI can build, edit and generate animations directly — [LottieFiles blog](https://lottiefiles.com/blog/working-with-lottie-animations/your-ai-can-now-control-lottie-creator-heres-what-that-actually-means); [mcpservers.org](https://mcpservers.org/servers/lottie-creator-mcp)
- Community junmer/mcp-server-lottiefiles: search and retrieve only — [GitHub](https://github.com/junmer/mcp-server-lottiefiles)
- Guide: hand-writing Lottie JSON with Claude Code — [Medium](https://medium.com/@felix.anderson1504/make-your-own-lottie-animation-using-claude-code-185e3fd19e1a)
- **Figma (official):** `claude plugin install figma@claude-plugins-official` or `claude mcp add --transport http figma https://mcp.figma.com/mcp`. It gives Claude Code design context (components, variables, layout, FigJam, Make resources) and is read-oriented, so it does not author animation — [Figma Help Center](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server)

**ComfyUI and game engines**
- ComfyUI official: Comfy-Org/comfy-mcp drives a local ComfyUI from agents — [GitHub Comfy-Org/comfy-mcp](https://github.com/Comfy-Org/comfy-mcp); [docs.comfy.org](https://docs.comfy.org/agent-tools/mcp). Community artokun/comfyui-mcp is an MCP plus Claude Code plugin with 31 tools — [lobehub](https://lobehub.com/mcp/artokun-comfyui-mcp)
- Unreal: IvanMurzak/Unreal-MCP is a C++ editor plugin plus a .NET bridge — [GitHub](https://github.com/IvanMurzak/Unreal-MCP)
- Unity-MCP is open source with 100+ tools. GladeKit covers Unity and Godot — [HeyClaude comparison](https://heyclau.de/compare/game-3d-dev-mcp-servers); [pypi gladekit-mcp](https://pypi.org/project/gladekit-mcp/0.7.21/)
- Godot MCPs are mostly Godot 4.x only — [StraySpark Godot guide](https://www.strayspark.studio/blog/godot-mcp-setup-claude-code-2026)

### Inferences
- **Headless vs desktop:** headless or cloud-friendly options are Remotion, Lottie JSON authoring, Lottie Creator/LottieFiles hosted MCP, Adobe for Creativity (hosted), Mosaic Motion (hosted), Canva connector (hosted), and ComfyUI if you have a GPU host. Desktop-app-required options are Blender (headless rendering is possible, but the MCP needs the running session), After Effects (Win/macOS plus a Creative Cloud licence), Premiere, Resolve, Rive's official MCP, Unity, Unreal and Godot.
- **Fit for 9:16 narrated lesson videos:** Remotion is the best fit, because it is deterministic, takes any resolution (1080x1920) and puts audio on the timeline. After Effects via MCP suits teams who already use AE templates. Lottie and Rive suit small animated stickers or icons composited into the main video rather than whole lessons.
- **Security:** Blender, AE and Resolve bridges execute arbitrary LLM-generated scripts. Use project copies and version control.

### Gaps
- No sources found for a Cavalry scripting or MCP integration, Spline MCP, Jitter API/MCP, CapCut or Descript public APIs, or MOGRT generation via MCP. These need a dedicated search. Background knowledge, unverified here: Cavalry has a JavaScript scripting API and Descript has had limited API access.
- ahujasid/blender-mcp's current star count, licence and features were not fetched.
- Remotion's company-licence threshold and price were not confirmed (remotion.dev is blocked in this sandbox).
- Adobe's current AE render-only licence terms for 2026 are unconfirmed.
- Resolve's free-vs-Studio scripting gate comes from community READMEs, not Blackmagic documentation.

## 2. Anthropic's own offerings (2025–2026): skills, artifacts, Claude Motion, Claude Design

### Takeaway
"Claude Motion" is real. It is an Anthropic beta, launched about 8–9 Oct 2026, for Team and Enterprise plans. It builds short animations as code (no video model), is editable in chat or an editor, exports MP4, and hands off to partner tools. Canva import is visible as a tool in the Canva connector. The official anthropics/skills repo has no video or Remotion skill, but it does include algorithmic-art, canvas-design, slack-gif-creator, web-artifacts-builder and frontend-design. Claude Design (Apr 2026) covers static prototypes and decks, not motion.

### Cited Findings
- **Claude Motion (official support article)** — [Claude Help Center](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion):
  - Turns content into short animations such as explainers, animated charts and product walkthroughs.
  - Generated as code that animates text, charts, shapes and images. It "doesn't use a video generation model", so it produces no realistic footage or people.
  - Edit by chat or in an editor, and change one detail without disturbing the rest. Export as MP4. Saved in the Artifacts tab and private by default.
  - Beta on Team (on by default) and Enterprise (off until an owner enables it in Organization settings > Artifacts). It counts toward usage limits, and longer animations use more.
  - The page does not state aspect ratios, duration limits or audio/voiceover support.
- **Launch date:** 8 Oct 2026 per Unite.AI, launched alongside Claude Dashboards; 9 Oct per Emergent — [Unite.AI](https://www.unite.ai/anthropic-launches-claude-dashboards-and-motion-takes-docs-out-of-beta/); [Emergent](https://emergent.sh/news/claude-dashboards-motion-launch-beta-all). Emergent's headline says "for all plans", which conflicts with the support article's Team/Enterprise-only statement.
- **Handoff partners:** finished animations can be opened in Adobe, Descript, HeyGen, Higgsfield, invideo, Luma AI and Runway, with Canva and Captions "coming soon" — [eesel.ai summary via search](https://www.eesel.ai/blog/claude-motion); [ArtRealm](https://artrealmai.com/article/claude-motion-beta-code-built-animated-explainers). The page fetch was blocked, so this is a secondary source.
- Third-party claims of WebM export and 4K options are not in official material — [search summary across eesel/claudemotion.io](https://claudemotion.io/what-is-claude-motion). Note that claudemotion.io appears to be an unofficial site.
- **Official anthropics/skills repo:** 19 skill folders, including algorithmic-art, canvas-design, slack-gif-creator, web-artifacts-builder, frontend-design, theme-factory, brand-guidelines, mcp-builder and skill-creator, plus docx/pdf/pptx/xlsx. There is no video, animation or Remotion skill — [GitHub anthropics/skills/skills](https://github.com/anthropics/skills/tree/main/skills)
  - Many skills are Apache 2.0; the document skills are "source-available, not open source".
  - Install: `/plugin marketplace add anthropics/skills`, then `/plugin install example-skills@anthropic-agent-skills` — [GitHub anthropics/skills](https://github.com/anthropics/skills)
- **Claude Design:** launched 2026-04-17 as an Anthropic Labs research preview on Claude Opus 4.7, for prototypes, slide decks and one-pagers — [TechCrunch](https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/); [TweakTown](https://www.tweaktown.com/news/111097/anthropic-launches-claude-design-and-it-trying-to-work-with-canva-not-compete/index.html)
  - Exports: PDF, PPTX, standalone HTML, and fully editable Canva import, plus a handoff package to Claude Code.
  - No native Figma import or export — [DataCamp](https://www.datacamp.com/blog/claude-design)

### Inferences
- **Observed in this session (not a web source):** the connected Canva MCP connector exposes `import-claude-motion-from-url` and `get-motion-import-job-status` tools, and the Wix connector exposes `import-claude-design-from-url`. So Claude Motion to Canva import appears live in the connector, even though press coverage said Canva was "coming soon". Canva's own Help Center tool said it had no information on Claude Motion imports. Treat the feature as new or rolling out.
- **Restricted ElevenLabs connector (observed in this session):** it offers speech, voice design, transcription and SFX via "Flows". Its instructions say image, video and music generation need the full ElevenLabs connector at `https://api.elevenlabs.io/v1/mcp`.
- **Possible 9:16 lesson pipeline:** Claude Motion or Remotion for the animated explainer layer, ElevenLabs for narration, then Canva or another editor for final assembly and captions. Claude Motion's 9:16 support and audio support are unconfirmed, so Remotion stays the safer choice for exact vertical renders with a synced voice track.
- The skills slack-gif-creator (frame-based animated GIFs in Python/PIL), algorithmic-art (p5.js) and canvas-design are useful building blocks for stylised motion. My understanding of what these skills do is background knowledge; the repo listing confirms only the folder names.

### Gaps
- Official Claude Motion details on aspect ratios, duration caps, audio, and the underlying tech (HTML/JS vs Remotion-style) were not found. I also found no official Anthropic news post; only the support article was fetched.
- No official Anthropic Remotion skill was found. Remotion publishes its own agent skills (vendor-official for Remotion, not Anthropic).

## 3. After Effects specifics: expressions, Bodymovin/Lottie, MOGRTs, nexrender

### Takeaway
Claude Code can drive AE through ExtendScript-based MCP bridges (community), write expressions and JSX scripts, and render headlessly with nexrender/aerender. This route needs AE installed on Windows or macOS plus a licence; the legality of render-only nodes is disputed. I found no MCP that generates MOGRTs.

### Cited Findings
- AE MCPs rely on an ExtendScript/JSX bridge panel running inside AE (Dakkshin, TheLlamainator, sunqirui1987) — sources as in section 1.
- nexrender: data-driven template rendering via aerender, CLI only. The render-only marker file is discussed above — [nexrender](https://www.GitHub.com/inlife/nexrender)
- A QNAP NAS package of nexrender-server v1.41.0 suggests the project is still maintained — [forum-nas.fr](https://www.forum-nas.fr/threads/nexrender-server-1-41-0-data-driven-render-automation-server-for-after-effects.11587)

### Inferences
- For a solo creator making 9:16 lessons, AE plus an MCP makes sense only if AE templates already exist. Otherwise Remotion or Claude Motion avoid the licence cost and GUI dependency.

### Gaps
- Bodymovin/Lottie export automation via MCP, MOGRT authoring, and UXP support for AE (Adobe has been moving Premiere to UXP) were not researched in depth.

## 4. Generative video/image/audio complements callable by API

### Takeaway
- **Video:** Veo 3.1 is the main API video model after OpenAI shut down the Sora 2 API (reported 24 Sep 2026). Runway's API (Gen-4 Turbo, Gen-4.5, and Kling 3.0 via Runway) and Kling's own API are mid-priced alternatives.
- **Audio:** ElevenLabs covers voice, SFX and music with commercial rights from the $6 Starter plan.
- **Lip-sync and avatars:** Sync (sync.so) and HeyGen have per-second APIs.
- Price figures conflict across third-party sites, so verify on vendor pages.

### Cited Findings
- **Sora 2 API:** shut down on 2026-09-24 per one source. Former pricing was $0.10/s at 720p; Pro was $0.30/$0.50/$0.70 per second at 720p/1024p/1080p, with vertical 720x1280 and 1080x1920 options at the same price as horizontal — [FrameSurfer](https://framesurfer.com/blogs/sora-2-pricing); [layer3labs](https://www.layer3labs.io/comparisons/sora-vs-veo)
- **Veo 3.1 rates per second** — [invideo pricing roundup](https://invideo.io/blog/ai-video-model-pricing/); [CloudZero](https://www.cloudzero.com/blog/veo-3-pricing/); [CometAPI](https://www.cometapi.com/ai-video-api-pricing/):

  | Tier | 720p | 1080p | 4K |
  |---|---|---|---|
  | Lite | $0.05 | $0.08 | – |
  | Fast | $0.10 | $0.12 | – |
  | Standard | $0.40 | $0.40 | $0.60 |

  Sources conflict on Fast: one gives $0.15/s with audio, another $0.08/s at 720p without audio.
- **Runway API:** $0.01 per credit. gen4_turbo is 5 credits/s ($0.05/s) and gen4.5 is 12 credits/s ($0.12/s). Kling 3.0 standard on Runway is 9 credits/s without audio and 13 with audio — [Runway API pricing docs](https://docs.dev.runwayml.com/guides/pricing/)
- **Kling developer platform:** Kling 3.0 costs 0.6 units/s at 720p and 0.8 units/s at 1080p, at about $0.14 per unit (≈$0.084 and $0.112 per second) — [Crazyrouter comparison](https://crazyrouter.com/en/blog/ai-video-generation-api-pricing-may-2026-comparison); [Forasoft](https://www.forasoft.com/learn/ai-for-video-engineering/articles-ai/sora-runway-pika-kling-luma-api-pricing-integration)
- I found no vertical-specific (9:16) price differences for Veo, Runway or Kling — [search synthesis; see sources above](https://invideo.io/blog/ai-video-model-pricing/)
- **ElevenLabs** — [ElevenLabs API pricing](https://elevenlabs.io/pricing/api); [Eleven Music API](https://elevenlabs.io/eleven-music-api); [puter.com breakdown](https://developer.puter.com/tutorials/elevenlabs-api-pricing/):
  - Commercial rights start at Starter ($6/mo); the free tier is non-commercial.
  - The official API page lists Eleven Music at $0.15/min and SFX at $0.12/min of audio. Third-party sites list music at $0.30/min.
  - Music commercial rights vary by tier.
- **Sync (sync.so):** REST API at api.sync.so/v2. Models include sync-3, lipsync-2, lipsync-2-pro and react-1, priced from $0.02/s (lipsync-1.9) to $0.133/s (sync-3) at 25 fps — [Sync docs API overview](https://sync.so/docs/api-reference/api-overview)
- **HeyGen API:** a separate prepaid wallet starting at $5, billed per second. Reported rates are Avatar III ~$1/min (1080p) and Avatar IV photo avatar ~$3/min. Avatar V is about $3–4/min, and sources conflict — [G2](https://www.g2.com/articles/heygen-api-pricing); [eesel HeyGen pricing](https://www.eesel.ai/blog/heygen-pricing); [HeyGen blog](https://www.heygen.com/blog/ai-video-generator-pricing)
- **Hedra:** no first-party API pricing was found. One third party says it is about 50% cheaper per second than VEED Fabric, with lower quality — [VEED lipsync API roundup](https://www.veed.io/learn/best-lipsync-api)

### Inferences
- **Cost for a 60-second 9:16 lesson:**
  - With Claude Motion or Remotion visuals plus ElevenLabs narration, generative video cost can be zero. Only TTS characters are spent.
  - Adding 3–4 short B-roll clips of about 5 s each from Veo 3.1 Fast (~$0.10–0.12/s) costs roughly $2.
  - A full talking-avatar lesson via HeyGen costs about $1–4 per minute.
- **Consistency:** text-to-video models do not keep characters consistent across shots unless you use reference-image features (Runway "references", Kling elements). Code-based animation (Remotion, Claude Motion, Lottie) gives exact brand consistency.

### Gaps
- Luma Ray, Pika, Hailuo/MiniMax, Seedance and Suno API pricing and licence terms were not researched individually. Suno has no widely documented official public API (background knowledge, unverified).
- Image models for consistent characters (e.g. Gemini/Nano Banana, Flux Kontext, Ideogram character) were not researched.
- Commercial licensing and indemnity terms for Veo, Runway and Kling outputs were not checked.

## 5. Creator-reported workflows and common pitfalls

### Takeaway
Creators mainly report two workflows:
- **Claude Code + Remotion** (prompt → React → render), sometimes with Blender MCP for 3D shots.
- **Hosted connectors** (Mosaic Motion, Claude Motion).

The recurring pitfalls are animation not tied to frames, voiceover/caption sync needing a separate transcription step, Remotion package version mismatches, vague prompts, and no automatic safe-zone or face-overlap checks.

### Cited Findings
- In Remotion, animations not driven by `useCurrentFrame()` (CSS transitions, setTimeout) do not render correctly. Prompts work better with exact timings in seconds, colours, resolution and fps — [ThamJiaHe handbook](https://github.com/ThamJiaHe/claude-code-handbook/blob/main/docs/motion-graphics-claude-remotion-guide.md)
- From the same post — [Rescroll blog](https://www.rescroll.ai/blog/claude-code-remotion-motion-graphics-2026):
  - "Remotion doesn't know what you said". Word-level timestamps need an external tool; Remotion suggests Whisper, which is a heavy download.
  - Phone footage that isn't 30 fps causes drift.
  - All @remotion/* packages must be on exactly the same version.
  - Remotion won't check whether graphics cover faces or platform UI.
- clean-cut-mcp's "MY-ANIMATION-PROBLEMS" doc and pre-animation checklist record the authors' own quality issues with AI-generated Remotion animations — [glama](https://glama.ai/mcp/servers/@endlessblink/clean-cut-mcp/blob/13ec46d11f1e6e5f4987cd7f637c23abda34564d/docs/main-docs/MY-ANIMATION-PROBLEMS.md)
- Blender MCP plus Remotion hybrid tutorial — [note.com TrueNorthAI](https://note.com/truenorthai/n/n9c6ef9b817f7?hl=en)
- Claude Code with AE guide (2026) — [Vagon](https://vagon.io/blog/how-to-use-claude-code-with-after-effects)

### Inferences
- **For 9:16 narrated lessons**, the main risks are:
  - voice-to-visual sync: generate TTS first, get timestamps from ElevenLabs alignment or a transcription step, then drive frames from them;
  - text in platform UI safe zones (TikTok/Reels overlays at the top and bottom);
  - style drift between episodes: lock a design-token or theme file and reuse components.

### Gaps
- No Reddit or X threads were retrieved; search returned blogs and GitHub only. YouTube tutorials were not reviewed.
- No quantitative data (render times, failure rates) on Claude Code motion pipelines was found.
