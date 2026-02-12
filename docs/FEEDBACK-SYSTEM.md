# Professor Pint — Feedback & Learning System v2.0

> **"Tell me once, I remember forever."**
> Every piece of feedback permanently improves all future videos.
> Feedback is given through n8n approval buttons — no separate dashboard needed.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Feedback Categories](#2-feedback-categories)
3. [How Feedback is Collected (via n8n)](#3-how-feedback-is-collected)
4. [How Feedback is Applied](#4-how-feedback-is-applied)
5. [Feedback Storage Format](#5-feedback-storage-format)
6. [Feedback Lifecycle](#7-feedback-lifecycle)
7. [Examples](#8-examples)

---

## 1. System Overview

The feedback system is a self-learning layer between the user and the LLM. Every piece of feedback becomes a permanent rule injected into ALL future LLM calls.

```
USER (via n8n) → gives feedback
     │
     ▼
┌─────────────┐     ┌─────────────────────────────┐
│ FeedbackStore│────▶│ Injected into EVERY LLM     │
│ (rules.json) │     │ prompt as "ACTIVE RULES"     │
└─────────────┘     └─────────────────────────────┘
     │
     ▼
  Permanent, cumulative, always growing.
  LLM output converges on user preferences over time.
```

### Key Principles
1. **Tell once, remember forever** — user never repeats feedback.
2. **Universal by default** — applies to all future videos unless scoped otherwise.
3. **Categorized** — organized by type for targeted injection.
4. **Never deleted** — rules can be deactivated but are preserved for history.
5. **n8n native** — no separate dashboard. Feedback flows through n8n approval nodes.

---

## 2. Feedback Categories

| Category | What It Covers | Example Rules |
|----------|---------------|---------------|
| `visual.backgrounds` | Background quality, detail, style | "More warm tones in outdoor scenes" |
| `visual.characters` | Character design, proportions | "Characters need more defined facial features" |
| `visual.crowds` | Crowd density, variety, placement | "Minimum 12 figures in crowd scenes" |
| `visual.composition` | Scene layout, depth, perspective | "Use more rule-of-thirds, less centered" |
| `visual.colors` | Color palette, saturation, contrast | "Scenes are too dark, increase brightness 15%" |
| `camera.movement` | Camera speed, style, variety | "Slow down pan movements by 30%" |
| `camera.framing` | Zoom levels, character framing | "Too many close-ups, more medium shots" |
| `text.tone` | Voice, humor, personality | "More sarcastic humor, less dad jokes" |
| `text.complexity` | Language level, explanation depth | "Audience is smart, don't over-simplify" |
| `text.subtitles` | Subtitle style, length, timing | "Subtitles stay on screen too long" |
| `text.hooks` | Opening hooks, engagement lines | "Opening hooks need to be more surprising" |
| `timing.pacing` | Scene duration, video length | "Average scene should be 15s not 10s" |
| `timing.energy` | Energy curve, dramatic moments | "Build more tension before revelations" |
| `audio.voice` | TTS voice, speed, intonation | "Voice is too monotone in dramatic sections" |
| `audio.music` | Background music volume, style | "Music is too loud during explanations" |
| `audio.sfx` | Sound effects, ambient sounds | "More ambient crowd noise in market scenes" |
| `content.accuracy` | Factual accuracy, source usage | "Always cite specific dates, not just centuries" |
| `content.depth` | Detail level, topic coverage | "Spend more time on economic aspects" |
| `general` | Anything that doesn't fit above | Catch-all category |

---

## 3. How Feedback is Collected

### 3.1 n8n Approval Flow (Primary Method)

At Step 9 of the pipeline (Preview & Approval), n8n shows the user:

```
┌──────────────────────────────────────────────┐
│  VIDEO PREVIEW READY                          │
│                                                │
│  Topic: "Pyramids of Giza"                    │
│  Duration: 11:47                              │
│  Scenes: 42                                   │
│  Preview: [link to 480p preview video]        │
│                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ APPROVE  │ │ FEEDBACK │ │  REJECT  │      │
│  └──────────┘ └──────────┘ └──────────┘      │
│                                                │
│  (If FEEDBACK or REJECT:)                     │
│  What should be improved?                      │
│  [text area for feedback]                      │
│                                                │
│  Category: [dropdown]                          │
│  ○ visual  ○ camera  ○ text  ○ timing         │
│  ○ audio   ○ content ○ general                │
│                                                │
│  [Submit Feedback]                             │
└──────────────────────────────────────────────┘
```

This is implemented using n8n's **Wait for Approval** node with a custom form.

### 3.2 What Happens With Feedback

```
User submits feedback text + category
     │
     ▼
n8n Code node parses feedback into a FeedbackRule:
  - Extracts the core instruction
  - Assigns category (from dropdown or auto-detected)
  - Sets priority to HIGH (user feedback is always important)
  - Sets scope to all_videos (default)
  - Saves to data/feedback/rules.json
     │
     ▼
Pipeline restarts from Step 2 (Script Generation)
with the new rule now included in the LLM prompt
```

### 3.3 Viewing Active Rules

Active rules can be viewed anytime by:
1. Reading `data/feedback/rules.json` directly
2. n8n workflow: a separate "View Feedback Rules" webhook that returns all active rules as JSON
3. Future: simple web page that renders rules.json in a table

---

## 4. How Feedback is Applied

### 4.1 Injection into LLM Prompts

Every LLM call includes all active feedback rules:

```
=== ACTIVE FEEDBACK RULES (MUST FOLLOW) ===

These rules come from user feedback and OVERRIDE default behavior.
Violating HIGH priority rules is a quality gate failure.

--- VISUAL RULES ---
[HIGH] More warm tones in outdoor scenes (2026-02-01)
[HIGH] Characters need more defined facial features (2026-02-05)
[MEDIUM] Minimum 12 figures in crowd scenes (2026-02-08)

--- CAMERA RULES ---
[HIGH] Slow down pan movements by 30% (2026-02-03)

--- TEXT RULES ---
[HIGH] More sarcastic humor, think John Oliver meets Brian Cox (2026-02-02)

--- AUDIO RULES ---
[LOW] More ambient crowd noise in market scenes (2026-02-09)

--- CONTENT RULES ---
[HIGH] Always cite specific dates, not just centuries (2026-02-04)

=== END FEEDBACK RULES ===
```

### 4.2 Priority Levels

| Priority | Effect |
|----------|--------|
| `high` | Included in EVERY prompt. Violation = automatic quality gate failure. |
| `medium` | Included in every prompt. Violation = warning (logged, doesn't block). |
| `low` | Included only when the category is relevant (audio rules in audio prompts only). |

### 4.3 Quality Gate Integration

The quality gates (VIDEO-SPEC.md Section 13) include feedback compliance:

```
CHECK: Feedback Compliance
  For each HIGH priority rule:
    - Verify output doesn't violate the rule
    - If violated → FAIL: "Violates feedback rule: [rule text]"
  For each MEDIUM priority rule:
    - Check compliance
    - If violated → WARNING (logged, doesn't block)
```

---

## 5. Feedback Storage Format

### File: `data/feedback/rules.json`

```typescript
interface FeedbackRule {
  id: string;                           // Unique ID (fb-001, fb-002, ...)
  createdAt: string;                    // ISO 8601
  createdBy: 'user' | 'system';        // User feedback or auto-generated
  category: string;                     // e.g., "visual.backgrounds"
  rule: string;                         // The actual rule text
  priority: 'high' | 'medium' | 'low';
  scope: 'all_videos' | 'theme' | 'single_video';
  theme?: string;                       // If scope is 'theme'
  videoId?: string;                     // If scope is 'single_video'
  active: boolean;                      // Can be deactivated
  appliedCount: number;                 // How many videos this rule influenced
  sourceVideoId?: string;              // Which video triggered this feedback
}
```

### Example rules.json

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
      "sourceVideoId": "pyramids-2026-02-01"
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
  "version": 2,
  "lastUpdated": "2026-02-05T16:00:00Z"
}
```

---

## 6. Feedback Lifecycle

```
1. VIDEO PREVIEW GENERATED
   └── User watches 480p preview via n8n link

2. USER GIVES FEEDBACK (via n8n form)
   └── Types feedback text
   └── Selects category from dropdown
   └── Submits

3. FEEDBACK STORED
   └── Added to rules.json
   └── priority: high, scope: all_videos (defaults)
   └── active: true, appliedCount: 0

4. VIDEO REGENERATED (or next video generated)
   └── All active rules injected into LLM prompt
   └── Quality gates check compliance
   └── appliedCount incremented

5. USER REVIEWS AGAIN
   └── If issue fixed → feedback confirmed working
   └── If issue persists → user gives more specific feedback → rule text refined
   └── If feedback was wrong → user can deactivate rule

6. OVER TIME
   └── Rules accumulate → LLM output converges on user preferences
   └── Library grows → fewer quality issues
   └── Contradictory rules are flagged for resolution
```

---

## 7. Examples

### Example 1: Visual Feedback

**User types in n8n:** "The backgrounds are too dark, I can barely see the characters."

**System creates rule:**
```json
{
  "category": "visual.backgrounds",
  "rule": "Backgrounds must have sufficient brightness for characters to be visible. Use lighter base colors and add a soft ambient light overlay. Characters should always contrast against their background.",
  "priority": "high",
  "scope": "all_videos"
}
```

### Example 2: Camera Feedback

**User types:** "Too many zoom-ins, feels claustrophobic."

**System creates rule:**
```json
{
  "category": "camera.framing",
  "rule": "Limit dramaticZoom and slowZoomIn to maximum 4 uses per video. Prefer medium shots (zoom 1.0-1.3) over close-ups (zoom > 1.5). Use more establishing shots and pans.",
  "priority": "high",
  "scope": "all_videos"
}
```

### Example 3: Tone Feedback

**User types:** "Professor sounds too much like a textbook."

**System creates rule:**
```json
{
  "category": "text.tone",
  "rule": "Professor Pint must sound like he's telling a story at a pub, not reading from a textbook. Use conversational language: 'Right, so get this...' instead of 'The historical significance of...'. Include reactions: 'I mean, can you believe that?', 'Mate, this is where it gets crazy.'",
  "priority": "high",
  "scope": "all_videos"
}
```

### Example 4: Asset Library Feedback

**User types:** "The palm trees look too simple compared to the buildings."

**System creates rule AND flags for library update:**
```json
{
  "category": "visual.backgrounds",
  "rule": "Palm tree assets need more detail — more fronds, trunk texture, color depth. Current palm_tree_tall and palm_tree_short need library update.",
  "priority": "high",
  "scope": "all_videos"
}
```

The pipeline flags `palm_tree_tall` and `palm_tree_short` for manual improvement in the next asset library update session.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial specification with dashboard |
| 2.0 | 2026-02-11 | Removed dashboard — n8n approval flow only. Simplified collection. Added asset library feedback example. |
