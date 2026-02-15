# LEGACY_KNOWLEDGE.md — Professor Pint Archive

> **Archived:** 2026-02-15
> **Reason:** Transition from experimental codebase to "Digital Puppet" architecture (PNG Rigs + JPG Backgrounds)

---

## 1. Project Vision

**Professor Pint** is an educational YouTube channel featuring a fictional professor character (tweed jacket, glasses, pint glass in hand) who explains complex topics from a pub setting.

- **Visual quality target:** Kurzgesagt / TED-Ed level
- **Language:** English narration, Dutch internal communication
- **Tone:** Casual pub atmosphere, beer metaphors, accessible education
- **First video:** "The History of Money" — 10:50 min, 42 scenes, ~1400 spoken words

The video follows Professor Pint through 6 acts spanning from prehistoric barter to Bitcoin, with 18 unique characters and ~108 unique visual assets across diverse historical settings.

---

## 2. What We Tried (Technical Lessons)

### 2.1 Rive Character Animation
- **What:** Skeletal animation via `@remotion/rive` and `.riv` files
- **Status:** Component (`RiveCharacter.tsx`) was built but never used — no `.riv` files were ever produced
- **`RiveIntegration.tsx`** in the motor had placeholder code with emotion mapping, blink timing, and breath cycles
- **Lesson:** Rive requires significant upfront rigging time (2-4 hours per character). The pipeline from ChatGPT parts → Rive rigging → `.riv` export was never completed end-to-end

### 2.2 Procedural SVG Character (ProfessorPint.tsx)
- **What:** ~1600 lines of inline SVG with 70+ named colors, gradients, detailed face/body/clothing
- **Features:** Emotion system (12 states), idle animations (breathing, blinking, sway), talking mouth shapes, gesture system
- **Lesson:** Extremely detailed but unmaintainable. Every visual tweak requires deep code changes. Not scalable to 18 characters

### 2.3 Oil Paint / Painterly Effects
- **What:** `withAssetPaint.tsx` (466 lines) — HOC applying SVG filter displacement, canvas grain texture, saturation boost per asset category
- **Also:** `OilPaintFilter.tsx`, `PaintEffect.tsx`, `TextureOverlay.tsx`
- **Lesson:** Technically impressive but added complexity without producing final frames. Filter-based effects are computationally expensive and hard to control consistently

### 2.4 Scene Composer / Motor Engine
- **What:** Layered scene composition system with 10 layer types (sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting)
- **Components:** `SceneComposer.tsx`, `AssetMetadata.ts`, `PositionPresets.ts`, `Camera.tsx`, `CameraPath.tsx`, `HorizonMatcher.tsx`, `SceneRenderer.tsx`, `Transitions.tsx`, `Subtitles.tsx`
- **Lesson:** Over-engineered abstraction layer. Built infrastructure for a production pipeline that never produced a single animated scene

### 2.5 Motion Canvas (Parallel Experiment)
- **What:** Entirely separate implementation in `/motion-canvas/` duplicating pub exterior/interior scenes
- **Lesson:** Running two animation frameworks in parallel created confusion and split effort. Neither reached production quality

### 2.6 Walker Components (Sprite/SVG experiments)
- **`SpriteWalker.tsx`:** 8x6 spritesheet (48 frames) from Ludo.ai — quick but limited control
- **`SVGWalker.tsx`:** Hybrid ChatGPT SVG parts + procedural arms/dog — creative but fragile
- **`WalkingCharacter.tsx`:** Fully procedural SVG boy+dog with skeletal walk cycle — impressive but time-consuming per character

---

## 3. Narrative Elements (Saved)

### 3.1 Video Structure: "The History of Money"

**Full production spec:** `docs/videos/001-history-of-money.md` (preserved in docs/)

**Act breakdown:**
| Act | Scenes | Setting | Topic |
|-----|--------|---------|-------|
| INTRO | 1-3 | Pub exterior → interior | Professor introduces topic |
| ACT 1 | 4-9 | Savanna → Mesopotamia | The Barter Myth |
| ACT 2 | 10-15 | Maldives → Africa | Cowrie Shells as money |
| ACT 3 | 16-20 | Lydia → Greece | First coins |
| ACT 4 | 21-28 | Roman Empire | Rome's inflation |
| ACT 5 | 29-33 | China → Medieval Europe | Paper money invention |
| ACT 6 | 34-38 | Modern world | Digital/crypto money |
| OUTRO | 39-42 | Back to pub | Conclusion + call to action |

### 3.2 Scene Composition (from HistoryOfMoney.tsx)

The main composition sequenced scenes with a barn-door transition:
```
Scene 1: Pub Exterior (300 frames / 10 sec) — Night establishing shot
  → DoorTransition (90 frames / 3 sec) — Zoom into pub door + barn-door iris
Scene 2: Pub Interior (510 frames / 17 sec) — Camera pushes toward Professor
```

**DoorTransition phases:**
1. Frames 0-40: Zoom exterior 1.0→2.8x into door, black bars close from sides
2. Frames 40-55: Full black hold
3. Frames 55-90: Black bars open revealing interior

### 3.3 Scene Details (Built)

**PubExteriorScene (381 lines):**
- Background: `pub-exterior-full.svg`
- Animated overlays: 40 twinkling stars, moon glow, 2 street lamp glows, window reflections, chimney smoke (18 puffs), dust motes (30 particles), ground fog (25 ellipses), pub lantern glows, vignette + color grading

**PubInteriorScene (232 lines):**
- Background: `pub-interior-full.svg`
- Slow zoom 1.0→1.08 toward Professor
- Animated overlays: 3 lantern glows, bar counter reflection, floating dust (20 particles), vignette + color grading

### 3.4 Animation Systems (Built but unused in production)

**Emotion system** (12 states):
neutral, happy, shocked, thinking, angry, sad, excited, confused, proud, whisper, dramatic, skeptical
Each with: eye scale/offset, brow rotation, mouth curve/width, blush intensity, head tilt

**Idle animations:**
- Breathing: ~0.5Hz vertical oscillation
- Blinking: deterministic intervals (2-6 sec), 5-frame blink curve
- Body sway: two-frequency sine wave
- Pupil micro-movements
- Beer sway in glass

**Talking:**
- 4 mouth shapes (closed → wide open)
- Multi-frequency sine waves for syllable/word/sentence rhythm
- Phoneme-to-mouth-shape mapping (prepared but no audio data)
- Talking bounce + free hand gestures

**Gestures:**
Named: idle, wave, point, shrug, explain, cheers
Per-gesture arm rotations with 30-frame cycles and 8-frame ease-out entry

### 3.5 Asset Master List (from production doc)

| Category | Count | Examples |
|----------|-------|---------|
| Skies | 7 | indoor-pub, day-clear, sunset, tropical, misty, storm, night-stars |
| Terrains | 9 | pub-wood, savanna, desert, tropical-beach, roman-cobblestone, modern-asphalt |
| Water | 2 | calm ocean, river |
| Structures | 15 | pub-bar, prehistoric-hut, roman-forum, chinese-pagoda, bitcoin-cafe |
| Vegetation | 7 | oak, palm, bamboo, olive, dead tree |
| Characters | 18 | Professor Pint (hero) + 17 historical figures |
| Crowd figures | 12 | Era-specific background characters |
| Props | 19 | Coins, shells, tablets, pint glass |
| Foreground | 5 | Framing elements |
| Atmosphere | 6 | Dust, mist, light rays, embers |
| Lighting | 5 | Scene-specific overlays |
| **Total** | **~108** | |

---

## 4. Architecture Shift

### What We're Abandoning
- **Motion Canvas** — Parallel framework experiment, never integrated
- **Rive skeletal animation** — Too complex a pipeline for current needs
- **Procedural SVG characters** — Unmaintainable at scale (1600 lines per character)
- **Generative SVG assets** — Over-engineered scene composition engine
- **Oil paint filters** — Computationally expensive, inconsistent results
- **Motor engine** — Premature abstraction (SceneComposer, AssetMetadata, CameraPath, etc.)

### What We're Adopting: "Digital Puppet" Architecture
- **PNG Rigs** — Pre-rendered character parts (head, torso, arms, legs) as PNG images
- **JPG Backgrounds** — Pre-rendered scene backgrounds, not procedural SVG
- **Remotion interpolation** — Simple transform animations (position, rotation, scale, opacity)
- **React components** — One component per scene, straightforward composition
- **No runtime rendering** — All visual assets pre-made, code only handles motion and timing

### Why This Works
1. **Faster production:** Assets come ready-made, no SVG surgery
2. **Visual consistency:** All visuals from same AI generation pipeline
3. **Simpler code:** Scene = background + positioned puppets with interpolated transforms
4. **Scalable:** Adding a character = adding PNG files, not 1600 lines of SVG code
5. **Maintainable:** Non-programmers can update visuals by replacing image files

---

## 5. Files Preserved

| File/Directory | Status |
|---------------|--------|
| `docs/videos/001-history-of-money.md` | **KEPT** — Full production script |
| `docs/PROJECT-STATE.md` | **KEPT** — Project status reference |
| `docs/CHARACTER-ANIMATION-COMPARISON.md` | **KEPT** — Decision rationale |
| `public/assets/scenes/*.svg` | **KEPT** — Existing scene backgrounds |
| `public/actors/` | **KEPT** — Existing actor images |
| `CLAUDE.md` | **TO UPDATE** — Needs new architecture instructions |
| `LEGACY_KNOWLEDGE.md` | **NEW** — This file |

## 6. Files Deleted

| File/Directory | Reason |
|---------------|--------|
| `motion-canvas/` | Abandoned parallel experiment |
| `src/animaties/` | Procedural animation system (replaced by puppet transforms) |
| `src/assets/` | Procedural SVG generation code |
| `src/components/` | Old components (Rive, Stage, Walkers) |
| `src/compositions/` | Old scene compositions |
| `src/motor/` | Over-engineered render engine |
| `src/personages/` | 1600-line procedural SVG character |
| `src/videos/` | Old scene implementations |
| `src/index.ts` | Replaced with fresh skeleton |
| `src/Root.tsx` | Replaced with fresh skeleton |
