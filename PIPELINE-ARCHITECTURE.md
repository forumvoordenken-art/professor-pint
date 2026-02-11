# Professor Pint — Pipeline Architecture v2.0

> **End-to-end flow: Topic → YouTube-published video.**
> Built on the Asset Library system (see VIDEO-SPEC.md Section 4).

---

## Table of Contents

1. [Pipeline Overview](#1-pipeline-overview)
2. [Step 1: Input](#2-step-1-input)
3. [Step 2: Script Generation (LLM)](#3-step-2-script-generation)
4. [Step 3: Scene Composition (from Asset Library)](#4-step-3-scene-composition)
5. [Step 4: Quality Gates](#5-step-4-quality-gates)
6. [Step 5: Audio Generation](#6-step-5-audio-generation)
7. [Step 6: Assembly](#7-step-6-assembly)
8. [Step 7: Preview & Approval](#8-step-7-preview--approval)
9. [Step 8: Full Render](#9-step-8-full-render)
10. [Step 9: YouTube Metadata & Subtitles](#10-step-9-youtube-metadata--subtitles)
11. [Step 10: Upload & Publish](#11-step-10-upload--publish)
12. [n8n Orchestration](#12-n8n-orchestration)
13. [Asset Library Build Phase](#13-asset-library-build-phase)
14. [Infrastructure & Costs](#14-infrastructure--costs)
15. [Error Handling](#15-error-handling)
16. [File & Directory Structure](#16-file--directory-structure)

---

## 1. Pipeline Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. INPUT    │───▶│ 2. SCRIPT    │───▶│ 3. COMPOSE   │───▶│ 4. QUALITY   │
│  Topic +     │    │ LLM generates│    │ Select assets│    │ Automated    │
│  Sources     │    │ SceneData[]  │    │ from library │    │ checks       │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                   │
                                                          ┌────────▼───────┐
┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │ 5. AUDIO      │
│ 10. PUBLISH  │◀───│ 9. METADATA  │◀───│ 8. RENDER    │◀─│ TTS + Music   │
│ YouTube      │    │ + Subtitles  │    │ Remotion     │  │ + SFX         │
│ (manual OK)  │    │ + Thumbnail  │    │ 1080p/30fps  │  └───────────────┘
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               ▲
                                       ┌───────┴───────┐
                                       │ 7. PREVIEW    │
                                       │ 480p → n8n    │
                                       │ → User OK?    │
                                       └───────┬───────┘
                                               ▲
                                       ┌───────┴───────┐
                                       │ 6. ASSEMBLY   │
                                       │ Compose +     │
                                       │ Audio bind    │
                                       └───────────────┘
```

**Key difference from v1.0:** Step 3 is now "compose from library" instead of "generate SVG from scratch." This cuts cost by ~70% and guarantees visual quality.

---

## 2. Step 1: Input

### Input Format (provided via n8n schedule or manual trigger)

```typescript
interface PipelineInput {
  topic: string;
  sources: Array<{
    title: string;
    url?: string;
    content: string;    // Full text of the source
  }>;
  targetMinutes?: number;  // Default: 12
  notes?: string;          // Special instructions for this video
  scheduledPublishDate?: string;  // ISO 8601
}
```

### Source Requirements
- Minimum 1 source, recommended 3-5.
- Sources must contain enough factual information for the target duration.
- LLM must NOT fabricate facts beyond the provided sources.

---

## 3. Step 2: Script Generation

### LLM Provider
- **Primary**: Claude (Anthropic) — best for structured output and long-form content.
- **Fallback**: OpenAI GPT-4.

### Prompt Architecture (3-Layer System)

```
LAYER 1: System Prompt (constant, included in every call)
├── VIDEO-SPEC.md (full spec)
├── Active feedback rules (from FeedbackStore)
├── Asset library manifest (list of all available assets with descriptions)
└── Character library (available characters per theme)

LAYER 2: Task Prompt (per-video)
├── Topic description
├── Source material (full text)
├── Target duration
└── User notes (if any)

LAYER 3: Output Format (constant)
├── Required JSON schema (ScriptOutput)
├── Example scene (from reference video)
└── Quality gate checklist (LLM self-checks before output)
```

### LLM Output

```typescript
interface ScriptOutput {
  /** Complete scene array — each scene references library assets */
  scenes: SceneData[];

  /** Composed backgrounds for each scene (library asset references) */
  compositions: Array<{
    sceneId: string;
    composed: ComposedScene;  // See VIDEO-SPEC.md Section 5.1
  }>;

  /** Any NEW assets needed that don't exist in the library */
  missingAssets: Array<{
    id: string;
    category: string;          // "structures/roman", "vegetation", etc.
    description: string;       // What it should look like
    priority: 'required' | 'nice-to-have';
  }>;

  /** Crowd configurations per scene */
  crowds: Array<{
    sceneId: string;
    config: CrowdConfig;
  }>;

  /** Music direction */
  musicDirection: {
    genre: string;
    mood: string;
    instruments: string[];
    tempo: 'slow' | 'medium' | 'fast';
  };

  /** YouTube metadata */
  metadata: {
    title: string;
    description: string;
    tags: string[];
    thumbnailConcept: string;
  };
}
```

### Asset Manifest (Provided to LLM)

The LLM receives a manifest of all available assets:

```json
{
  "skies": ["sunset_warm", "sunset_cold", "day_clear", "day_cloudy", "night_stars", "night_moon", "dawn_golden", "storm_dark", "sandstorm"],
  "terrain": ["sand_flat", "sand_dunes", "sand_riverbank", "grass_plain", "grass_hill", ...],
  "water": ["river_calm", "river_rapid", "lake_still", "ocean_waves", ...],
  "vegetation": ["palm_tree_tall", "palm_tree_short", "oak_tree", ...],
  "structures": {
    "egypt": ["pyramid_great", "pyramid_small", "sphinx", "obelisk", ...],
    "aztec": ["templo_mayor", "pyramid_stepped", "chinampa", ...],
    "roman": ["colosseum", "forum", "aqueduct_roman", ...],
    ...
  },
  "characters": {
    "permanent": ["professorPint"],
    "egypt": ["pharaoh", "royal_guard", "scribe", "worker", ...],
    ...
  },
  "crowd_figures": {
    "egypt": ["worker_carrying", "worker_pulling", "guard_standing", ...],
    ...
  },
  "atmosphere": ["dust_particles", "embers", "mist_low", ...],
  "lighting": ["vignette_dark", "vignette_warm", "vignette_cold", ...],
  "foreground": ["column_left", "arch_frame", "foliage_left", ...]
}
```

The LLM can ONLY reference assets that exist in this manifest. If something is missing, it goes in `missingAssets`.

---

## 4. Step 3: Scene Composition

### From Library (Primary Path — ~95% of scenes)

1. Parse each scene's `ComposedScene` definition
2. Verify all referenced assets exist in the library
3. Load the corresponding React components
4. Generate the SceneComposer configuration

### Missing Assets (Rare — ~5% of scenes)

If `missingAssets` is not empty:
1. For `required` assets: LLM generates SVG following the standard AssetProps interface
2. Quality gate validates the new asset (VIDEO-SPEC.md Section 13.2)
3. If PASS: asset is saved to the library for future reuse
4. If FAIL after 3 attempts: substitute with closest existing asset + flag for manual creation later
5. For `nice-to-have` assets: substitute with closest existing asset

---

## 5. Step 4: Quality Gates

Automated validation as defined in VIDEO-SPEC.md Section 13.

```
For each scene:
  → Scene Composition Quality Gate (Section 13.3)
  → Pass? Continue. Fail? Regenerate scene with feedback.

For the full video:
  → Full Video Quality Gate (Section 13.4)
  → Pass? Continue. Fail? Regenerate specific failed sections.

Max 3 regeneration attempts per component. After 3 fails → flag for user review.
```

---

## 6. Step 5: Audio Generation

### 6.1 TTS (ElevenLabs)

1. Extract all `subtitle` texts from scenes where `talking: true`
2. Send each subtitle to ElevenLabs API
3. Receive audio files (.mp3) with timing data
4. Map phonemes to mouth shapes for lip sync
5. Adjust scene durations to match actual audio length (audio is truth, scenes flex)

```typescript
interface AudioPipelineOutput {
  segments: Array<{
    sceneId: string;
    audioFile: string;
    startFrame: number;
    endFrame: number;
    phonemes: Array<{
      time: number;
      phoneme: string;
      mouthShape: 'closed' | 'open' | 'wide' | 'rounded';
    }>;
  }>;
  totalDurationFrames: number;
}
```

### 6.2 Music

Based on `musicDirection`:
1. Select from music library (royalty-free / AI-generated)
2. Source: [TO BE DETERMINED]
3. Mix at -18dB relative to voice
4. Crossfade between tracks at scene transitions (2-second fade)

### 6.3 SFX

Based on `sfx` entries in SceneData:
1. Map SFX type to audio files from library
2. Mix at -12dB relative to voice
3. Loop ambient SFX (wind, crowd murmur) for scene duration

---

## 7. Step 6: Assembly

### Dynamic Composition File

The pipeline generates a Remotion composition file:
1. Imports ProfessorPint (permanent) + all referenced theme characters
2. Imports all referenced library assets
3. Configures SceneComposer for each scene
4. Binds audio segments to the timeline
5. Registers as new Composition in Root.tsx

```typescript
// Auto-generated: src/compositions/generated/ProfessorPint-[Topic]-[Date].tsx
const VideoComposition: React.FC = () => {
  return (
    <SceneRenderer
      scenes={generatedScenes}
      audioSegments={generatedAudio}
      musicTracks={selectedMusic}
      sfx={selectedSFX}
    />
  );
};
```

---

## 8. Step 7: Preview & Approval

### Low-Resolution Preview
- Render at **480p** (854x480) at **15fps** → ~1/8th the time of full render
- Upload to cloud storage
- n8n sends notification with preview link

### Approval Flow (via n8n)

```
n8n sends preview link → User watches preview
  → Clicks "Approve" in n8n        → Proceed to full render
  → Clicks "Feedback" in n8n       → Enters feedback text → stored in FeedbackStore → regenerate
  → Clicks "Reject" in n8n         → Feedback stored → pipeline ends
```

**No separate dashboard needed.** The n8n workflow has built-in approval buttons (Wait for Approval node) that the user clicks.

---

## 9. Step 8: Full Render

### Render Command

```bash
npx remotion render src/index.ts ProfessorPint-[Topic]-[Date] \
  --output out/[topic]-[date].mp4 \
  --codec h264 \
  --image-format jpeg \
  --quality 90
```

### Render Settings

| Setting | Value |
|---------|-------|
| Resolution | 1920x1080 |
| FPS | 30 |
| Codec | H.264 |
| Quality | 90 |
| Audio | AAC 192kbps |
| Est. render time | 20-60 min (faster with asset library — less complex SVG per frame) |
| Output | .mp4 |

---

## 10. Step 9: YouTube Metadata & Subtitles

### Generated in Step 2, finalized here:
- **Title**: Hook + "| Professor Pint" (see VIDEO-SPEC.md Section 14)
- **Description**: With timestamps auto-generated from topicCard overlays
- **Tags**: 15-20 relevant tags
- **Thumbnail**: Composed from scene assets + Professor shocked face + bold text

### SRT Subtitles
Auto-generated from SceneData subtitles:
```
1
00:00:02,000 --> 00:00:07,000
Grab a pint, because today we're going
to Ancient Egypt.
```
Uploaded alongside video as YouTube closed captions.

---

## 11. Step 10: Upload & Publish

### Upload (via n8n YouTube node)

```typescript
{
  videoFile: "out/pyramids-2026-02-15.mp4",
  thumbnail: "out/pyramids-2026-02-15-thumb.jpg",
  subtitles: "out/pyramids-2026-02-15.srt",
  title: "How 2.3 Million Stones Built a Wonder | Professor Pint",
  description: "...",
  tags: [...],
  categoryId: "27",          // Education
  privacyStatus: "private",  // ALWAYS private first
  language: "en"
}
```

### Publish Flow

```
Upload as PRIVATE → n8n notifies user → User reviews on YouTube
  → "Approve" in n8n → Set to PUBLIC or schedule publish date
  → "Reject" in n8n  → Keep private
```

**NEVER auto-publish as public.** Always manual approval.

---

## 12. n8n Orchestration

### n8n Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        n8n WORKFLOW                              │
│                                                                  │
│  TRIGGER: Schedule (cron) or Manual button                       │
│     │                                                            │
│     ▼                                                            │
│  [1] Read topic + sources from schedule database                 │
│     │                                                            │
│     ▼                                                            │
│  [2] Call Claude API: Generate ScriptOutput                      │
│     │  ├── System: VIDEO-SPEC + feedback rules + asset manifest  │
│     │  ├── User: topic + sources                                 │
│     │  └── Output: scenes + compositions + metadata              │
│     │                                                            │
│     ▼                                                            │
│  [3] Quality gates (automated Code node)                         │
│     │  └── Fail? → Regenerate specific sections (max 3x)        │
│     │                                                            │
│     ▼                                                            │
│  [4] Missing assets? → Generate + validate (rare)                │
│     │                                                            │
│     ▼                                                            │
│  [5] Call ElevenLabs: TTS for all subtitles                      │
│     │                                                            │
│     ▼                                                            │
│  [6] Select music + SFX from library                             │
│     │                                                            │
│     ▼                                                            │
│  [7] Assemble Remotion composition                               │
│     │                                                            │
│     ▼                                                            │
│  [8] Render preview (480p/15fps)                                 │
│     │                                                            │
│     ▼                                                            │
│  [9] Wait for Approval (n8n built-in)                            │
│     │  ├── APPROVE → Continue                                    │
│     │  ├── FEEDBACK → FeedbackStore → Go to [2]                  │
│     │  └── REJECT → FeedbackStore → End                          │
│     │                                                            │
│     ▼                                                            │
│ [10] Full render (1080p/30fps)                                   │
│     │                                                            │
│     ▼                                                            │
│ [11] Generate thumbnail + SRT subtitles                          │
│     │                                                            │
│     ▼                                                            │
│ [12] Upload to YouTube (PRIVATE)                                 │
│     │                                                            │
│     ▼                                                            │
│ [13] Wait for Publish Approval (n8n built-in)                    │
│     │  ├── APPROVE → Set PUBLIC / schedule date                  │
│     │  └── REJECT → Keep private                                 │
│     │                                                            │
│     ▼                                                            │
│ [14] Log result → Update schedule → Done                         │
└─────────────────────────────────────────────────────────────────┘
```

### n8n Nodes Used

| Node | Purpose |
|------|---------|
| Schedule Trigger | Weekly cron |
| Webhook | Manual trigger |
| HTTP Request | Claude API, ElevenLabs API |
| Code | Quality gates, composition assembly, asset manifest |
| Execute Command | Remotion render CLI |
| YouTube | Upload video |
| Wait for Approval | User approve/reject/feedback buttons |
| Slack/Email | Notifications |
| IF | Quality gate routing |

### Schedule Database

```typescript
interface VideoSchedule {
  id: string;
  topic: string;
  sources: Source[];
  scheduledDate: string;
  status: 'queued' | 'generating' | 'preview_ready' | 'approved' |
          'rendering' | 'rendered' | 'uploaded' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  feedback?: FeedbackEntry[];
  outputFile?: string;
  youtubeId?: string;
  previewUrl?: string;
}
```

---

## 13. Asset Library Build Phase

### Phase 1 — Universal Assets (~50 components)

These work for ANY video regardless of theme. Build first.

| Category | Count | Priority |
|----------|-------|----------|
| Skies | 9 | HIGH — needed for every scene |
| Terrain | 11 | HIGH — needed for every scene |
| Water | 8 | MEDIUM — needed for many scenes |
| Vegetation | 15 | MEDIUM — used frequently |
| Atmosphere | 11 | HIGH — needed for every outdoor scene |
| Lighting | 7 | HIGH — needed for every scene |
| Foreground | 8 | MEDIUM — used for framing |
| Generic structures | 7 | LOW — nice to have |
| Props | 12 | LOW — detail elements |

**Estimated effort:** Each universal asset is ~100-300 lines SVG. With fine-tuning in Remotion Studio: ~1-2 hours per asset. Total: ~50-100 hours for Phase 1.

### Phase 2 — First Theme: Egypt (~25 components)

| Category | Count |
|----------|-------|
| Structures (egypt/) | 12 |
| Characters | 10-15 |
| Crowd figures | 12 |

**Estimated effort:** ~50-75 hours. After Phase 2, we can produce complete Egypt videos.

### Phase 3+ — Additional Themes (~20-25 per theme)

Each new theme adds structures + characters + crowd figures. Universal assets are reused.

**Estimated effort per theme:** ~40-60 hours.

### Build Strategy

Assets can be built by:
1. **LLM generation + manual fine-tuning** — LLM generates first draft, human tweaks in Remotion Studio
2. **Manual creation** — for critical assets like pub_interior (home base)
3. **Extraction from existing code** — the current backgrounds can be decomposed into reusable components

The existing 16 backgrounds (~11,600 lines) contain excellent SVG elements that can be extracted into the asset library.

---

## 14. Infrastructure & Costs

### Required Services

| Service | Purpose | Cost |
|---------|---------|------|
| n8n (self-hosted) | Orchestration | Free |
| Claude API | Script generation + rare SVG generation | ~$3-8 per video (down from $15-30 with library) |
| ElevenLabs | TTS | ~$5-10 per video |
| Remotion | Rendering | Free (self-hosted) |
| Cloud storage | Previews | ~$5/month |
| YouTube API | Upload | Free |
| Server | n8n + render | VPS ~$20-40/month |

### Cost Per Video (with Asset Library)

| Step | Cost |
|------|------|
| Script generation (1 Claude call) | ~$2-5 |
| Missing asset generation (0-3 calls) | ~$0-3 |
| TTS (10 min audio) | ~$5-10 |
| Render (server time) | ~$1-2 |
| **Total per video** | **~$8-20** |

**Monthly (4 videos):** ~$32-80 content + ~$25-45 infrastructure = **~$60-125/month**

This is ~50% cheaper than v1.0 because the asset library eliminates most SVG generation calls.

### Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 8 GB | 16+ GB |
| Storage | 50 GB | 200+ GB |
| Node.js | 18+ | 20+ |

### Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...
N8N_WEBHOOK_URL=http://localhost:5678/webhook/professor-pint
RENDER_OUTPUT_DIR=/data/renders
PREVIEW_OUTPUT_DIR=/data/previews
ASSET_LIBRARY_DIR=src/assets
```

---

## 15. Error Handling

| Error | Action |
|-------|--------|
| LLM invalid JSON | Retry with "return ONLY valid JSON" (max 3x) |
| LLM quality gate fail | Regenerate with feedback from quality gate |
| LLM timeout | Retry with exponential backoff (2s, 4s, 8s) |
| Missing asset (library) | Substitute closest match, flag for later creation |
| ElevenLabs timeout | Retry with exponential backoff |
| ElevenLabs quota | Queue for later, notify user |
| Render OOM | Render in chunks, concatenate |
| Render crash (bad SVG) | Identify scene, flag for fix |
| 3 consecutive failures | Pause pipeline, notify user via n8n |

All errors are logged. Critical errors trigger n8n notification.

---

## 16. File & Directory Structure

```
professor-pint/
├── src/
│   ├── assets/                  # ASSET LIBRARY (see VIDEO-SPEC.md Section 4.2)
│   │   ├── skies/
│   │   ├── terrain/
│   │   ├── water/
│   │   ├── vegetation/
│   │   ├── structures/
│   │   │   ├── egypt/
│   │   │   ├── aztec/
│   │   │   ├── roman/
│   │   │   ├── viking/
│   │   │   ├── medieval/
│   │   │   ├── modern/
│   │   │   └── generic/
│   │   ├── props/
│   │   ├── atmosphere/
│   │   ├── lighting/
│   │   ├── foreground/
│   │   └── manifest.json        # Auto-generated list of all assets
│   │
│   ├── animations/              # Animation systems (PERMANENT)
│   │   ├── emotions.ts          # 12 emotion states
│   │   ├── activities.ts        # 16 activity animations (NEW)
│   │   ├── idle.ts
│   │   ├── talking.ts
│   │   ├── gestures.ts
│   │   └── easing.ts
│   │
│   ├── characters/              # Character library
│   │   ├── ProfessorPint.tsx    # PERMANENT
│   │   ├── egypt/               # Theme characters
│   │   ├── aztec/
│   │   ├── roman/
│   │   ├── viking/
│   │   └── modern/
│   │
│   ├── crowds/                  # Crowd figure library
│   │   ├── egypt/
│   │   ├── aztec/
│   │   └── roman/
│   │
│   ├── systems/                 # Core systems (PERMANENT)
│   │   ├── SceneRenderer.tsx
│   │   ├── SceneComposer.tsx    # NEW — renders ComposedScene from library assets
│   │   ├── Camera.tsx
│   │   ├── CameraPath.tsx
│   │   ├── Subtitles.tsx
│   │   ├── SrtExporter.ts       # NEW — generates .srt files
│   │   ├── Transitions.tsx
│   │   ├── AudioSync.tsx
│   │   ├── MusicSFX.tsx
│   │   └── Overlays.tsx
│   │
│   ├── pipeline/                # Pipeline logic (PERMANENT)
│   │   ├── ScriptGenerator.ts
│   │   ├── LLMClient.ts
│   │   ├── ElevenLabsTTS.ts
│   │   ├── VideoPipeline.ts
│   │   ├── FeedbackStore.ts
│   │   ├── SceneDatabase.ts
│   │   ├── StyleGuide.ts
│   │   ├── AssetManifest.ts     # NEW — generates manifest.json from library
│   │   ├── QualityGates.ts      # NEW — automated quality validation
│   │   └── N8nPipeline.ts
│   │
│   ├── compositions/
│   │   ├── PyramidsOfGiza.tsx   # Reference only
│   │   ├── AztekenVideo.tsx     # Reference only
│   │   └── generated/           # Auto-generated by pipeline
│   │
│   ├── backgrounds/             # LEGACY — existing handmade backgrounds
│   │   └── (existing files, kept as reference)
│   │
│   └── Root.tsx
│
├── data/
│   ├── renders/
│   ├── previews/
│   ├── audio/
│   ├── music/
│   ├── sfx/
│   ├── feedback/                # FeedbackStore rules.json
│   ├── scenes/                  # SceneDatabase cache
│   └── schedule/                # Video schedule
│
├── scripts/
│   ├── render.mjs
│   ├── batch-render.mjs
│   ├── generate-audio.mjs
│   ├── generate-manifest.mjs    # NEW — rebuilds asset manifest
│   └── pipeline.mjs
│
├── VIDEO-SPEC.md
├── PIPELINE-ARCHITECTURE.md
├── FEEDBACK-SYSTEM.md
└── CLAUDE.md
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial architecture |
| 2.0 | 2026-02-11 | Asset Library approach: compose from pre-built components. No dashboard — n8n approval buttons only. SRT export. Cost reduction ~50%. Phased library build plan. |
