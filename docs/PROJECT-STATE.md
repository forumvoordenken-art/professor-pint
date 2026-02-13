# Professor Pint — Project State & Step Plan

> **Lees dit bestand aan het begin van elke nieuwe chatsessie.**
> Zeg: "Check docs/PROJECT-STATE.md — waar staan we en wat moeten we doen?"

**Laatste update:** 2026-02-13

---

## Current State: Phase 1 — Kwaliteitstools gebouwd, klaar voor visuele evaluatie + vegetation

- Specs zijn geschreven (v2.0)
- Repository is opgeschoond en herstructureerd met Nederlandse mapnamen
- SceneComposer prototype en test assets zijn gebouwd (stap 0.1 + 0.2)
- Phase 0 is volledig afgerond (prototype gevalideerd, performance getest, presets gebouwd)
- **Professor Pint v2.2 is af** — 12 emoties, vest met mouwen, pelvis/hip-connectie, idle+talking animaties
- **15 sky assets klaar** + SkyEngine + longCycleNoise systeem voor non-repeating animatie
- **15 terrain assets klaar** + TerrainEngine + TerrainShowcase
- **Per-asset painterly post-processing gebouwd** — withAssetPaint HOC wraps alle 31 assets met edge displacement + canvas grain + saturation boost
- **Kwaliteitstools gebouwd:**
  - `HorizonMatcher` — Atmosferische blending tussen sky en terrain (haze band + light spill + dust particles), 10 mood presets, 15 curated sky+terrain combinaties
  - `CombinedShowcase` compositie — Sky + terrain samen met HorizonMatcher, toont 15 curated combos (75 sec)
  - `ComparisonShowcase` compositie — Raw vs painted side-by-side vergelijking met sliding divider (50 sec)
  - `withAssetPaint` verbeterd — Geanimeerde grain seed (levend canvas) + impasto highlight layer (dikke verf op hoge-contrast randen)
- Volgende sessie: **Render showcases en evalueer visueel**, daarna **Step 1.3 — Vegetation assets bouwen**

---

## Mappenstructuur

```
professor-pint/
├── docs/                    ← Spec-documenten
│   ├── PROJECT-STATE.md     ← Dit bestand
│   ├── VIDEO-SPEC.md        ← Video output regels
│   ├── PIPELINE-ARCHITECTURE.md  ← Pipeline spec
│   └── FEEDBACK-SYSTEM.md   ← Feedback spec
│
├── src/
│   ├── personages/          ← Character SVG-componenten
│   ├── videos/              ← Video compositions
│   ├── motor/               ← Render engine (SceneComposer, Camera, etc.)
│   ├── animaties/           ← Animatie helpers (emotions, idle, talking)
│   └── assets/              ← Statische bestanden + test placeholders
│
├── CLAUDE.md                ← AI instructies
└── [config in root]         ← package.json, tsconfig.json, etc.
```

---

## Documents Written

| Document | Status | Description |
|----------|--------|-------------|
| `docs/VIDEO-SPEC.md` | v2.0 ✅ | The "bible" — brand identity, asset library structure, 10-layer scene composition, characters, cameras, animations, audio, subtitles, overlays, quality gates, YouTube metadata |
| `docs/PIPELINE-ARCHITECTURE.md` | v2.0 ✅ | End-to-end pipeline: Input → Script → Compose → Quality → Audio → Assembly → Preview → Render → Upload. n8n workflow, cost estimates, phased library build |
| `docs/FEEDBACK-SYSTEM.md` | v2.0 ✅ | Self-learning feedback via n8n approval buttons. 19 categories, 3 priority levels, rules.json injected into every LLM prompt |

---

## Key Decisions Made

1. **Asset Library approach** — LLM composes scenes from pre-built, fine-tuned SVG components (not generating SVG from scratch)
2. **10-layer scene composition** — sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting
3. **Position presets** — Pre-defined x/y/scale positions so LLM doesn't guess coordinates
4. **n8n-only feedback** — No separate dashboard. Approve/Feedback/Reject buttons in n8n
5. **English only** — All content in English
6. **Scene duration = guideline** — Target 10-20s per scene, max 30s, not a hard rule
7. **"Unique" = visually different** — Variations of the same base (e.g. different lighting, angle) count
8. **Existing code = reference only** — Current code serves as pattern examples, not production-ready
9. **Costs acceptable** — ~$8-20 per video, ~$130-230/month for regular production
10. **Music source TBD** — Still needs to be decided (royalty-free library, AI-generated, etc.)
11. **Asset creation via ChatGPT + vectorizer.ai** — Assets worden NIET handmatig als SVG getekend. Workflow: ChatGPT genereert flat-color illustratie → vectorizer.ai traceert naar SVG → Claude animeert in Remotion. Doel: 300-500 paden per SVG, max 16 kleuren.

---

## Asset Creation Workflow

### Stap 1: ChatGPT prompt

Gebruik deze standaard prompt in ChatGPT (DALL-E):

```
Create a single [OBJECT DESCRIPTION] as a centered illustration on a pure white background.

Style rules (STRICT):
- Flat color fills only — NO gradients, NO soft shadows, NO texture, NO noise
- Maximum 16 distinct colors total
- Bold clean outlines (dark stroke, consistent width)
- Large simple shapes — avoid tiny details, no individual hairs or stitching
- Cel-shaded look: shadow = one darker flat color per surface, not a gradient
- No background elements — only the object itself on white
- No ground plane, no reflections, no glow effects
- Style reference: Kurzgesagt / TED-Ed animation style

Why these rules: This image will be vectorized into SVG. Every color boundary becomes a separate path. Fewer colors + simpler shapes = fewer paths = smaller file that performs well in animation.
```

Vervang `[OBJECT DESCRIPTION]` met wat je wilt, bijv:
- `a cartoon beer mug with foam`
- `an Egyptian pharaoh character, full body, front-facing`
- `a tall palm tree with green fronds`

### Stap 2: vectorizer.ai

Upload de PNG naar vectorizer.ai met deze instellingen:
- **Detail level**: laag/medium (niet maximaal)
- **Color count**: max 16-24
- **Minimum path size**: omhoog zetten zodat kleine vlekjes wegvallen
- **Output**: SVG

**Doel: 300-500 paden per SVG.** Check met: `grep -c '<path' bestand.svg`

### Stap 3: Upload naar `src/assets/`

- Hernoem naar beschrijvende naam: `palm-tree.svg`, `pharaoh.svg`, etc. (geen spaties, geen timestamps)
- Upload naar `src/assets/` op main via GitHub

### Stap 4: Claude animeert

Claude wraps de SVG in een React component met:
- Idle animatie (sway, bob, etc.)
- Optionele interactie-animaties
- `withAssetPaint` post-processing voor oil painting look
- Registratie in het asset registry

### Wat Claude WEL kan animeren op statische SVG's:
- **Transform-animaties**: swaying, bobbing, rotating, scaling, bouncing
- **Opacity-animaties**: fade in/out, flashing (bijv. bliksem)
- **Position-animaties**: drifting, flying, sliding
- **Filter-animaties**: color shifts, blur changes
- **Clip-path animaties**: reveal/hide delen van de SVG

### Wat Claude NIET kan:
- Interne SVG-structuur veranderen (bijv. een arm los bewegen tenzij het een apart `<g>` element is)
- Mesh deformation of skeletal animation op een flat SVG

---

## Identified Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | **Collage look** — Composing separate SVG layers may look like cutouts pasted together instead of a cohesive painting | HIGH | Test early with 5 dummy assets. Use shared color palettes, consistent lighting layers, atmosphere overlays to unify |
| 2 | **SVG performance** — 10 layers x multiple animated elements may be too heavy for Remotion at 30fps | HIGH | Benchmark in Step 0.3. Set max element counts per layer if needed |
| 3 | **LLM spatial composition** — LLM cannot "see" what it's composing, may create nonsensical layouts | MEDIUM | Position presets eliminate guesswork. LLM picks from predefined slots, not raw coordinates |
| 4 | **TTS timing cascade** — Audio duration determines scene duration, but scenes are composed before audio exists | MEDIUM | Two-pass system: compose scenes first, then adjust timing after TTS. Pipeline already accounts for this |
| 5 | **Context window limits** — Asset manifest + feedback rules + script might exceed LLM context | MEDIUM | Phased prompts: script generation and scene composition are separate LLM calls with different context |
| 6 | **Subjective quality gates** — "Does this look good?" is hard to automate | LOW | Asset-level quality is guaranteed (pre-tested). Scene-level gates check structural rules only |
| 7 | **Large initial time investment** — Building the first ~50 universal assets before producing any video | LOW | User confirmed time is not a problem. Assets are reusable across all future videos |

---

## Step Plan

### Phase 0: Prototype & Validation
> Goal: Prove the 10-layer composition system works in Remotion before building anything else.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 0.1 | **Build SceneComposer prototype** | ✅ Done | `src/motor/SceneComposer.tsx` — accepts ComposedScene, renders 10 layers. Asset registry met `registerAsset()`. |
| 0.2 | **Create 5 dummy test assets** | ✅ Done | `src/assets/test/placeholders.tsx` — 10 placeholder assets (sky, terrain, water, structure, vegetation, character, prop, foreground, atmosphere, lighting). Test composition in `src/videos/TestVideo.tsx`. |
| 0.3 | **Test render performance** | ✅ Done | 900 frames in ~126s (~7 fps render). 6.3 MB output. Geen errors. Performance is prima voor Remotion headless rendering. |
| 0.4 | **Evaluate visual cohesion** | ✅ Done | Placeholder assets zien er basic uit (zoals verwacht). Lagensysteem werkt correct: z-ordering, positionering, scaling allemaal goed. Visuele kwaliteit wordt opgelost met echte oil-painting assets in Phase 1. |
| 0.5 | **Build position presets system** | ✅ Done | `src/motor/PositionPresets.ts` — 18 presets (5x back, 5x mid, 5x front, + podium, duo_left, duo_right). SceneComposer ondersteunt nu `position: "center_front"` als alternatief voor x/y/scale. Jitter-optie voor natuurlijke variatie. `getPresetManifest()` voor LLM prompt. |

### Phase 1: Minimum Viable Library (Universal Assets)
> Goal: Build ~50 universal assets that work across any video theme.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 1.1 | **Sky assets (5-8)** | ✅ Done | **15 skies gebouwd** + SkyEngine met shared primitives + SkyShowcase. Varianten: day_clear, day_cloudy, day_hazy, day_tropical, dawn_golden, sunset_warm, sunset_cold, dusk_red, night_stars, night_moon, night_aurora, storm_dark, storm_rain, sandstorm, indoor_ceiling. Alle animaties via longCycleNoise (non-repeating voor 10-15min videos). |
| 1.2 | **Terrain assets (5-8)** | ✅ Done | **15 terrains gebouwd** + TerrainEngine met shared primitives + TerrainShowcase. Varianten: grass_plain, grass_hill, sand_flat, sand_dunes, dirt_plain, cobblestone, rocky_mountain, snow_field, jungle_floor, river_bank, sea_shore, camp_ground, indoor_floor, cliff_edge, abstract_plane. Shared components: GroundPlane, HorizonBlend, HillSilhouette, SurfaceScatter, GroundMist, WaterSurface, TerrainTexture. Alle animaties via longCycleNoise. |
| 1.3 | **Vegetation assets (8-10)** | ⬜ Not started | Trees (oak, palm, pine), bushes, flowers, grass patches, vines. Each with idle animation. |
| 1.4 | **Atmosphere overlays (4-6)** | ⬜ Not started | Dust particles, fog, rain, snow, fireflies, heat shimmer. |
| 1.5 | **Lighting overlays (4-6)** | ⬜ Not started | Golden hour, moonlight, indoor warm, dramatic spotlight, candlelight. |
| 1.6 | **Professor Pint v2** | ✅ Done | v2.2: 12 emoties, vest met mouwen/schouders, pelvis/hip-connectie, simpele handen, geïntegreerd bierglas, idle+talking animaties. EmotionCarousel compositie voor preview. |
| 1.7 | **Generic crowd figures (10-12)** | ⬜ Not started | Universal crowd members that work in any era/setting with costume variations. |
| 1.8 | **Common props (8-10)** | ⬜ Not started | Table, chair, book, torch, sign, barrel, cart, etc. |
| 1.9 | **Asset Manifest system** | ⬜ Not started | Build `AssetManifest.ts` — JSON catalog of all available assets with metadata (tags, compatible-themes, size, animation-type). LLM receives this to know what's available. |
| 1.10 | **Quality gate: validate all assets** | ⬜ Not started | Render every asset in isolation. Check: renders correctly, animation smooth, no SVG errors, scales properly at position presets. |

### Phase 2: First Theme Library (Egypt)
> Goal: Build ~25 Egypt-specific assets. Produce first complete test video.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 2.1 | **Egypt structures (5-6)** | ⬜ Not started | Pyramids, Sphinx, temples, obelisk, mud-brick house, market stall |
| 2.2 | **Egypt characters (5-6)** | ⬜ Not started | Pharaoh, priest, worker, scribe, merchant, soldier |
| 2.3 | **Egypt props (5-6)** | ⬜ Not started | Hieroglyph wall, papyrus, gold artifacts, construction tools, boats |
| 2.4 | **Egypt terrains (3-4)** | ⬜ Not started | Desert sand, Nile riverbank, tomb interior, quarry |
| 2.5 | **Egypt crowds** | ⬜ Not started | Worker groups, market crowds, ceremony attendees |
| 2.6 | **Update Asset Manifest** | ⬜ Not started | Add all Egypt assets with tags and theme metadata |

### Phase 3: Pipeline Core
> Goal: Build the automated pipeline that turns a topic into a rendered video.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 3.1 | **SceneComposer (production)** | ⬜ Not started | Upgrade prototype to full production component. Handle all 10 layers, animations, transitions. |
| 3.2 | **LLM Script Generator** | ⬜ Not started | Prompt engineering: topic + sources + asset manifest → full script with scene compositions. |
| 3.3 | **Quality Gates system** | ⬜ Not started | Automated checks at asset, scene, and video level. Feedback compliance checking. |
| 3.4 | **FeedbackStore integration** | ⬜ Not started | Connect `rules.json` → LLM prompt injection. |
| 3.5 | **First end-to-end test** | ⬜ Not started | Generate 1 complete Egypt video: topic → LLM script → composed scenes → rendered video. No audio yet. |

### Phase 4: Audio Pipeline
> Goal: Add voice, music, and sound effects.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 4.1 | **ElevenLabs TTS integration** | ⬜ Not started | Select voice, connect API, generate speech per scene. Need API key from user. |
| 4.2 | **Lip sync system** | ⬜ Not started | Phoneme data from ElevenLabs → mouth shape animations on Professor Pint. |
| 4.3 | **Music source decision** | ⬜ Not started | Decide: royalty-free library, AI-generated, or manual selection. TBD with user. |
| 4.4 | **SFX system** | ⬜ Not started | LLM selects sound effects per scene. Build SFX library or source from free libraries. |
| 4.5 | **SRT subtitle export** | ⬜ Not started | Generate `.srt` files from script for YouTube closed captions. |
| 4.6 | **Audio + video sync test** | ⬜ Not started | Full render with voice + music + SFX. Verify timing, levels, lip sync quality. |

### Phase 5: n8n Pipeline & YouTube
> Goal: Full automation from topic input to YouTube upload.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 5.1 | **n8n webhook server** | ⬜ Not started | Express/Fastify wrapper for pipeline triggers. |
| 5.2 | **n8n workflow build** | ⬜ Not started | 14-step workflow as specified in PIPELINE-ARCHITECTURE.md. |
| 5.3 | **Preview & approval flow** | ⬜ Not started | 480p quick render → n8n approval buttons → feedback loop. |
| 5.4 | **YouTube metadata generation** | ⬜ Not started | LLM generates title, description, tags, thumbnail concept. |
| 5.5 | **YouTube upload integration** | ⬜ Not started | n8n YouTube node: upload video + metadata + thumbnail. |
| 5.6 | **Video schedule system** | ⬜ Not started | Topic queue with sources, scheduling, status tracking. |

### Phase 6: Expand & Scale
> Goal: More themes, more assets, production-ready.

| Step | Task | Status | Details |
|------|------|--------|---------|
| 6.1 | **Second theme library** | ⬜ Not started | Pick next theme (Roman Empire? Medieval? Renaissance?), build ~20-25 assets. |
| 6.2 | **Asset browsing in Remotion** | ⬜ Not started | Compositions in Root.tsx to visually browse all library assets in Remotion Studio. |
| 6.3 | **Production pipeline testing** | ⬜ Not started | Generate 5+ videos, refine based on results. |
| 6.4 | **Feedback system tuning** | ⬜ Not started | Review accumulated feedback rules, resolve contradictions, optimize. |

---

## What Exists Now

Na de opschoning bevat de repo ~20 bestanden:

- **1 character**: ProfessorPint (in `src/personages/`) — werkend met emotions, idle, talking animaties
- **Motor**: SceneComposer, SceneRenderer, Camera, CameraPath, Subtitles, Transitions (in `src/motor/`)
- **Post-processing motor**: OilPaintFilter, TextureOverlay, PaintEffect, withAssetPaint HOC, RiveIntegration (in `src/motor/`)
- **Animaties**: easing, emotions, gestures, idle, talking (in `src/animaties/`)
- **Test**: SceneComposerTest compositie + 10 placeholder assets (in `src/videos/` en `src/assets/`)
- **Oude code**: Verwijderd maar beschikbaar in git history voor referentie

### Post-Processing Systeem (per-asset)

Elk asset wordt automatisch gewrapt met painterly effects via `withAssetPaint` HOC in de index-bestanden. Geen wijzigingen nodig aan individuele asset-bestanden.

| Component | Wat het doet | Waar |
|-----------|-------------|------|
| `withAssetPaint` | HOC die assets wrapt met SVG filters per categorie | `src/motor/withAssetPaint.tsx` |
| `OilPaintFilter` | SVG filter chain: turbulence → displacement → emboss → color | `src/motor/OilPaintFilter.tsx` |
| `TextureOverlay` | Canvas/papier grain + Kuwahara approximatie + film grain | `src/motor/TextureOverlay.tsx` |
| `PaintEffect` | Scene-level wrapper (vignette, color grade, film grain) | `src/motor/PaintEffect.tsx` |
| `RiveIntegration` | Placeholder bridge voor Rive character animatie | `src/motor/RiveIntegration.tsx` |

**Per-asset categorie instellingen:**

| Categorie | Displacement | Grain | Saturation | Toelichting |
|-----------|-------------|-------|------------|-------------|
| `sky_day` | 3px | 9% | +8% | Zachtere wolkenranden |
| `sky_twilight` | 4px | 11% overlay | +12% | Sunset kleuren verrijkt |
| `sky_night` | 1.5px | 6% | +5% | Sterren scherp houden |
| `sky_storm` | 5px | 13% | +6% | Chaotische wolken |
| `terrain` | 4.5px | 12% | +10% | Organische grondtextuur |
| `terrain_indoor` | 2px | 8% | +5% | Al zeer gedetailleerd |
| `character` | 1.8px | 7% soft-light | +6% | Gezicht leesbaar |

**Status:** Gebouwd en werkend. Effecten zijn zichtbaar maar moeten visueel geëvalueerd worden in Remotion Studio.

### Kwaliteitstools

| Component | Wat het doet | Waar |
|-----------|-------------|------|
| `HorizonMatcher` | Atmosferische blending sky↔terrain: haze band, light spill, dust particles. 10 mood presets. | `src/motor/HorizonMatcher.tsx` |
| `CombinedShowcase` | 15 curated sky+terrain combos met HorizonMatcher. Test visuele cohesie. | `src/videos/CombinedShowcase.tsx` |
| `ComparisonShowcase` | Raw vs painted side-by-side met sliding divider. Test paint effect kwaliteit. | `src/videos/ComparisonShowcase.tsx` |

**Horizon moods:** day_warm, day_cool, dawn, sunset_warm, sunset_cold, dusk, night, storm, sand, indoor

**withAssetPaint verbeteringen:**
- Geanimeerde grain seed — canvas textuur verandert per frame (levend effect, als olieverf die licht vangt)
- Impasto highlight — emboss-achtige lichtval op dikke verf bij hoge-contrast randen (alleen bij displacement ≥ 3px)

**Render commando's voor kwaliteitstools:**
```bash
# Sky + terrain cohesie test (75 sec)
npx remotion render src/index.ts Combined-Showcase out/combined-showcase.mp4

# Raw vs painted vergelijking (50 sec)
npx remotion render src/index.ts Comparison-Showcase out/comparison-showcase.mp4
```

**Status:** Klaar om te renderen en visueel te evalueren. Volgende sessie: render en evalueer, daarna vegetation.

---

## Quick Reference: New Files to Create

| File | Phase | Purpose |
|------|-------|---------|
| `src/motor/PositionPresets.ts` | 0.5 | x/y/scale/zIndex definitions for scene placement |
| `src/motor/AssetManifest.ts` | 1.9 | JSON catalog of all library assets |
| `src/motor/QualityGates.ts` | 3.3 | Automated quality validation |
| `src/motor/SrtExporter.ts` | 4.5 | SRT subtitle file generation |
| `src/library/` | 1.x | All asset library components (skies, terrains, etc.) |
| `data/feedback/rules.json` | 3.4 | Feedback rules storage |

---

## How to Continue

1. Open a new chat session
2. Say: "Check docs/PROJECT-STATE.md — waar staan we en wat moeten we doen?"
3. The AI reads this file, sees the current state, and picks up from the first ⬜ step
4. After completing steps, update this file's status indicators
5. Commit updated PROJECT-STATE.md after each session

### Status Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Done
- ⛔ Blocked (with reason noted)
