# Professor Pint — Video Specification v1.0

> **This is the single source of truth for every video produced by the Professor Pint pipeline.**
> Every rule in this document is a HARD constraint unless explicitly marked as [GUIDELINE].
> The LLM must follow this spec exactly. Deviations trigger a quality check failure and regeneration.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Video Structure](#2-video-structure)
3. [Scene Specification](#3-scene-specification)
4. [Background / SVG Generation](#4-background--svg-generation)
5. [Character Specification](#5-character-specification)
6. [Crowd System](#6-crowd-system)
7. [Camera & Movement](#7-camera--movement)
8. [Animation Requirements](#8-animation-requirements)
9. [Audio & Music](#9-audio--music)
10. [Subtitles & Text](#10-subtitles--text)
11. [Overlays & Data Visualization](#11-overlays--data-visualization)
12. [Quality Gates](#12-quality-gates)
13. [YouTube Metadata](#13-youtube-metadata)
14. [Content Guidelines](#14-content-guidelines)
15. [Appendix: SceneData Schema](#appendix-scenedata-schema)

---

## 1. Brand Identity

### 1.1 The Character
Professor Pint is an eccentric, Einstein-like professor who explains topics from a pub. He always holds a pint glass. He mixes street language with academic vocabulary. He uses relatable metaphors (beer, groceries, football, dating). He is sometimes theatrically surprised by his own explanations.

### 1.2 Language
- **ALL content is in English.**
- Tone: casual but smart. Think "your coolest university professor explaining things at a bar."
- Target audience: **15-30 year olds**. Language must be accessible, engaging, slightly irreverent.
- No jargon without immediate explanation via metaphor.

### 1.3 Visual Style
- **Oil painting quality** — every background must look like a painting (Vermeer lighting, Caravaggio chiaroscuro, Renaissance composition).
- Rich color palettes: minimum 60 distinct colors per background.
- Nothing minimalist — scenes must feel alive, detailed, dense with visual information.
- Every frame must be visually interesting enough to screenshot.

### 1.4 Personality Rules
| Rule | Example |
|------|---------|
| Always opens with a beer reference or pub metaphor | "Grab a pint, this one's going to blow your mind." |
| Uses everyday comparisons for complex concepts | "Think of inflation like a pint that keeps getting smaller but costs the same." |
| Theatrically shocked by his own revelations | "Wait... WHAT? That's 2.3 million stone blocks!" |
| Ends every video with a memorable one-liner | "Now you know more than 90% of people. Cheers!" |
| Never condescending — always "we're learning together" | "Let me take you there — you won't believe this." |

---

## 2. Video Structure

### 2.1 Duration
- **[GUIDELINE]** Target: 10-13 minutes (18,000 - 23,400 frames at 30fps).
- Actual length is determined by content. If the topic needs 14 minutes, that's fine. If it's complete at 9 minutes, don't pad it.
- Never under 8 minutes. Never over 15 minutes.

### 2.2 Frame Rate & Resolution
- **30 fps** — non-negotiable.
- **1920×1080** (Full HD) — non-negotiable.

### 2.3 Macro Structure

```
┌─────────────────────────────────────────────────────────────┐
│  INTRO — Pub (30-45 seconds, max 45s)                       │
│  Professor greets viewer, introduces topic, teases the       │
│  journey. "I'm taking you to [place/era]. Let's go."        │
├─────────────────────────────────────────────────────────────┤
│  BODY — Theme Scenes (85-90% of video)                       │
│  20-50+ unique scenes. Each scene = new background.          │
│  Professor is IN the scene, walking through history.         │
│  Landscapes, close-ups, crowd scenes, detail shots.          │
│  Every 10-20 seconds: NEW background.                        │
├─────────────────────────────────────────────────────────────┤
│  OUTRO — Return to Pub (30-45 seconds)                       │
│  Conclusion, key takeaway, one-liner.                        │
│  Call to action: like, subscribe, comment.                    │
│  "Cheers, see you next week!"                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Pacing Rules

| Rule | Constraint |
|------|-----------|
| Scene duration | **10-20 seconds** per scene (300-600 frames). HARD limit. |
| Same background | **Never** show the same background for more than 20 seconds continuously. |
| Background reuse | A background MAY appear again later in the video (e.g., return to a location) but never twice in a row. |
| Scene count | Minimum 35 scenes for a 10-minute video. [GUIDELINE] ~1 scene per 15 seconds average. |
| Transition variety | Never use the same transition type more than 3 times in a row. |
| Emotion variety | Professor must show at least 4 different emotions per 2-minute segment. |
| Energy curve | Build tension: start medium → high → cooldown → higher → climax → resolution → outro. |

---

## 3. Scene Specification

### 3.1 Scene Types

Every scene must be one of these types. The video must contain a MIX of all types.

| Type | Description | Professor Visible | Duration | Frequency |
|------|-------------|-------------------|----------|-----------|
| `establishing` | Wide landscape/cityscape shot. Sets the location. | No | 5-10s | Every new location |
| `narrative` | Professor explains while standing IN the scene, among people/objects. | Yes, center or 1/3 position | 10-20s | Most common (60%+) |
| `detail` | Close-up of an object, artifact, hieroglyph, etc. Camera pans slowly across it. | No | 8-15s | 10-15% of scenes |
| `crowd` | Wide shot showing many people doing an activity. Professor is among them. | Yes, blending in | 10-15s | 10-15% of scenes |
| `dialogue` | Professor interacts with a theme character (pharaoh, warrior, etc.) | Yes + other character | 10-20s | 5-10% of scenes |
| `dramatic` | High-impact moment: revelation, battle, disaster. Dramatic camera movement. | Optional | 8-15s | 2-5 per video |
| `transition` | Short bridge scene between acts. Often a travel shot. | Yes, walking/moving | 5-8s | Between major topic shifts |
| `overlay` | Data visualization, fact card, or chart appears over the scene. | Yes | 10-15s | 3-6 per video |

### 3.2 Scene Distribution Rules
- A video MUST contain at least 3 `establishing` shots.
- A video MUST contain at least 4 `detail` shots.
- A video MUST contain at least 2 `dialogue` scenes.
- A video MUST contain at least 2 `overlay` scenes.
- `narrative` scenes make up the majority. No upper limit.
- Never more than 3 `narrative` scenes in a row without breaking it up with another type.

### 3.3 Scene Composition (Visual Layout)

Every scene must follow classical composition rules:

| Rule | Description |
|------|-------------|
| **Rule of thirds** | Professor or focal point placed at 1/3 or 2/3 horizontal position, never dead center unless intentional dramatic effect. |
| **Depth** | Scenes must have foreground, midground, and background layers. Professor stands in the midground AMONG other elements, not floating in front. |
| **Perspective** | Correct vanishing points. Characters scale correctly with distance. A person in the background is smaller than one in the foreground. |
| **Integration** | Professor must look like he BELONGS in the scene. Lighting on him matches the environment. Shadow direction matches the scene. |
| **Framing** | Use natural framing (doorways, arches, trees) to guide the eye. |

---

## 4. Background / SVG Generation

### 4.1 Generation Method
The LLM generates SVG code for every background. Each background is a unique React component that accepts a `frame: number` parameter for animations.

### 4.2 SVG Quality Requirements

| Requirement | Minimum | Target |
|-------------|---------|--------|
| Distinct SVG elements | 50+ | 100+ |
| Named colors in palette | 40+ | 80+ |
| Lines of SVG code | 200+ | 500+ |
| Gradient definitions | 3+ | 8+ |
| Animated elements (using `frame`) | 3+ | 8+ |
| Foreground/midground/background layers | All 3 required | — |
| Shadow/lighting elements | 2+ | 5+ |

### 4.3 Art Style Specification

Every background MUST follow this art style:

```
STYLE: Oil painting / Old Masters quality
LIGHTING: Vermeer-style soft directional light OR Caravaggio chiaroscuro for dramatic scenes.
COLORS: Rich, warm palette. No flat colors. Use gradients to simulate paint texture.
DETAIL: Every surface has texture — stone has grain, wood has knots, water has reflections.
ATMOSPHERE: Dust particles, haze, mist, smoke — at least ONE atmospheric effect per outdoor scene.
SKY: Never a flat color. Always gradient with at least subtle cloud shapes.
GROUND: Never a single rectangle. Texture, debris, stones, grass patches, shadows.
```

### 4.4 Background Component Structure

Every generated background must follow this exact TypeScript structure:

```tsx
import React from 'react';

interface [Name]Props {
  frame: number;
  width?: number;
  height?: number;
}

export const [Name]: React.FC<[Name]Props> = ({ frame, width = 1920, height = 1080 }) => {
  // Animation calculations using frame
  const sway = Math.sin(frame * 0.05) * 3;
  const flicker = Math.sin(frame * 0.1) * 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {/* Layer 1: Sky / far background */}
      {/* Layer 2: Mid-background (buildings, mountains) */}
      {/* Layer 3: Midground (where characters stand) */}
      {/* Layer 4: Foreground elements (debris, plants, frame edges) */}
      {/* Layer 5: Atmospheric effects (dust, mist, light rays) */}
      {/* Layer 6: Lighting overlay (vignette, color grading) */}
    </svg>
  );
};
```

### 4.5 Mandatory Layers

| Layer | Description | Required |
|-------|-------------|----------|
| Sky/Background | Furthest elements: sky, horizon, distant objects | YES |
| Mid-Background | Architecture, mountains, large structures | YES (outdoor) |
| Midground | Where characters stand. Ground plane, nearby objects. | YES |
| Foreground | Elements closer to camera than characters. Frame the scene. | YES |
| Atmosphere | Particles, haze, light rays, smoke | YES (outdoor), OPTIONAL (indoor) |
| Lighting | Vignette, color grading, directional light overlay | YES |

### 4.6 Animation Requirements for Backgrounds

Every background must animate at least 3 elements using the `frame` parameter:

| Element Type | Animation | Example |
|-------------|-----------|---------|
| Water | Gentle wave motion via `Math.sin(frame * speed)` | River, lake, puddle reflections |
| Fire/Torches | Flicker via randomized `Math.sin` combinations | Torch flames, campfires |
| Vegetation | Sway in wind | Trees, grass, bushes, crops |
| Fabric/Flags | Wave motion | Banners, clothing, sails |
| Particles | Drift across scene | Dust, embers, snow, leaves |
| Light rays | Subtle pulse/shift | Sunbeams, torch glow |
| Clouds/Smoke | Slow horizontal drift | Sky clouds, chimney smoke, mist |

### 4.7 Perspective Rules

```
VANISHING POINT: Every outdoor scene must have a clear vanishing point.
GROUND PLANE: The ground must recede into the distance. Never a flat rectangle.
SCALE: Objects further away are proportionally smaller.
OVERLAP: Elements overlap naturally (tree in front of building, person in front of wall).
DEPTH CUES: Use color (bluer/lighter in distance), size, overlap, and vertical position.
```

---

## 5. Character Specification

### 5.1 Professor Pint (Permanent Character)

Professor Pint is the only character that persists across ALL videos. He is never regenerated.

| Attribute | Value |
|-----------|-------|
| Appearance | Wild Einstein-like white hair, round glasses, brown vest over white shirt, dark trousers, always holds a pint glass |
| Height | ~200px at scale 1.0 (relative to 1080p canvas) |
| Position | Midground. NEVER floating in front of the scene. Feet on the ground. Cast shadow matches scene lighting. |
| Emotions | 6 states: neutral, happy, shocked, thinking, angry, sad |
| Animations | Idle (breathing, blinking, sway), talking (mouth shapes, gestures), emotion transitions |

### 5.2 Theme Characters (Generated Per Video)

For each video, the LLM generates **10-20 unique supporting characters** appropriate to the theme.

#### Character Types (examples per theme category):

| Theme | Character Examples |
|-------|-------------------|
| Ancient Egypt | Pharaoh, royal guard, scribe, slave, priest, noble woman with fan, fisherman, stone mason, chariot driver, merchant |
| Aztec Empire | Emperor, eagle warrior, jaguar warrior, priest, farmer, market vendor, slave, noble woman, feathered dancer, canoe paddler |
| Roman Empire | Caesar, legionnaire, gladiator, senator, slave, merchant, chariot racer, vestal virgin, engineer, plebeian |
| Vikings | Jarl, berserker, shield maiden, skald, farmer, blacksmith, navigator, thrall, rune carver, trader |
| Finance/Modern | Banker, day trader, crypto bro, tax advisor, central banker, hedge fund manager, retail investor, debt collector |

#### Character SVG Requirements

| Requirement | Specification |
|-------------|---------------|
| Minimum SVG lines | 150+ per character |
| Distinct colors | 15+ per character |
| Historical accuracy | Clothing, tools, accessories must be period-accurate |
| Recognizability | Each character must be instantly recognizable by their role/class |
| Animation support | Must accept `frame`, `emotion`, `talking` props |
| Perspective | Scale correctly when placed at different depths in a scene |
| Variants | At least 3 of the characters must have a female variant |

#### Character Component Structure

```tsx
import React from 'react';
import type { Emotion } from '../animations/emotions';

interface [CharName]Props {
  frame: number;
  emotion?: Emotion;
  talking?: boolean;
  scale?: number;
}

export const [CharName]: React.FC<[CharName]Props> = ({
  frame,
  emotion = 'neutral',
  talking = false,
  scale = 1,
}) => {
  // Idle animations (breathing, blinking)
  // Emotion-based face changes
  // Talking mouth animation
  return (
    <g transform={`scale(${scale})`}>
      {/* Body */}
      {/* Clothing (period-accurate) */}
      {/* Face with emotion support */}
      {/* Accessories/tools */}
    </g>
  );
};
```

---

## 6. Crowd System

### 6.1 Purpose
Crowds make scenes feel alive and populated. Every outdoor scene and large indoor scene MUST have crowd figures.

### 6.2 Crowd Requirements

| Requirement | Value |
|-------------|-------|
| Minimum figures per crowd scene | 8 |
| Maximum figures per crowd scene | 30 |
| Unique figure types per video | 12+ |
| Animation | Each figure has at least 1 animated element (arm movement, walking cycle, tool use) |
| Perspective | Figures in background are SMALLER than figures in foreground. Correct vertical placement. |
| Activities | Figures must be DOING something relevant to the scene (building, trading, farming, fighting) |

### 6.3 Crowd Placement Rules

```
DEPTH ZONES (Y-axis on 1080p canvas):
  - Far background (y: 300-450):  Tiny figures (scale 0.2-0.4), low detail, silhouette-like
  - Mid-background (y: 450-600):  Small figures (scale 0.4-0.6), some detail
  - Midground (y: 600-750):       Medium figures (scale 0.6-0.9), full detail
  - Near-foreground (y: 750-900): Large figures (scale 0.9-1.2), high detail

SPACING: Figures must not overlap unless in a dense crowd scene.
VARIETY: No two adjacent figures should be the same type or in the same pose.
ANIMATION: Offset each figure's animation cycle by a different amount to avoid synchronized movement.
```

### 6.4 CrowdLayer Component Structure

```tsx
interface CrowdConfig {
  figures: Array<{
    type: string;       // figure type identifier
    x: number;          // horizontal position
    y: number;          // vertical position (determines depth)
    scale: number;      // size (must match y-position depth zone)
    animOffset: number; // animation cycle offset in frames
    activity: string;   // what the figure is doing
    facing: 'left' | 'right';
  }>;
}

export const CrowdLayer: React.FC<{ config: CrowdConfig; frame: number }> = ...
```

---

## 7. Camera & Movement

### 7.1 Core Rule
**Every scene has camera movement.** No fully static frames for the entire duration of a scene. Even "still" shots have subtle drift (0.5-2px per second).

### 7.2 Camera Presets

| Preset | Description | Use Case |
|--------|-------------|----------|
| `slowZoomIn` | Gradually zoom from 1.0 to 1.2 over scene duration | Narrative scenes, building tension |
| `slowZoomOut` | Zoom from 1.2 to 1.0 | Establishing shots, revealing scope |
| `panLeftToRight` | Horizontal pan across the scene | Detail shots (hieroglyphs, murals), wide scenes |
| `panRightToLeft` | Horizontal pan, reverse direction | Variety from panLeftToRight |
| `tiltDown` | Vertical pan from top to bottom | Tall structures (pyramids, temples) |
| `tiltUp` | Vertical pan from bottom to top | Revealing grandeur, looking up at monuments |
| `establishingShot` | Slow zoom out with slight tilt | Opening a new location |
| `dramaticZoom` | Quick zoom to 1.5x on a focal point | Revelations, dramatic moments |
| `characterTrack` | Camera follows character position | Dialogue, walking scenes |
| `followAction` | Camera follows action in the scene | Battle scenes, construction work |
| `dollyIn` | Smooth forward movement into the scene | Entering a new space (tomb, temple) |
| `subtle` | Very slight drift (x±3, y±2) | Close-ups, calm moments |

### 7.3 Camera Rules

| Rule | Constraint |
|------|-----------|
| Never use the same preset more than 2x in a row | Variety is essential |
| Establishing shots use `establishingShot` or `slowZoomOut` | Setting new locations |
| Dramatic moments use `dramaticZoom` | Revelations, surprises |
| Detail shots use `panLeftToRight` or `panRightToLeft` | Scanning across objects |
| Professor must stay in frame during `narrative` scenes | Use `characterTrack` if needed |
| Camera zoom range | Never below 0.8x, never above 2.5x |
| Pan range | Never more than ±200px from center |

### 7.4 CameraPath Keyframe Format

```typescript
interface CameraPathData {
  keyframes: Array<{
    frame: number;    // frame number within scene
    x: number;        // horizontal offset (-200 to 200)
    y: number;        // vertical offset (-150 to 150)
    zoom: number;     // zoom level (0.8 to 2.5)
  }>;
  easing: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
}
```

---

## 8. Animation Requirements

### 8.1 Nothing Is Static
Every visible element must have at least subtle animation:

| Element | Animation Type | Frame Expression |
|---------|---------------|-----------------|
| Professor (idle) | Breathing, blinking, sway | Built into character component |
| Professor (talking) | Mouth shapes, hand gestures | Driven by `talking: true` |
| Crowd figures | Activity cycles, breathing, movement | Driven by `frame + animOffset` |
| Water | Wave motion | `Math.sin(frame * 0.03 + offset) * amplitude` |
| Fire/Torches | Flicker | `Math.sin(frame * 0.15) * 3 + Math.sin(frame * 0.23) * 2` |
| Trees/Plants | Sway | `Math.sin(frame * 0.02 + offset) * 5` |
| Clouds | Drift | `(frame * 0.3) % width` for looping horizontal drift |
| Flags/Fabric | Wave | `Math.sin(frame * 0.08 + x * 0.1) * 4` |
| Dust/Particles | Float across scene | Position = initial + frame * speed |
| Light rays | Subtle pulse | `opacity: 0.3 + Math.sin(frame * 0.02) * 0.1` |

### 8.2 Emotion Transitions
When Professor's emotion changes between scenes, use a smooth 10-frame transition. Never snap from one emotion to another.

### 8.3 Talking Animation
When Professor is talking (`talking: true`), the mouth must cycle through shapes. Minimum 4 mouth shapes per second of speech.

---

## 9. Audio & Music

### 9.1 Voice (TTS)
- **Provider**: ElevenLabs
- **Language**: English
- **Voice**: [TO BE SELECTED — must sound like an educated but casual British/American male, 40-55 years old]
- **Speed**: Natural pace. Not too fast for comprehension, not too slow to bore.
- Every `narrative` and `dialogue` scene with `talking: true` MUST have corresponding audio.
- `establishing` and `detail` scenes may have voiceover OR be music-only.

### 9.2 Background Music

| Rule | Specification |
|------|---------------|
| Always present | Every second of video has background music |
| Volume | -18dB relative to voice (voice is always clearly audible) |
| Style per theme | Must match the theme (see table below) |
| Transitions | Crossfade between music tracks over 2 seconds |
| Loopable | Music tracks must loop seamlessly |

#### Music Style per Theme Category

| Theme | Music Style |
|-------|-------------|
| Ancient Egypt | Ambient Middle Eastern: oud, darbuka, bamboo flute, drone pads |
| Aztec/Maya | Ambient Mesoamerican: clay flute, wooden drums, rain stick, chanting |
| Roman Empire | Ambient Mediterranean: lyre, hand drums, brass drone |
| Medieval | Ambient Medieval: lute, hand drum, recorder, monastery chants |
| Vikings/Norse | Ambient Nordic: nyckelharpa, tagelharpa, deep war drums |
| Modern/Finance | Lo-fi chill beats, subtle electronic, jazz piano |
| War/Battle | Intense drums, brass stabs, tension strings |

### 9.3 Sound Effects

| Scene Element | SFX |
|---------------|-----|
| Construction | Hammering, stone dragging, rope pulling |
| Crowd | Murmur, chatter (volume varies with crowd size) |
| Water | River flowing, waves, splashing |
| Fire | Crackling, roaring (scale dependent) |
| Battle | Swords, shields, war cries |
| Market | Vendors calling, coins, animals |
| Wind | Whistling (outdoor scenes) |
| Indoor | Echo, dripping (caves/tombs) |
| Transitions | Subtle whoosh between scenes |

SFX are determined by the LLM based on the scene content. Volume: -12dB relative to voice.

---

## 10. Subtitles & Text

### 10.1 Subtitle Rules

| Rule | Specification |
|------|---------------|
| Always visible when Professor is talking | Every `talking: true` scene has subtitles |
| Position | Bottom 15% of screen, centered |
| Max characters per line | 60 |
| Max lines visible | 2 |
| Font | Sans-serif, bold, white with dark shadow/outline |
| Size | 42-48px |
| Animation | Fade in (8 frames), stay, fade out (8 frames) |
| Language | English |

### 10.2 Board Text (Chalkboard/Overlay)
In pub scenes, the chalkboard displays key terms. In theme scenes, `boardText` is shown as an integrated overlay.

| Rule | Specification |
|------|---------------|
| Content | Short label: topic name, date, key figure, key stat |
| Max characters | 30 |
| Must be factual | No creative embellishment in boardText |
| Visibility | Must be readable in <0.5 seconds |

---

## 11. Overlays & Data Visualization

### 11.1 Overlay Types

| Type | Use Case | Frequency |
|------|----------|-----------|
| `statCard` | Display a key statistic (e.g., "Population: 200,000") | 3-5 per video |
| `factBox` | Fun fact or "did you know" callout | 2-4 per video |
| `barChart` | Compare quantities visually | 1-2 per video |
| `topicCard` | Introduce a new sub-topic | At each major topic shift |

### 11.2 Overlay Rules
- Overlays appear WITH a scene, not replacing it.
- Overlay animates in (slide + fade), stays for readable duration, animates out.
- Never more than 1 overlay visible at a time.
- Overlay content must be factual and cited from the source material.
- Style: semi-transparent dark background, white text, accent color matching the theme.

---

## 12. Quality Gates

### 12.1 Overview
Every generated component passes through quality gates before being accepted. If a gate fails, the component is regenerated with specific feedback.

### 12.2 Background Quality Gate

```
CHECK 1: SVG Validity
  - Valid SVG XML (parseable)
  - No missing closing tags
  - viewBox set to "0 0 1920 1080"
  → FAIL: Regenerate entirely

CHECK 2: Complexity
  - Count distinct SVG elements: must be ≥ 50
  - Count gradient definitions: must be ≥ 3
  - Count distinct colors: must be ≥ 40
  - Lines of code: must be ≥ 200
  → FAIL: "Background is too simple. Add more detail: [specific missing elements]."

CHECK 3: Layers
  - Must contain elements at y < 300 (sky/far background)
  - Must contain elements at y 300-600 (mid-background)
  - Must contain elements at y 600-800 (midground)
  - Must contain elements at y > 800 (foreground)
  → FAIL: "Missing [layer name] layer. Add elements in the y range [range]."

CHECK 4: Animation
  - Must reference `frame` parameter at least 3 times in calculations
  - Must contain at least 1 `Math.sin(frame` expression
  → FAIL: "Background is static. Add animation using the frame parameter for: [suggestions]."

CHECK 5: Art Style
  - Must contain at least 1 <linearGradient> or <radialGradient> for lighting effect
  - Must contain opacity variations (not everything at opacity 1.0)
  - Must have a vignette or lighting overlay as final layer
  → FAIL: "Missing oil-painting quality. Add gradient lighting, opacity variations, and vignette."

CHECK 6: Perspective
  - Elements higher on canvas (lower y) must generally be smaller (further away)
  - Ground plane must show recession (not a flat rectangle)
  → FAIL: "Perspective is incorrect. Ensure distant objects are smaller and the ground recedes."
```

### 12.3 Character Quality Gate

```
CHECK 1: SVG Validity (same as background)

CHECK 2: Complexity
  - Distinct SVG elements: ≥ 30
  - Distinct colors: ≥ 15
  - Lines of code: ≥ 150
  → FAIL: Regenerate with more detail.

CHECK 3: Historical Accuracy
  - Character description includes period-appropriate clothing
  - No anachronistic elements (no modern items in ancient scenes)
  → FAIL: "Character has anachronistic elements: [list]. Fix: [suggestions]."

CHECK 4: Animation Support
  - Component must accept `frame`, `emotion`, `talking` props
  - Must contain idle animation (breathing/sway)
  → FAIL: "Character is static. Add animation props and idle movement."

CHECK 5: Recognizability
  - Character role must be identifiable from visual appearance alone
  - Must have at least 1 distinctive accessory/feature
  → FAIL: "Character is too generic. Add distinctive features for a [role]."
```

### 12.4 Scene Composition Quality Gate

```
CHECK 1: Duration
  - Scene duration must be 300-600 frames (10-20 seconds)
  → FAIL: Adjust timing.

CHECK 2: Camera Movement
  - Scene must have cameraPath OR camera coordinates that differ from previous scene
  → FAIL: "Scene has no camera movement. Add a cameraPath."

CHECK 3: Variety
  - Scene type differs from at least 1 of the 2 preceding scenes
  → FAIL: "Too many [type] scenes in a row. Change this to [suggested type]."

CHECK 4: Character Placement
  - If Professor is in scene: x position is between 400-1500 (not at extreme edges)
  - If Professor is in scene: y position places him in midground (500-800)
  - Character scale matches the y-position depth zone
  → FAIL: "Professor placement is wrong. He should be at [corrected position]."

CHECK 5: Subtitle Length
  - Subtitle text ≤ 180 characters per scene
  - At normal reading speed (150 words/min), text must be readable within scene duration
  → FAIL: "Subtitle too long for scene duration. Shorten to [max] characters."

CHECK 6: Transition
  - Scene has a transition defined
  - Transition type is not the same as the previous 2 scenes
  → FAIL: "Transition variety needed. Use [suggested type] instead of [current]."
```

### 12.5 Full Video Quality Gate

```
CHECK 1: Structure
  - Starts with pub scene(s)
  - Ends with pub scene(s) including call-to-action
  - Total scenes ≥ 35
  → FAIL: "Video structure incomplete. [specific issue]."

CHECK 2: Scene Type Distribution
  - At least 3 establishing shots
  - At least 4 detail shots
  - At least 2 dialogue scenes
  - At least 2 overlay scenes
  → FAIL: "Missing scene types: [list]."

CHECK 3: Pacing
  - No scene exceeds 600 frames (20 seconds)
  - No identical background used in consecutive scenes
  - Average scene duration is 10-18 seconds
  → FAIL: "[specific pacing issue]."

CHECK 4: Content
  - All factual claims are traceable to provided sources
  - No fabricated statistics or dates
  - Topic is fully covered (all source material addressed)
  → FAIL: "Missing content from sources: [specific topics]."

CHECK 5: Energy Curve
  - Video doesn't start with the most dramatic content
  - Climax/most dramatic scene is in the 60-80% mark
  - Outro is calmer than the body
  → FAIL: "Energy curve is flat. [specific suggestion]."
```

---

## 13. YouTube Metadata

### 13.1 Title
- Format: `[Hook/Question] | Professor Pint`
- Max 60 characters
- Must contain the core topic
- Must be intriguing — a question or surprising statement
- Examples:
  - "How 2.3 Million Stones Built a Wonder | Professor Pint"
  - "The Aztec City Bigger Than London | Professor Pint"
  - "Why Vikings Were Actually Traders | Professor Pint"

### 13.2 Description
```
[Opening hook — 1 sentence that makes you click]

In this episode, Professor Pint takes you to [place/era] to explore [topic].

🍺 Key topics:
- [Topic 1]
- [Topic 2]
- [Topic 3]
- [Topic 4]

📚 Sources:
[List all sources provided by the user]

⏱️ Timestamps:
[Auto-generated from scene data — every major topic shift gets a timestamp]
00:00 - Intro
[MM:SS] - [Topic label]
...

🔔 Subscribe for weekly episodes: [channel link]

#ProfessorPint #[Topic] #[Era] #History #Education
```

### 13.3 Tags
- Always include: `Professor Pint`, `education`, `history`, `explained`
- Plus 10-15 topic-specific tags generated from the content

### 13.4 Thumbnail Specification
- **1280×720** resolution
- Professor Pint on the right 1/3 with a `shocked` expression
- Key visual from the video on the left 2/3 (pyramid, temple, etc.)
- Large bold text (3-5 words max) — the hook
- High contrast, saturated colors
- YouTube-friendly face + text + bright background formula

---

## 14. Content Guidelines

### 14.1 Research & Sources
- The user provides: **topic + source material** (articles, links, documents).
- The LLM uses ONLY the provided sources for factual claims.
- No invented statistics, dates, or facts.
- If a fact is uncertain, Professor says "historians believe" or "evidence suggests."

### 14.2 Sensitivity
- Historical violence/slavery: acknowledge respectfully, never glorify.
- Human sacrifice (Aztec, etc.): present as cultural context, not sensationalism.
- No graphic depictions — suggest through composition, not explicit imagery.
- Respect all cultures — Professor is curious and respectful, never mocking.

### 14.3 Educational Value
- Every video must teach the viewer at least 5 distinct facts they likely didn't know.
- Complex concepts are ALWAYS explained with a relatable metaphor.
- At least 1 "mind-blown" moment per video where a surprising fact is revealed dramatically.

### 14.4 Engagement Hooks
- First 10 seconds must contain a hook (surprising fact, question, or bold statement).
- Every 2-3 minutes, re-engage with a question or surprising connection.
- End with a memorable one-liner that encapsulates the episode.

---

## 15. Appendix: SceneData Schema

```typescript
interface SceneData {
  /** Unique scene identifier */
  id: string;
  /** Start frame (inclusive) */
  start: number;
  /** End frame (exclusive) */
  end: number;
  /** Background component identifier */
  bg: string;
  /** Text for chalkboard/overlay label */
  boardText?: string;
  /** Static camera position */
  camera?: {
    x: number;   // -200 to 200
    y: number;   // -150 to 150
    zoom: number; // 0.8 to 2.5
  };
  /** Dynamic camera movement (overrides camera if present) */
  cameraPath?: {
    keyframes: Array<{
      frame: number;
      x: number;
      y: number;
      zoom: number;
    }>;
    easing: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
  };
  /** Characters in the scene */
  characters: Array<{
    id: string;           // character component identifier
    x: number;            // horizontal position (0-1920)
    y: number;            // vertical position (0-1080)
    scale?: number;       // size multiplier (default 1.0)
    emotion: 'neutral' | 'happy' | 'shocked' | 'thinking' | 'angry' | 'sad';
    talking: boolean;
    gesture?: string;
  }>;
  /** Subtitle text (spoken by Professor) */
  subtitle: string;
  /** Scene transition effect */
  transition?: {
    type: 'crossfade' | 'wipe' | 'zoomIn' | 'slide' | 'iris' | 'dissolve';
    duration: number; // frames
  };
  /** Data overlays */
  overlays?: Array<{
    type: 'statCard' | 'barChart' | 'factBox' | 'topicCard';
    title: string;
    data: Record<string, number | string>;
    position?: { x: number; y: number };
  }>;
  /** Scene type for quality gate validation */
  sceneType: 'establishing' | 'narrative' | 'detail' | 'crowd' | 'dialogue' | 'dramatic' | 'transition' | 'overlay';
  /** Sound effects for this scene */
  sfx?: Array<{
    type: string;
    volume: number;    // 0.0 to 1.0
    startFrame?: number;
    loop?: boolean;
  }>;
  /** Background music track */
  music?: {
    track: string;
    volume: number;
    fadeIn?: number;   // frames
    fadeOut?: number;   // frames
  };
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial specification |
