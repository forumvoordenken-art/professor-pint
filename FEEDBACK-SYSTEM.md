# Professor Pint — Feedback & Learning System v1.0

> **"Tell me once, I remember forever."**
> Every piece of feedback permanently improves all future videos.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Feedback Categories](#2-feedback-categories)
3. [How Feedback is Collected](#3-how-feedback-is-collected)
4. [How Feedback is Applied](#4-how-feedback-is-applied)
5. [Feedback Storage Format](#5-feedback-storage-format)
6. [Dashboard Specification](#6-dashboard-specification)
7. [Feedback Lifecycle](#7-feedback-lifecycle)
8. [Examples](#8-examples)

---

## 1. System Overview

The feedback system is a self-learning layer that sits between the user and the LLM. Every time the user gives feedback on a video (or part of a video), that feedback becomes a permanent rule that applies to ALL future videos.

```
USER FEEDBACK
     │
     ▼
┌─────────────┐     ┌─────────────────────────────┐
│ FeedbackStore│────▶│ Injected into EVERY LLM     │
│ (rules.json) │     │ prompt as "ACTIVE RULES"     │
└─────────────┘     └─────────────────────────────┘
     │
     ▼
  Permanent, cumulative, always growing
```

### Key Principles
1. **Tell once, remember forever** — user never has to repeat feedback.
2. **Universal by default** — feedback applies to all future videos unless explicitly scoped.
3. **Categorized** — feedback is organized by type for targeted injection.
4. **Versioned** — every rule has a timestamp and can be deactivated (never deleted).
5. **Transparent** — user can see all active rules at any time in the dashboard.

---

## 2. Feedback Categories

| Category | What It Covers | Example Rules |
|----------|---------------|---------------|
| `visual.backgrounds` | Background quality, detail, style | "More warm tones in outdoor scenes" |
| `visual.characters` | Character design, proportions | "Characters should have more defined facial features" |
| `visual.crowds` | Crowd density, variety, placement | "Crowds feel too sparse, increase minimum to 12 figures" |
| `visual.composition` | Scene layout, depth, perspective | "Professor is too centered, use more rule-of-thirds" |
| `visual.colors` | Color palette, saturation, contrast | "Scenes are too dark, increase overall brightness 15%" |
| `camera.movement` | Camera speed, style, variety | "Camera movements are too fast, slow down pans by 30%" |
| `camera.framing` | Zoom levels, character framing | "Too many close-ups, use more medium shots" |
| `text.tone` | Voice, humor, personality | "More sarcastic humor, less dad jokes" |
| `text.complexity` | Language level, explanation depth | "Explanations are too simple, audience is smart" |
| `text.subtitles` | Subtitle style, length, timing | "Subtitles stay on screen too long" |
| `text.hooks` | Opening hooks, engagement lines | "Opening hooks need to be more surprising" |
| `timing.pacing` | Scene duration, video length | "Scenes change too fast, average should be 15s not 10s" |
| `timing.energy` | Energy curve, dramatic moments | "Build more tension before revelations" |
| `audio.voice` | TTS voice, speed, intonation | "Voice is too monotone in dramatic sections" |
| `audio.music` | Background music volume, style | "Music is too loud during explanations" |
| `audio.sfx` | Sound effects, ambient sounds | "More ambient crowd noise in market scenes" |
| `content.accuracy` | Factual accuracy, source usage | "Always cite specific dates, not just centuries" |
| `content.depth` | Detail level, topic coverage | "Spend more time on economic aspects" |
| `general` | Anything that doesn't fit above | Catch-all category |

---

## 3. How Feedback is Collected

### 3.1 Dashboard (Primary Method)

The dashboard shows the preview video with scene-by-scene controls:

```
┌──────────────────────────────────────────────────────────────┐
│  PROFESSOR PINT — Video Review Dashboard                      │
│                                                                │
│  ┌────────────────────────────────────────────┐               │
│  │                                            │               │
│  │           VIDEO PREVIEW PLAYER             │               │
│  │                                            │               │
│  └────────────────────────────────────────────┘               │
│                                                                │
│  Scene Timeline (clickable):                                   │
│  [1][2][3][4][5][6][7][8][9][10]...[45]                       │
│   ✅ ✅ ✅ ⚠️ ✅ ✅ ❌ ✅ ✅ ✅     ✅                       │
│                                                                │
│  Selected Scene: #7 (02:15 - 02:28)                           │
│  ┌──────────────────────────────────────────┐                 │
│  │ Background: desert_construction_03        │                 │
│  │ Type: narrative                           │                 │
│  │ Camera: panLeftToRight                    │                 │
│  │ Characters: Professor, Worker x3          │                 │
│  └──────────────────────────────────────────┘                 │
│                                                                │
│  FEEDBACK FOR THIS SCENE:                                      │
│  Category: [dropdown: visual/camera/text/timing/audio/content] │
│  Feedback: [text input]                                        │
│  Apply to: ○ This scene only  ○ All scenes  ● All videos      │
│                                                                │
│  [Submit Feedback]   [Approve Scene]   [Reject Scene]         │
│                                                                │
│  ─────────────────────────────────────────────                │
│  GLOBAL FEEDBACK (applies to whole video):                     │
│  [text input]                                                  │
│  [Submit]                                                      │
│                                                                │
│  ─────────────────────────────────────────────                │
│  OVERALL: [✅ Approve Video] [🔄 Revise] [❌ Reject]          │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Quick Feedback (Webhook/API)

For fast feedback without the full dashboard:

```typescript
// POST /api/feedback
{
  "videoId": "pyramids-2026-02-11",
  "category": "visual.backgrounds",
  "rule": "More warm tones in desert scenes",
  "scope": "all_videos",        // or "this_video" or "this_theme"
  "priority": "high"            // high, medium, low
}
```

### 3.3 Batch Feedback (After Review)

The dashboard allows submitting all scene feedback at once as a batch.

---

## 4. How Feedback is Applied

### 4.1 Injection into LLM Prompts

Every time the LLM is called, active feedback rules are injected:

```
=== ACTIVE FEEDBACK RULES (MUST FOLLOW) ===

These rules are based on user feedback and OVERRIDE any default behavior.
Violating these rules is a quality gate failure.

--- VISUAL RULES ---
[HIGH] More warm tones in outdoor scenes (2026-02-01)
[HIGH] Characters should have more defined facial features (2026-02-05)
[MEDIUM] Crowds feel too sparse, increase minimum to 12 figures (2026-02-08)

--- CAMERA RULES ---
[HIGH] Camera movements are too fast, slow down pans by 30% (2026-02-03)
[MEDIUM] Too many close-ups, use more medium shots (2026-02-07)

--- TEXT RULES ---
[HIGH] More sarcastic humor, less dad jokes (2026-02-02)
[MEDIUM] Explanations are too simple for the target audience (2026-02-06)

--- TIMING RULES ---
(none yet)

--- AUDIO RULES ---
[LOW] More ambient crowd noise in market scenes (2026-02-09)

--- CONTENT RULES ---
[HIGH] Always cite specific dates, not just centuries (2026-02-04)

=== END FEEDBACK RULES ===
```

### 4.2 Priority Handling

| Priority | Effect |
|----------|--------|
| `high` | Included in EVERY prompt. Violation = automatic quality gate failure. |
| `medium` | Included in every prompt. Violation = warning but not automatic failure. |
| `low` | Included in prompts when the category is relevant (e.g., audio rules only in audio prompts). |

### 4.3 Quality Gate Integration

The quality gates (VIDEO-SPEC.md Section 12) include a feedback compliance check:

```
CHECK: Feedback Compliance
  For each HIGH priority rule:
    - Verify the output does not violate the rule
    - If violation detected → FAIL with: "Violates feedback rule: [rule text]"
  For each MEDIUM priority rule:
    - Check for compliance
    - If violation → WARNING (logged, but doesn't block)
```

---

## 5. Feedback Storage Format

### 5.1 File: `data/feedback/rules.json`

```typescript
interface FeedbackRule {
  /** Unique rule ID */
  id: string;
  /** When the rule was created */
  createdAt: string;                // ISO 8601
  /** Who created it */
  createdBy: 'user' | 'system';
  /** Feedback category */
  category: string;                 // e.g., "visual.backgrounds"
  /** The rule text (human-readable) */
  rule: string;
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Scope of the rule */
  scope: 'all_videos' | 'theme' | 'single_video';
  /** If scope is 'theme', which theme */
  theme?: string;
  /** If scope is 'single_video', which video */
  videoId?: string;
  /** Is this rule currently active */
  active: boolean;
  /** How many times this rule has been applied */
  appliedCount: number;
  /** The video/scene that triggered this feedback */
  sourceVideoId?: string;
  sourceSceneId?: string;
}
```

### 5.2 Example rules.json

```json
{
  "rules": [
    {
      "id": "fb-001",
      "createdAt": "2026-02-01T14:30:00Z",
      "createdBy": "user",
      "category": "visual.backgrounds",
      "rule": "Outdoor desert scenes should use warmer tones (oranges, ambers) instead of cool blues.",
      "priority": "high",
      "scope": "all_videos",
      "active": true,
      "appliedCount": 0,
      "sourceVideoId": "pyramids-2026-02-01",
      "sourceSceneId": "giza-3"
    },
    {
      "id": "fb-002",
      "createdAt": "2026-02-03T10:15:00Z",
      "createdBy": "user",
      "category": "camera.movement",
      "rule": "Pan movements (panLeftToRight, panRightToLeft) should take at least 12 seconds. Previous speed was too fast.",
      "priority": "high",
      "scope": "all_videos",
      "active": true,
      "appliedCount": 0
    },
    {
      "id": "fb-003",
      "createdAt": "2026-02-05T16:00:00Z",
      "createdBy": "user",
      "category": "text.tone",
      "rule": "More sarcastic, witty humor. Less 'dad jokes'. Think John Oliver meets Brian Cox.",
      "priority": "high",
      "scope": "all_videos",
      "active": true,
      "appliedCount": 0
    }
  ],
  "version": 1,
  "lastUpdated": "2026-02-05T16:00:00Z"
}
```

---

## 6. Dashboard Specification

### 6.1 Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React (shared with Remotion codebase) or Next.js |
| Backend | Express.js / Fastify (same Node.js server as pipeline) |
| Database | JSON files (FeedbackStore) initially, upgrade to SQLite/Postgres later |
| Hosting | Same server as n8n |
| Auth | Simple API key or basic auth (single user) |

### 6.2 Dashboard Pages

#### Page 1: Schedule
```
/dashboard/schedule

Shows upcoming videos:
┌────────┬──────────────────┬──────────┬───────────┐
│ Date   │ Topic            │ Status   │ Actions   │
├────────┼──────────────────┼──────────┼───────────┤
│ Feb 15 │ Viking Economy   │ queued   │ [Edit]    │
│ Feb 22 │ Roman Roads      │ queued   │ [Edit]    │
│ Mar 1  │ Silk Road Trade  │ queued   │ [Edit]    │
└────────┴──────────────────┴──────────┴───────────┘

[+ Add Video to Schedule]
```

#### Page 2: Video Review
```
/dashboard/review/:videoId

The full preview player + scene-by-scene feedback (see Section 3.1)
```

#### Page 3: Feedback Rules
```
/dashboard/feedback

All active feedback rules, filterable by category:
┌─────┬────────────────────┬──────────┬──────────┬────────┐
│ ID  │ Rule               │ Category │ Priority │ Active │
├─────┼────────────────────┼──────────┼──────────┼────────┤
│ 001 │ Warmer desert tones│ visual   │ HIGH     │ ✅     │
│ 002 │ Slower pan speed   │ camera   │ HIGH     │ ✅     │
│ 003 │ More sarcasm       │ text     │ HIGH     │ ✅     │
└─────┴────────────────────┴──────────┴──────────┴────────┘

[+ Add Rule Manually]

Each rule can be:
- Edited (change text, priority, scope)
- Deactivated (not deleted — preserved for history)
- Viewed: which videos it was applied to
```

#### Page 4: Analytics (Future)
```
/dashboard/analytics

Video performance metrics (from YouTube API):
- Views, watch time, retention curves
- Which scene types get the most engagement
- Drop-off points → automatic feedback generation
```

### 6.3 Dashboard API Endpoints

```
GET    /api/schedule              — List scheduled videos
POST   /api/schedule              — Add video to schedule
PUT    /api/schedule/:id          — Update scheduled video
DELETE /api/schedule/:id          — Remove from schedule

GET    /api/videos                — List all generated videos
GET    /api/videos/:id            — Get video details + scenes
GET    /api/videos/:id/preview    — Get preview URL

POST   /api/feedback              — Submit feedback rule
GET    /api/feedback              — List all feedback rules
PUT    /api/feedback/:id          — Update feedback rule
PATCH  /api/feedback/:id/toggle   — Activate/deactivate rule

POST   /api/videos/:id/approve    — Approve video for full render
POST   /api/videos/:id/reject     — Reject video with feedback
POST   /api/videos/:id/publish    — Approve for YouTube publish

GET    /api/pipeline/status       — Current pipeline status
POST   /api/pipeline/trigger      — Manually trigger pipeline for a video
```

---

## 7. Feedback Lifecycle

```
1. VIDEO GENERATED
   └── User watches preview in dashboard

2. USER GIVES FEEDBACK
   └── Per-scene or global
   └── Categorized automatically (or manually)
   └── Scope set: all_videos (default) / theme / single_video

3. FEEDBACK STORED
   └── Added to rules.json
   └── Marked as active, high priority
   └── Applied count: 0

4. NEXT VIDEO GENERATED
   └── All active rules injected into LLM prompt
   └── LLM reads and follows rules
   └── Quality gates check compliance
   └── Applied count incremented

5. FEEDBACK EFFECT VERIFIED
   └── User reviews next video
   └── If issue persists → priority escalated, rule text refined
   └── If fixed → feedback confirmed as effective

6. RULE EVOLUTION
   └── Over time, rules accumulate → LLM output converges on user preferences
   └── Old rules that are always followed can be downgraded to 'low' priority
   └── Contradictory rules are flagged for user resolution
```

---

## 8. Examples

### Example 1: Visual Feedback

**User says:** "The backgrounds are too dark, I can barely see the characters."

**System creates rule:**
```json
{
  "category": "visual.backgrounds",
  "rule": "Backgrounds must have sufficient brightness for characters to be visible. Use lighter base colors and add a soft ambient light overlay. Characters should always contrast against their background.",
  "priority": "high",
  "scope": "all_videos"
}
```

**Injected in next prompt as:**
> [HIGH] Backgrounds must have sufficient brightness for characters to be visible. Use lighter base colors and add a soft ambient light overlay. Characters should always contrast against their background.

---

### Example 2: Camera Feedback

**User says:** "Too many zoom-ins, feels claustrophobic."

**System creates rule:**
```json
{
  "category": "camera.framing",
  "rule": "Limit dramaticZoom and slowZoomIn to maximum 4 uses per video. Prefer medium shots (zoom 1.0-1.3) over close-ups (zoom > 1.5). Use more establishing shots and pans.",
  "priority": "high",
  "scope": "all_videos"
}
```

---

### Example 3: Content Feedback

**User says:** "The Aztec video didn't mention the floating gardens enough."

**System creates rules:**
```json
[
  {
    "category": "content.depth",
    "rule": "When a topic has a unique/surprising aspect (like Aztec floating gardens), dedicate at least 2-3 scenes to it with detail shots and overlays.",
    "priority": "medium",
    "scope": "all_videos"
  }
]
```

---

### Example 4: Tone Feedback

**User says:** "Professor sounds too much like a textbook. Make him more like a pub storyteller."

**System creates rule:**
```json
{
  "category": "text.tone",
  "rule": "Professor Pint must sound like he's telling a story at a pub, not reading from a textbook. Use conversational language: 'Right, so get this...' instead of 'The historical significance of...'. Include reactions: 'I mean, can you believe that?', 'Mate, this is where it gets crazy.'",
  "priority": "high",
  "scope": "all_videos"
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial specification |
