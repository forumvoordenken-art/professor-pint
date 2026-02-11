# Professor Pint — Pipeline Architecture v1.0

> **End-to-end flow: Topic → YouTube-published video.**
> This document describes every step, every service, and every decision point.

---

## Table of Contents

1. [Pipeline Overview](#1-pipeline-overview)
2. [Step 1: Input (Topic + Sources)](#2-step-1-input)
3. [Step 2: Script Generation (LLM)](#3-step-2-script-generation)
4. [Step 3: Asset Generation (SVG)](#4-step-3-asset-generation)
5. [Step 4: Quality Gates](#5-step-4-quality-gates)
6. [Step 5: Audio Generation (TTS + Music + SFX)](#6-step-5-audio-generation)
7. [Step 6: Composition Assembly](#7-step-6-composition-assembly)
8. [Step 7: Preview & Approval](#8-step-7-preview--approval)
9. [Step 8: Full Render](#9-step-8-full-render)
10. [Step 9: YouTube Metadata](#10-step-9-youtube-metadata)
11. [Step 10: Upload & Publish](#11-step-10-upload--publish)
12. [n8n Orchestration](#12-n8n-orchestration)
13. [Infrastructure](#13-infrastructure)
14. [Error Handling](#14-error-handling)
15. [File & Directory Structure](#15-file--directory-structure)

---

## 1. Pipeline Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. INPUT    │───▶│ 2. SCRIPT    │───▶│ 3. ASSETS    │───▶│ 4. QUALITY   │
│  Topic +     │    │ LLM generates│    │ SVG backgrounds│   │ Quality gates│
│  Sources     │    │ full SceneData│   │ + characters  │    │ pass/fail    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                   │
                                                          ┌────────▼───────┐
┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │ 5. AUDIO      │
│ 10. PUBLISH  │◀───│ 9. METADATA  │◀───│ 8. RENDER    │◀─│ TTS + Music   │
│ YouTube      │    │ Title, desc, │    │ Remotion      │  │ + SFX         │
│ upload       │    │ tags, thumb  │    │ full render   │  └───────────────┘
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                                       ┌───────┴───────┐
                                       │ 7. PREVIEW    │
                                       │ Low-res check │
                                       │ Human approve │
                                       └───────────────┘
                                               │
                                       ┌───────┴───────┐
                                       │ 6. ASSEMBLY   │
                                       │ Compose scenes│
                                       │ + audio       │
                                       └───────────────┘
```

---

## 2. Step 1: Input

### Input Format (provided by user via n8n dashboard or schedule)

```typescript
interface PipelineInput {
  /** The video topic */
  topic: string;
  /** Source material — the LLM can ONLY use facts from these sources */
  sources: Array<{
    title: string;
    url?: string;
    /** Plain text content of the source */
    content: string;
  }>;
  /** Target duration in minutes (default: 12) */
  targetMinutes?: number;
  /** Specific instructions for this video (optional) */
  notes?: string;
  /** Schedule metadata */
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
- **Primary**: Claude (Anthropic) — better for structured output and long-form content.
- **Fallback**: OpenAI GPT-4 — if Claude is unavailable.

### Prompt Architecture

The script generation uses a 3-layer prompt system:

```
LAYER 1: System Prompt (constant)
├── VIDEO-SPEC.md (full spec, always included)
├── Active feedback rules (from FeedbackStore)
└── Character library (available characters + their capabilities)

LAYER 2: Task Prompt (per-video)
├── Topic description
├── Source material (full text)
├── Target duration
└── User notes (if any)

LAYER 3: Output Format (constant)
├── Required JSON schema (SceneData[])
├── Example scene (from a known-good video)
└── Quality gate checklist (LLM self-checks before output)
```

### LLM Output
The LLM returns a complete `SceneData[]` JSON array as described in VIDEO-SPEC.md Section 15.

Additionally, it returns:

```typescript
interface ScriptOutput {
  /** The complete scene array */
  scenes: SceneData[];
  /** List of required backgrounds (to be generated) */
  requiredBackgrounds: Array<{
    id: string;
    description: string;       // Detailed visual description for SVG generation
    artStyle: string;          // Specific art direction
    timeOfDay: string;         // dawn, day, dusk, night
    weather: string;           // clear, cloudy, rain, sandstorm, fog
    animationNotes: string;    // What should animate
  }>;
  /** List of required characters (to be generated) */
  requiredCharacters: Array<{
    id: string;
    role: string;              // e.g., "pharaoh", "stone mason"
    description: string;       // Detailed visual description
    clothing: string;          // Period-accurate clothing details
    accessories: string;       // Tools, weapons, jewelry
    distinctiveFeature: string; // What makes them recognizable
  }>;
  /** List of required crowd configs */
  requiredCrowds: Array<{
    sceneId: string;
    description: string;       // What the crowd is doing
    figureTypes: string[];     // Types of figures needed
    density: 'sparse' | 'medium' | 'dense';
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
    thumbnailConcept: string;  // Description of ideal thumbnail
  };
}
```

---

## 4. Step 3: Asset Generation

### 4.1 Background Generation

For each entry in `requiredBackgrounds`, the LLM generates a complete SVG React component.

**Prompt per background:**
```
Generate a React SVG background component for a Professor Pint video.

CONTEXT: [scene description from ScriptOutput]
ART STYLE: Oil painting quality. Vermeer lighting. Rich palette (60+ colors).
TIME OF DAY: [timeOfDay]
WEATHER: [weather]
ANIMATION NOTES: [animationNotes]

REQUIREMENTS (from VIDEO-SPEC.md Section 4):
- [All requirements listed]
- Must have 6 layers: sky, mid-background, midground, foreground, atmosphere, lighting
- Must animate at least 3 elements using the `frame` parameter
- Minimum 200 lines of SVG, target 500+
- Follow the exact component structure template

ACTIVE FEEDBACK RULES:
[Injected from FeedbackStore — e.g., "more warm tones", "darker shadows"]
```

**Generation Process:**
1. LLM generates the SVG component
2. Quality Gate (Section 12.2 of VIDEO-SPEC.md) validates it
3. If FAIL → regenerate with specific feedback (max 3 attempts)
4. If PASS → save to `src/backgrounds/generated/[id].tsx`

### 4.2 Character Generation

For each entry in `requiredCharacters`, the LLM generates a complete SVG React component.

**Prompt per character:**
```
Generate a React SVG character component for a Professor Pint video.

CHARACTER: [role] — [description]
CLOTHING: [clothing]
ACCESSORIES: [accessories]
DISTINCTIVE FEATURE: [distinctiveFeature]

REQUIREMENTS (from VIDEO-SPEC.md Section 5):
- Must accept frame, emotion, talking, scale props
- Minimum 150 lines SVG, 15+ colors
- Period-accurate clothing and accessories
- Idle animation (breathing, blinking)
- Emotion support (6 states)
- Must be recognizable by role from appearance alone

ACTIVE FEEDBACK RULES:
[Injected from FeedbackStore]
```

### 4.3 Crowd Generation

For each entry in `requiredCrowds`, the LLM generates a CrowdLayer config.

### 4.4 Asset Caching (SceneDatabase)

Generated assets are stored in the SceneDatabase for reuse:
- If a future video needs "Egyptian pyramid at dusk" and we have one rated 4+/5 → reuse it.
- The system searches by tags: topic, era, setting, time-of-day.
- Reused assets get a `reusedFrom` marker in the scene data.

---

## 5. Step 4: Quality Gates

Every generated asset passes through automated quality gates as defined in VIDEO-SPEC.md Section 12.

```
Pipeline Flow:
  Generate → Validate → PASS? → Continue
                      → FAIL? → Regenerate with feedback (max 3 attempts)
                               → Still FAIL after 3? → Flag for human review
```

### Validation Implementation

```typescript
interface QualityResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message?: string;   // Feedback for regeneration
  }>;
  score: number;         // 0-100 quality score
}

// Example: Background validation
function validateBackground(svgCode: string): QualityResult {
  const checks = [];

  // Check 1: SVG validity
  checks.push(checkSVGValidity(svgCode));

  // Check 2: Complexity (element count, colors, gradients)
  checks.push(checkComplexity(svgCode, {
    minElements: 50,
    minColors: 40,
    minGradients: 3,
    minLines: 200,
  }));

  // Check 3: Layer structure
  checks.push(checkLayers(svgCode));

  // Check 4: Animation (frame references)
  checks.push(checkAnimation(svgCode, { minFrameRefs: 3 }));

  // Check 5: Art style (gradients, opacity, vignette)
  checks.push(checkArtStyle(svgCode));

  // Check 6: Perspective
  checks.push(checkPerspective(svgCode));

  return {
    passed: checks.every(c => c.passed),
    checks,
    score: (checks.filter(c => c.passed).length / checks.length) * 100,
  };
}
```

---

## 6. Step 5: Audio Generation

### 6.1 TTS (Text-to-Speech)

**Process:**
1. Extract all `subtitle` texts from SceneData[] where `talking: true`
2. Send each subtitle to ElevenLabs API
3. Receive audio files (.mp3) with timing data
4. Map phonemes to mouth shapes for lip sync
5. Store audio segments with frame-accurate timing

```typescript
interface AudioPipelineOutput {
  segments: Array<{
    sceneId: string;
    audioFile: string;      // path to .mp3
    startFrame: number;
    endFrame: number;
    phonemes: Array<{       // for lip sync
      time: number;
      phoneme: string;
      mouthShape: 'closed' | 'open' | 'wide' | 'rounded';
    }>;
  }>;
  totalDurationFrames: number;
}
```

### 6.2 Music Generation/Selection

Based on the `musicDirection` from the script output:
1. Search music library for matching tracks
2. If no match: generate using AI music service or use royalty-free library
3. Mix at -18dB relative to voice
4. Crossfade between tracks at scene transitions (2-second crossfade)

### 6.3 SFX

Based on `sfx` entries in each SceneData:
1. Map SFX type to audio files from SFX library
2. Place at correct frame positions
3. Mix at -12dB relative to voice
4. Loop ambient SFX (wind, crowd murmur) for scene duration

---

## 7. Step 6: Composition Assembly

### 7.1 Dynamic Composition File

The pipeline generates a Remotion composition file that:
1. Imports ProfessorPint (permanent) and all generated characters
2. Imports all generated backgrounds
3. Imports crowd configs
4. Passes the SceneData[] to SceneRenderer
5. Binds audio segments to the timeline

```typescript
// Auto-generated composition
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

### 7.2 Registration in Root.tsx

The pipeline automatically registers the new composition in Root.tsx with:
- Unique ID: `ProfessorPint-[Topic]-[Date]`
- Correct frame count (from total duration)
- 30fps, 1920x1080

---

## 8. Step 7: Preview & Approval

### 8.1 Low-Resolution Preview

Before the full render:
1. Render at **480p** (854×480) instead of 1080p
2. Render at **10fps** instead of 30fps (3x faster)
3. This produces a rough preview in ~1/18th the time

### 8.2 Preview Delivery

The preview is:
1. Uploaded to a private preview URL (cloud storage)
2. Notification sent to user (via n8n → email/Slack/dashboard)
3. Dashboard shows the preview with approve/reject/feedback buttons

### 8.3 Approval Flow

```
Preview Ready → User Reviews
  → APPROVE → Proceed to Step 8 (Full Render)
  → REJECT with feedback → Feedback stored → Return to Step 2 (Script Regen)
  → PARTIAL approve → Fix specific scenes → Return to Step 4 (Quality Gates)
```

---

## 9. Step 8: Full Render

### 9.1 Render Command

```bash
npx remotion render src/index.ts ProfessorPint-[Topic]-[Date] \
  --output out/[topic]-[date].mp4 \
  --codec h264 \
  --image-format jpeg \
  --quality 90 \
  --frames 0-[totalFrames]
```

### 9.2 Render Settings

| Setting | Value |
|---------|-------|
| Resolution | 1920×1080 |
| FPS | 30 |
| Codec | H.264 |
| Quality | 90 |
| Audio Codec | AAC |
| Audio Bitrate | 192kbps |
| Estimated render time | 30-90 minutes for 12-minute video |
| Output format | .mp4 |

### 9.3 Post-Render Checks
- File size: expect 200-600MB for a 12-minute video
- Audio sync: verify audio aligns with subtitles
- No black frames or glitches (spot-check first/last/middle frames)

---

## 10. Step 9: YouTube Metadata

Generated alongside the script (Step 2). See VIDEO-SPEC.md Section 13 for format.

### 10.1 Thumbnail Generation

1. Extract a key frame from the video (the most visually impressive `establishing` or `dramatic` scene)
2. Composite: scene background (left 2/3) + Professor Pint shocked face (right 1/3) + bold text overlay
3. Output: 1280×720 JPEG at 95% quality

### 10.2 Timestamps

Auto-generated from SceneData[]:
- Identify every `topicCard` overlay → that's a timestamp marker
- Format: `MM:SS - Topic Label`
- Include in YouTube description

---

## 11. Step 10: Upload & Publish

### 11.1 Upload via YouTube API (through n8n)

```typescript
interface YouTubeUpload {
  videoFile: string;         // path to .mp4
  thumbnail: string;         // path to thumbnail .jpg
  title: string;
  description: string;
  tags: string[];
  categoryId: '27';         // Education category
  privacyStatus: 'private'; // Always upload as PRIVATE first
  publishAt?: string;        // Scheduled publish date (ISO 8601)
  language: 'en';
  defaultAudioLanguage: 'en';
}
```

### 11.2 Publish Flow

```
Upload as PRIVATE → Notify user → User reviews on YouTube
  → APPROVE → Change to PUBLIC (or schedule)
  → REJECT → Keep private, regenerate if needed
```

**NEVER auto-publish as public.** Always require manual approval.

---

## 12. n8n Orchestration

### 12.1 n8n Workflow Overview

n8n is the orchestration layer that connects all steps. The n8n server runs on a dedicated machine (or cloud) and manages the pipeline.

```
┌─────────────────────────────────────────────────────────────────┐
│                        n8n WORKFLOW                              │
│                                                                  │
│  TRIGGER: Schedule (cron) or Manual (webhook/dashboard)          │
│     │                                                            │
│     ▼                                                            │
│  [1] Read topic + sources from schedule/database                 │
│     │                                                            │
│     ▼                                                            │
│  [2] Call LLM API: Generate ScriptOutput                         │
│     │  ├── System prompt: VIDEO-SPEC + feedback rules            │
│     │  ├── User prompt: topic + sources                          │
│     │  └── Output: SceneData[] + asset requirements              │
│     │                                                            │
│     ▼                                                            │
│  [3] For each required background: Call LLM → Generate SVG       │
│     │  └── Quality gate check → Retry if failed (max 3x)        │
│     │                                                            │
│     ▼                                                            │
│  [4] For each required character: Call LLM → Generate SVG        │
│     │  └── Quality gate check → Retry if failed (max 3x)        │
│     │                                                            │
│     ▼                                                            │
│  [5] Generate crowd configs                                      │
│     │                                                            │
│     ▼                                                            │
│  [6] Call ElevenLabs: Generate TTS for all subtitles             │
│     │                                                            │
│     ▼                                                            │
│  [7] Select/generate music + SFX                                 │
│     │                                                            │
│     ▼                                                            │
│  [8] Assemble Remotion composition                               │
│     │                                                            │
│     ▼                                                            │
│  [9] Render preview (480p/10fps)                                 │
│     │                                                            │
│     ▼                                                            │
│ [10] Notify user → Wait for approval                             │
│     │  ├── APPROVE → Continue                                    │
│     │  ├── FEEDBACK → Store feedback → Go to [2]                 │
│     │  └── REJECT → Store feedback → End                         │
│     │                                                            │
│     ▼                                                            │
│ [11] Full render (1080p/30fps)                                   │
│     │                                                            │
│     ▼                                                            │
│ [12] Generate thumbnail                                          │
│     │                                                            │
│     ▼                                                            │
│ [13] Upload to YouTube (PRIVATE)                                 │
│     │                                                            │
│     ▼                                                            │
│ [14] Notify user → Wait for publish approval                     │
│     │  ├── APPROVE → Set to PUBLIC / schedule                    │
│     │  └── REJECT → Keep private                                 │
│     │                                                            │
│     ▼                                                            │
│ [15] Log result → Update schedule → Done                         │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 n8n Node Types Used

| Node | Purpose |
|------|---------|
| **Schedule Trigger** | Fires on schedule (e.g., every Monday 9:00) |
| **Webhook** | Manual trigger from dashboard |
| **HTTP Request** | Call LLM API (Claude/OpenAI) |
| **HTTP Request** | Call ElevenLabs API |
| **Code** | Quality gate validation logic |
| **Code** | Composition assembly |
| **Execute Command** | Run Remotion render CLI |
| **Google Drive** | Upload preview for review |
| **YouTube** | Upload final video |
| **Slack/Email** | Notifications |
| **Wait** | Wait for human approval |
| **IF** | Quality gate pass/fail routing |
| **Loop** | Iterate over backgrounds/characters for generation |

### 12.3 Schedule Database

```typescript
interface VideoSchedule {
  id: string;
  topic: string;
  sources: Source[];
  scheduledDate: string;        // When to publish
  status: 'queued' | 'generating' | 'preview_ready' | 'approved' | 'rendering' | 'rendered' | 'uploaded' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  feedback?: FeedbackEntry[];   // Accumulated feedback
  outputFile?: string;          // Path to rendered .mp4
  youtubeId?: string;           // YouTube video ID after upload
  previewUrl?: string;          // URL to preview video
}
```

---

## 13. Infrastructure

### 13.1 Required Services

| Service | Purpose | Estimated Cost |
|---------|---------|---------------|
| **n8n** (self-hosted) | Pipeline orchestration | Free (self-hosted) |
| **Claude API** (Anthropic) | Script + SVG generation | ~$5-15 per video |
| **ElevenLabs** | TTS voice generation | ~$5-10 per video |
| **Remotion** | Video rendering | Free (self-hosted) |
| **Cloud storage** | Preview hosting, asset storage | ~$5/month |
| **YouTube API** | Upload & publish | Free |
| **Server** | Run n8n + render | VPS or local machine |

### 13.2 Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 8 GB | 16+ GB |
| Storage | 50 GB | 200+ GB |
| GPU | Not required | Nice for faster render |
| OS | Linux (Ubuntu 22.04+) | — |
| Node.js | 18+ | 20+ |

### 13.3 Environment Variables

```bash
# LLM
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...              # Fallback

# TTS
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...            # To be selected

# YouTube
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...

# Storage
CLOUD_STORAGE_BUCKET=...
CLOUD_STORAGE_KEY=...

# n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook/professor-pint
N8N_API_KEY=...

# Pipeline
RENDER_OUTPUT_DIR=/data/renders
PREVIEW_OUTPUT_DIR=/data/previews
ASSET_DIR=/data/assets
```

---

## 14. Error Handling

### 14.1 LLM Generation Failures

| Error | Action |
|-------|--------|
| LLM returns invalid JSON | Retry with explicit "return ONLY valid JSON" prompt (max 3x) |
| LLM quality gate fails | Regenerate with specific feedback from quality gate |
| LLM timeout | Retry with exponential backoff (2s, 4s, 8s) |
| LLM rate limit | Wait and retry |
| 3 consecutive failures on same asset | Flag for human review, skip to next asset |

### 14.2 TTS Failures

| Error | Action |
|-------|--------|
| ElevenLabs timeout | Retry with exponential backoff |
| Character limit exceeded | Split subtitle into chunks |
| API quota exhausted | Queue for later, notify user |

### 14.3 Render Failures

| Error | Action |
|-------|--------|
| Out of memory | Render in chunks (scenes separately, then concatenate) |
| Invalid SVG crashes renderer | Identify problematic scene, flag for regeneration |
| Audio sync issues | Regenerate audio segments with adjusted timing |

### 14.4 Alerting

All errors are:
1. Logged to pipeline log file
2. If critical: notification sent to user via configured channel
3. Pipeline pauses at the error point (doesn't skip ahead)

---

## 15. File & Directory Structure

```
professor-pint/
├── src/
│   ├── animations/          # Animation systems (PERMANENT)
│   ├── backgrounds/
│   │   ├── Pub.tsx          # Permanent backgrounds
│   │   ├── Classroom.tsx
│   │   └── generated/       # LLM-generated backgrounds (per video)
│   │       ├── egypt/
│   │       ├── aztec/
│   │       └── [topic]/
│   ├── characters/
│   │   ├── ProfessorPint.tsx # Permanent character
│   │   └── generated/       # LLM-generated characters (per video)
│   │       ├── egypt/
│   │       ├── aztec/
│   │       └── [topic]/
│   ├── crowds/
│   │   └── generated/       # LLM-generated crowd configs
│   ├── compositions/
│   │   └── generated/       # Auto-generated composition files
│   ├── systems/             # Core rendering systems (PERMANENT)
│   ├── pipeline/            # Pipeline logic (PERMANENT)
│   └── Root.tsx
├── data/
│   ├── renders/             # Output .mp4 files
│   ├── previews/            # Low-res preview files
│   ├── audio/               # Generated TTS audio files
│   ├── music/               # Background music library
│   ├── sfx/                 # Sound effects library
│   ├── feedback/            # FeedbackStore JSON files
│   ├── scenes/              # SceneDatabase cache
│   └── schedule/            # Video schedule database
├── scripts/
│   ├── render.mjs           # Single video render
│   ├── batch-render.mjs     # Batch render
│   ├── generate-audio.mjs   # TTS generation
│   └── pipeline.mjs         # Full pipeline runner
├── VIDEO-SPEC.md            # Video specification (this is the bible)
├── PIPELINE-ARCHITECTURE.md # Pipeline architecture (this document)
├── FEEDBACK-SYSTEM.md       # Feedback system documentation
└── CLAUDE.md                # Project instructions
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial architecture |
