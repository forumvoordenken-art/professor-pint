# Professor Pint - Project State Document

> Last updated: 2026-02-11
> Branch: `claude/automate-professor-pint-yJ69L`
> Environment: GitHub Codespaces (paths may be `/workspaces/professor-pint` or `/home/user/professor-pint`)

## Project Overview

**Professor Pint** is an automated animated YouTube video pipeline built with **Remotion 4.0** (React + TypeScript). It generates SVG-animated educational videos featuring an eccentric, Einstein-like professor who explains financial concepts in a pub setting. All characters, backgrounds, and animations are hand-coded SVG rendered frame-by-frame at **30fps, 1920x1080**.

### Primary Language: Dutch (Nederlands)

---

## Architecture

```
src/
├── animations/          # Animation systems
│   ├── emotions.ts      # 6 emotion states with smooth transitions
│   ├── idle.ts          # Breathing, blinking, sway animations
│   └── talking.ts       # Mouth shapes, phoneme-based lip sync
├── backgrounds/         # SVG background scenes (each ~400-800 lines)
│   ├── Pub.tsx          # Classic pub interior with chalkboard
│   ├── Classroom.tsx    # Academic setting
│   ├── Pyramids.tsx          # Giza pyramids at dusk (+ CrowdLayer)
│   ├── DesertConstruction.tsx # Pyramid construction site (+ CrowdLayer)
│   ├── InsidePyramid.tsx     # Dark tomb interior (+ CrowdLayer)
│   ├── NileRiver.tsx         # Nile riverside with boats (+ CrowdLayer)
│   ├── WorkersVillage.tsx    # Ancient worker settlement (+ CrowdLayer)
│   └── SphinxView.tsx        # Great Sphinx close-up (+ CrowdLayer)
├── characters/          # SVG character components
│   ├── ProfessorPint.tsx     # Main character (~1200 lines SVG)
│   ├── AverageJoe.tsx        # Supporting character
│   ├── Pharaoh.tsx           # Egypt-themed character
│   └── Worker.tsx            # Egypt-themed character
├── crowds/              # NEW - Animated crowd mini-figures
│   └── CrowdWorkers.tsx      # 12 figure types + CrowdLayer + CROWD_CONFIGS
├── systems/             # Core rendering systems
│   ├── SceneRenderer.tsx     # Main scene renderer (reads SceneData[])
│   ├── Camera.tsx            # Static camera with smooth transitions
│   ├── CameraPath.tsx        # NEW - Keyframe camera system (12 presets)
│   ├── Subtitles.tsx         # Animated subtitle overlay
│   ├── Transitions.tsx       # Scene transition effects
│   ├── AudioSync.tsx         # Audio playback + lip sync
│   ├── MusicSFX.tsx          # Background music + sound effects
│   └── Overlays.tsx          # Data cards, charts overlay system
├── pipeline/            # Video generation pipeline
│   ├── ScriptGenerator.ts    # Template-based script generation
│   ├── LLMClient.ts          # OpenAI/Claude API integration
│   ├── VideoPipeline.ts      # Orchestrates full render pipeline
│   ├── FeedbackStore.ts      # NEW - Self-learning feedback system
│   ├── StyleGuide.ts         # NEW - Professor Pint voice/personality
│   ├── SceneDatabase.ts      # NEW - Scene storage for reuse
│   └── N8nPipeline.ts        # NEW - n8n webhook integration
├── Root.tsx             # Remotion composition definitions
└── index.ts             # Entry point
```

---

## What Was Built (This Session)

### 1. Animated Crowd Workers (`src/crowds/CrowdWorkers.tsx`)
- **12 animated SVG mini-figure types**: StonePuller, StoneCarrier, ChiselWorker, WaterCarrier, Overseer, FanBearer, SeatedFigure, KneelingFigure, Rower, Baker, Sweeper
- `CrowdLayer` component renders a config of figures
- `CROWD_CONFIGS` record with pre-built configs per Egypt background:
  - pyramids: 9 figures
  - desertConstruction: 14 figures
  - insidePyramid: 6 figures
  - nileRiver: 10 figures
  - workersVillage: 10 figures
  - sphinxView: 6 figures
- Each figure uses `sineWave()` for animation cycles

### 2. Keyframe Camera System (`src/systems/CameraPath.tsx`)
- `CameraPathData` interface with keyframes + character tracking
- 12 camera presets: static, slowZoomIn, slowZoomOut, panLeftToRight, panRightToLeft, tiltDown, tiltUp, establishingShot, dramaticZoom, followCharacter, sweepingPan, revealDown
- `suggestCameraPreset()` maps beat types to appropriate presets
- Smooth entry transitions from previous scene's camera
- Integrated into `SceneRenderer.tsx` (conditionally uses CameraPath or Camera fallback)

### 3. Self-Learning Feedback System (`src/pipeline/FeedbackStore.ts`)
- `FeedbackRule` with category, severity (must/should/nice), rule text
- `StyleProfile` with tone, visual, camera preferences + never/always lists
- Default style profile pre-filled with Dutch guidelines
- `buildFeedbackPrompt()` generates LLM-injectable prompt sections
- Stores at `data/feedback.json`

### 4. Style Guide (`src/pipeline/StyleGuide.ts`)
- `PROFESSOR_PINT_VOICE` with personality traits and tone markers (NL + EN)
- `buildScriptSystemPrompt()` and `buildDialogueSystemPrompt()` for LLM
- `generateVideoMetadata()` for YouTube (title, description, tags)
- `applyStyleConsistency()` for text post-processing

### 5. Scene Database (`src/pipeline/SceneDatabase.ts`)
- Store/find/rate/delete scenes with JSON persistence
- `buildSceneSummaryForLLM()` for scene reuse context
- Stores at `data/scenes.json`

### 6. n8n Pipeline (`src/pipeline/N8nPipeline.ts`)
- `processN8nWebhook()`: topic -> full video generation
- `applyCameraPaths()`: auto-assigns camera presets by beat type
- `buildLLMContext()`: combines all context for LLM prompts
- `healthCheck()` endpoint

### 7. Modified Existing Files
- All 6 Egypt backgrounds: added `CrowdLayer` + `CROWD_CONFIGS` import/render
- `SceneRenderer.tsx`: added CameraPath support with conditional rendering

---

## Known Issues & TODO

### Critical
1. **CrowdLayer SVG rendering**: The crowd figures render SVG elements (`<g>`, `<line>`, etc.) inside parent SVG backgrounds. Needs visual verification in Remotion Studio that this renders correctly (SVG-inside-SVG).
2. **FeedbackStore + SceneDatabase use Node.js `fs` module**: These will NOT work in browser/Remotion Studio context. They only work in Node.js pipeline scripts. Consider using a different storage approach for browser compatibility.

### High Priority
3. **ElevenLabs audio integration**: User has API key, wants to create a reference video with audio. The `AudioSync.tsx` system is ready but no TTS generation is wired up yet.
4. **CameraPath not used in existing compositions**: The `Pyramids-of-Giza` composition in Root.tsx was built before CameraPath existed. Update compositions to include `cameraPath` in their SceneData.
5. **Verify Remotion Studio displays updates**: After the new code, run `npx remotion studio` to confirm everything renders.

### Medium Priority
6. **Pub and Classroom backgrounds**: No crowd workers added yet (only Egypt backgrounds have them). Pub could have bar patrons, Classroom could have students.
7. **LLM integration testing**: The LLMClient and StyleGuide need testing with actual API keys.
8. **n8n pipeline testing**: No webhook server exists yet - N8nPipeline is the logic layer only.

---

## How to Run

```bash
# Start Remotion Studio (development preview)
npx remotion studio

# Type check
npx tsc --noEmit

# Render a specific composition
npx remotion render src/index.ts ProfessorPint-Pyramids-of-Giza out/pyramids.mp4
```

---

## Compositions Available (defined in Root.tsx)

- `ProfessorPint-Pub` - Pub scene (60s)
- `ProfessorPint-Pyramids-of-Giza` - Egypt pyramid scene (720s / 12 min, 55 scenes)
- `ProfessorPint-Full-Pipeline` - Full pipeline demo

---

## User Preferences

- **Language**: Dutch (NL) primary, English secondary
- **Style**: Casual, pub atmosphere, beer metaphors, street language mixed with academic vocab
- **Visual**: Not minimalistic - wants detailed, lively scenes with many animated figures
- **Camera**: Dynamic movement within scenes, professor always in frame
- **Feedback**: Give once, remember forever (self-learning system)
- **Goal**: Fully automated YouTube pipeline: topic -> script -> render -> upload via n8n

---

## Next Steps (User's Roadmap)

1. **Verify visual output** - Run Remotion Studio and check crowd workers + camera movements
2. **ElevenLabs integration** - Wire up TTS to create reference video with audio
3. **Use Egypt as reference** - Once Egypt looks perfect, apply same patterns to other themes
4. **Test full pipeline** - Run N8nPipeline with a topic end-to-end
5. **n8n webhook server** - Create Express/Fastify server wrapper around N8nPipeline
