# Professor Pint - Project Instructions

> **Lees dit bestand ALTIJD eerst bij een nieuwe sessie.**

## Git Workflow

### Branch
- **Development branch**: `claude/automate-professor-pint-yJ69L`
- Elke nieuwe chatsessie krijgt een eigen branch-naam toegewezen. **Negeer die.** Werk ALTIJD op bovenstaande branch.
- Push altijd met: `git push -u origin claude/automate-professor-pint-yJ69L`

### Before pulling from remote
Altijd stashen voor je pullt:

```bash
git stash
git pull origin claude/automate-professor-pint-yJ69L --rebase
git stash pop
```

Dit voorkomt de `error: cannot pull with rebase: You have unstaged changes` fout.

---

## Project Overview

**Professor Pint** is een geautomatiseerde YouTube-videopipeline gebouwd met **Remotion 4.0** (React + TypeScript). Het genereert SVG-geanimeerde educatieve video's met een excentrieke, Einstein-achtige professor die financiële concepten uitlegt in een pub-setting. Alle characters, backgrounds en animaties zijn handgeschreven SVG, gerenderd frame-by-frame op **30fps, 1920x1080**.

### Taal: Nederlands (primair), Engels (secundair)

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
├── crowds/              # Animated crowd mini-figures
│   └── CrowdWorkers.tsx      # 12 figure types + CrowdLayer + CROWD_CONFIGS
├── systems/             # Core rendering systems
│   ├── SceneRenderer.tsx     # Main scene renderer (reads SceneData[])
│   ├── Camera.tsx            # Static camera with smooth transitions
│   ├── CameraPath.tsx        # Keyframe camera system (12 presets)
│   ├── Subtitles.tsx         # Animated subtitle overlay
│   ├── Transitions.tsx       # Scene transition effects
│   ├── AudioSync.tsx         # Audio playback + lip sync
│   ├── MusicSFX.tsx          # Background music + sound effects
│   └── Overlays.tsx          # Data cards, charts overlay system
├── pipeline/            # Video generation pipeline
│   ├── ScriptGenerator.ts    # Template-based script generation
│   ├── LLMClient.ts          # OpenAI/Claude API integration
│   ├── VideoPipeline.ts      # Orchestrates full render pipeline
│   ├── FeedbackStore.ts      # Self-learning feedback system
│   ├── StyleGuide.ts         # Professor Pint voice/personality
│   ├── SceneDatabase.ts      # Scene storage for reuse
│   └── N8nPipeline.ts        # n8n webhook integration
├── Root.tsx             # Remotion composition definitions
└── index.ts             # Entry point
```

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

## Compositions (in Root.tsx)

- `ProfessorPint-Pub` - Pub scene (60s)
- `ProfessorPint-Pyramids-of-Giza` - Egypt pyramid scene (720s / 12 min, 55 scenes)
- `ProfessorPint-Full-Pipeline` - Full pipeline demo

---

## Known Issues

### Critical
1. **CrowdLayer SVG rendering**: Crowd figures renderen SVG inside parent SVG backgrounds. Visueel verifiëren in Remotion Studio.
2. **FeedbackStore + SceneDatabase gebruiken Node.js `fs`**: Werkt NIET in browser/Remotion Studio. Alleen in Node.js pipeline scripts.

### High Priority
3. **ElevenLabs audio**: User heeft API key. AudioSync.tsx is klaar maar TTS is nog niet aangesloten.
4. **CameraPath niet in bestaande compositions**: Pyramids compositie is gebouwd voor CameraPath bestond.

### Medium Priority
5. **Pub/Classroom backgrounds**: Nog geen crowd workers (alleen Egypt heeft ze).
6. **LLM integration testing**: LLMClient en StyleGuide testen met echte API keys.
7. **n8n pipeline testing**: Geen webhook server - N8nPipeline is alleen de logica-laag.

---

## User Preferences

- **Taal**: Nederlands primair, Engels secundair
- **Stijl**: Casual, pub-sfeer, bier-metaforen, straattaal gemixed met academisch
- **Visueel**: Niet minimalistisch - gedetailleerde, levendige scenes met veel geanimeerde figuren
- **Camera**: Dynamische beweging, professor altijd in beeld
- **Feedback**: Geef eenmaal, onthoud voor altijd (self-learning system)
- **Doel**: Volledig geautomatiseerde YouTube pipeline: topic -> script -> render -> upload via n8n

---

## Next Steps (Roadmap)

1. Visuele output verifiëren in Remotion Studio (crowd workers + camera)
2. ElevenLabs TTS integratie
3. Egypt als referentie gebruiken, dan patronen toepassen op andere thema's
4. Full pipeline testen met een topic end-to-end
5. n8n webhook server (Express/Fastify wrapper)
