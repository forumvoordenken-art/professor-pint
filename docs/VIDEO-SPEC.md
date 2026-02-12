# Professor Pint — Video Specification v2.0

> **This is the single source of truth for every video produced by the Professor Pint pipeline.**
> Every rule in this document is a HARD constraint unless explicitly marked as [GUIDELINE].
> The LLM must follow this spec exactly. Deviations trigger a quality check failure and regeneration.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Video Structure](#2-video-structure)
3. [Scene Specification](#3-scene-specification)
4. [Asset Library System](#4-asset-library-system)
5. [Scene Composition (How Scenes Are Built)](#5-scene-composition-how-scenes-are-built)
6. [Character Specification](#6-character-specification)
7. [Crowd System](#7-crowd-system)
8. [Camera & Movement](#8-camera--movement)
9. [Animation Library](#9-animation-library)
10. [Audio & Music](#10-audio--music)
11. [Subtitles & Text](#11-subtitles--text)
12. [Overlays & Data Visualization](#12-overlays--data-visualization)
13. [Quality Gates](#13-quality-gates)
14. [YouTube Metadata](#14-youtube-metadata)
15. [Content Guidelines](#15-content-guidelines)
16. [Appendix: SceneData Schema](#appendix-scenedata-schema)

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
- **Oil painting quality** — every scene must look like a painting (Vermeer lighting, Caravaggio chiaroscuro, Renaissance composition).
- Rich color palettes: minimum 60 distinct colors per composed scene.
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
│  HOOK within first 10 seconds.                               │
├─────────────────────────────────────────────────────────────┤
│  BODY — Theme Scenes (85-90% of video)                       │
│  20-50+ visually distinct scenes.                            │
│  Professor is IN the scene, walking through history.         │
│  Landscapes, close-ups, crowd scenes, detail shots.          │
│  [GUIDELINE] New visual every 10-20 seconds.                 │
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
| Scene duration | **[GUIDELINE] 10-20 seconds** per scene (300-600 frames). May extend to 30s (900 frames) if camera movement + content justify it. |
| Same visual | **[GUIDELINE]** Avoid showing the same composed background for more than 20 seconds. Variations of the same base (different camera angle, time of day, lighting) count as visually different. |
| Background reuse | A background composition MAY reappear later (e.g., return to a location) but never twice in a row. |
| Scene count | **[GUIDELINE]** Minimum 35 scenes for a 10-minute video. ~1 scene per 15 seconds average. |
| Transition variety | Never use the same transition type more than 3 times in a row. |
| Emotion variety | Professor must show at least 4 different emotions per 2-minute segment. |
| Energy curve | Build tension: start medium → high → cooldown → higher → climax → resolution → outro. |
| Price-quality | Always optimize for best visual result at lowest token/generation cost. Reuse library assets whenever possible. |

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

## 4. Asset Library System

### 4.1 Core Concept

Instead of generating every SVG from scratch per video, we maintain a **pre-built, fine-tuned library of composable SVG components**. Each component is tested and approved in Remotion Studio before it enters the library. The LLM's job is to **compose scenes from library assets**, not to draw from scratch.

```
TRADITIONAL (expensive, unpredictable):
  LLM → generates 500 lines SVG from scratch → hope it looks good

ASSET LIBRARY (cheap, guaranteed quality):
  LLM → selects components from library → composes into scene → guaranteed quality
```

### 4.2 Asset Categories

The library is organized into composable categories:

```
src/assets/
├── skies/                    # Sky and horizon components
│   ├── sunset_warm.tsx       # Warm orange/pink sunset
│   ├── sunset_cold.tsx       # Purple/blue sunset
│   ├── day_clear.tsx         # Clear blue sky
│   ├── day_cloudy.tsx        # Overcast
│   ├── night_stars.tsx       # Starry night
│   ├── night_moon.tsx        # Moonlit night
│   ├── dawn_golden.tsx       # Golden hour dawn
│   ├── storm_dark.tsx        # Dark stormy sky
│   └── sandstorm.tsx         # Desert sandstorm
│
├── terrain/                  # Ground and landscape base
│   ├── sand_flat.tsx         # Desert sand
│   ├── sand_dunes.tsx        # Rolling sand dunes
│   ├── sand_riverbank.tsx    # Sandy riverbank
│   ├── grass_plain.tsx       # Green grassland
│   ├── grass_hill.tsx        # Rolling hills
│   ├── snow_field.tsx        # Snowy ground
│   ├── rocky_mountain.tsx    # Mountain terrain
│   ├── jungle_floor.tsx      # Tropical ground
│   ├── cobblestone.tsx       # City streets
│   ├── marble_floor.tsx      # Indoor temple/palace
│   └── dirt_path.tsx         # Rural pathway
│
├── water/                    # Water elements (all animated)
│   ├── river_calm.tsx        # Calm flowing river
│   ├── river_rapid.tsx       # Fast rapids
│   ├── lake_still.tsx        # Still lake with reflections
│   ├── ocean_waves.tsx       # Ocean with waves
│   ├── waterfall.tsx         # Cascading waterfall
│   ├── puddle.tsx            # Small puddle with ripples
│   ├── canal.tsx             # Man-made canal (Aztec/Venice)
│   └── swamp.tsx             # Murky swamp water
│
├── vegetation/               # Trees, plants, crops
│   ├── palm_tree_tall.tsx    # Tall palm (animated sway)
│   ├── palm_tree_short.tsx   # Short palm
│   ├── oak_tree.tsx          # European oak
│   ├── pine_tree.tsx         # Northern pine
│   ├── dead_tree.tsx         # Bare/dead tree
│   ├── jungle_tree.tsx       # Tropical canopy tree
│   ├── bush_green.tsx        # Green bush
│   ├── bush_flowering.tsx    # Flowering bush
│   ├── reed_cluster.tsx      # River reeds
│   ├── papyrus.tsx           # Egyptian papyrus plants
│   ├── cactus.tsx            # Desert cactus
│   ├── crop_wheat.tsx        # Wheat field
│   ├── crop_corn.tsx         # Corn/maize stalks
│   ├── vine_hanging.tsx      # Hanging vines
│   └── flower_patch.tsx      # Ground flowers
│
├── structures/               # Buildings, monuments, objects
│   ├── egypt/
│   │   ├── pyramid_great.tsx       # Great Pyramid of Giza
│   │   ├── pyramid_small.tsx       # Smaller pyramid
│   │   ├── sphinx.tsx              # Great Sphinx
│   │   ├── obelisk.tsx             # Stone obelisk
│   │   ├── temple_entrance.tsx     # Temple front with columns
│   │   ├── temple_interior.tsx     # Temple inside
│   │   ├── mud_brick_house.tsx     # Worker housing
│   │   ├── royal_palace.tsx        # Pharaoh's palace
│   │   ├── reed_boat.tsx           # Nile reed boat
│   │   ├── sarcophagus.tsx         # Decorated sarcophagus
│   │   ├── hieroglyph_wall.tsx     # Wall of hieroglyphics
│   │   └── construction_ramp.tsx   # Pyramid building ramp
│   │
│   ├── aztec/
│   │   ├── templo_mayor.tsx        # Great temple pyramid
│   │   ├── pyramid_stepped.tsx     # Stepped pyramid
│   │   ├── chinampa.tsx            # Floating garden plot
│   │   ├── market_stall.tsx        # Tlatelolco market stall
│   │   ├── aqueduct.tsx            # Stone aqueduct
│   │   ├── causeway.tsx            # Lake causeway
│   │   ├── skull_rack.tsx          # Tzompantli
│   │   ├── noble_house.tsx         # Aztec noble dwelling
│   │   ├── canoe.tsx               # Aztec canoe
│   │   └── altar_stone.tsx         # Sacrificial altar
│   │
│   ├── roman/
│   │   ├── colosseum.tsx           # Roman Colosseum
│   │   ├── forum.tsx               # Roman Forum
│   │   ├── aqueduct_roman.tsx      # Roman aqueduct
│   │   ├── villa.tsx               # Roman villa
│   │   ├── road_roman.tsx          # Paved Roman road
│   │   ├── triumphal_arch.tsx      # Victory arch
│   │   ├── temple_roman.tsx        # Roman temple
│   │   ├── bathhouse.tsx           # Public baths
│   │   └── senate.tsx              # Senate building
│   │
│   ├── viking/
│   │   ├── longship.tsx            # Viking longship
│   │   ├── mead_hall.tsx           # Great hall
│   │   ├── stave_church.tsx        # Wooden stave church
│   │   ├── runestone.tsx           # Carved runestone
│   │   ├── longhouse.tsx           # Viking longhouse
│   │   ├── forge.tsx               # Blacksmith forge
│   │   └── dock.tsx                # Harbour dock
│   │
│   ├── medieval/
│   │   ├── castle.tsx              # Medieval castle
│   │   ├── cathedral.tsx           # Gothic cathedral
│   │   ├── market_medieval.tsx     # Medieval market square
│   │   ├── windmill.tsx            # Windmill
│   │   ├── tavern.tsx              # Medieval tavern
│   │   └── city_wall.tsx           # Fortified city wall
│   │
│   ├── modern/
│   │   ├── pub_interior.tsx        # Professor's pub (HOME BASE)
│   │   ├── stock_exchange.tsx      # Trading floor
│   │   ├── bank_interior.tsx       # Bank interior
│   │   ├── office_tower.tsx        # Modern office building
│   │   └── classroom.tsx           # University classroom
│   │
│   └── generic/
│       ├── campfire.tsx            # Campfire (animated flames)
│       ├── torch_wall.tsx          # Wall-mounted torch
│       ├── wooden_fence.tsx        # Wooden fence
│       ├── stone_wall.tsx          # Generic stone wall
│       ├── wooden_bridge.tsx       # Small bridge
│       ├── well.tsx                # Stone well
│       └── cart.tsx                # Wooden cart
│
├── props/                    # Small objects and details
│   ├── pint_glass.tsx        # Professor's beer (PERMANENT)
│   ├── scroll.tsx            # Ancient scroll
│   ├── treasure_chest.tsx    # Open chest with gold
│   ├── sword.tsx             # Generic sword
│   ├── shield_round.tsx      # Round shield
│   ├── pottery.tsx           # Clay pots
│   ├── basket.tsx            # Woven basket
│   ├── coin_stack.tsx        # Stack of coins
│   ├── book_open.tsx         # Open book
│   ├── telescope.tsx         # Telescope
│   ├── map_scroll.tsx        # Rolled map
│   └── banner.tsx            # Hanging banner (animated)
│
├── atmosphere/               # Overlay effects
│   ├── dust_particles.tsx    # Floating dust (animated)
│   ├── embers.tsx            # Rising embers (animated)
│   ├── mist_low.tsx          # Low-lying mist
│   ├── fog_thick.tsx         # Dense fog
│   ├── rain.tsx              # Rainfall (animated)
│   ├── snow_falling.tsx      # Snowfall (animated)
│   ├── light_rays_sun.tsx    # Sun beam rays
│   ├── light_rays_torch.tsx  # Torch light glow
│   ├── smoke_rising.tsx      # Smoke column
│   ├── sandstorm_particles.tsx # Blowing sand
│   └── fireflies.tsx         # Glowing fireflies (animated)
│
├── lighting/                 # Final layer overlays
│   ├── vignette_dark.tsx     # Dark vignette
│   ├── vignette_warm.tsx     # Warm golden vignette
│   ├── vignette_cold.tsx     # Blue/cold vignette
│   ├── color_grade_warm.tsx  # Warm color grading overlay
│   ├── color_grade_cold.tsx  # Cold color grading overlay
│   ├── color_grade_sepia.tsx # Sepia/antique overlay
│   └── directional_light.tsx # Configurable directional light source
│
└── foreground/               # Foreground framing elements
    ├── column_left.tsx       # Stone column on left edge
    ├── column_right.tsx      # Stone column on right edge
    ├── arch_frame.tsx        # Archway framing
    ├── foliage_left.tsx      # Leaves/branches on left
    ├── foliage_right.tsx     # Leaves/branches on right
    ├── rocks_bottom.tsx      # Rocks at bottom of frame
    ├── torch_frame.tsx       # Torches on edges (animated)
    └── sand_foreground.tsx   # Sand dune in foreground
```

### 4.3 Asset Component Interface

Every asset component follows a standard interface:

```tsx
interface AssetProps {
  frame: number;            // Current frame for animation
  x?: number;               // Horizontal position (default 0)
  y?: number;               // Vertical position (default 0)
  scale?: number;           // Size multiplier (default 1.0)
  opacity?: number;         // Transparency (default 1.0)
  mirror?: boolean;         // Flip horizontally (default false)
  colorShift?: string;      // Optional hue/tint adjustment
}
```

### 4.4 Asset Quality Standards

Every asset in the library MUST meet these standards BEFORE being added:

| Standard | Requirement |
|----------|-------------|
| Tested in Remotion Studio | Visually verified at 1080p, animation smooth at 30fps |
| Oil painting style | Gradients, texture, no flat colors |
| Animated | At least 1 element uses `frame` for motion (vegetation sways, water flows, fire flickers) |
| Perspective-correct | Component has a defined depth zone and scales correctly |
| Compositionally clean | No overlap artifacts, clean edges, works alongside other assets |
| Documented | Each asset has a comment header describing what it is, its default size, and intended depth zone |

### 4.5 How Assets Create "Unique" Scenes

A single set of library assets can produce dozens of visually distinct scenes through:

| Variation Method | Example |
|-----------------|---------|
| **Different combination** | Same pyramid, but with different sky + different foreground + different crowd |
| **Camera angle** | Same scene assets, but camera pans left→right vs a slow zoom in |
| **Time of day** | Same structures, but `sunset_warm` sky vs `night_stars` sky |
| **Lighting** | Same scene, but `vignette_warm` vs `vignette_cold` changes the entire mood |
| **Weather** | Same terrain, but add `rain` + `fog_thick` + `color_grade_cold` |
| **Crowd activity** | Same location, but crowd figures are building vs celebrating vs marching |
| **Foreground framing** | Same background, but framed through an `arch_frame` vs `foliage_left` |
| **Color shift** | Same assets with a warm tint (golden hour) vs cool tint (dawn) |

### 4.6 Building the Library (One-Time Investment)

The library is built incrementally:

1. **Phase 1 — Universal assets** (skies, terrain, water, vegetation, atmosphere, lighting, foreground). These work in ANY video regardless of theme. ~50 assets.
2. **Phase 2 — Egypt theme** (structures/egypt/ + Egyptian characters + Egyptian crowd). Enough for full Egypt videos. ~25 assets.
3. **Phase 3 — Additional themes** as needed (Roman, Viking, Aztec, Medieval, Modern). Each theme adds ~15-25 structures + 10-20 characters.

Each asset is **fine-tuned once** in Remotion Studio, then reused forever. This is the opposite of "generate and pray" — it's "perfect once, use everywhere."

### 4.7 When the LLM DOES Generate New SVG

For rare cases where no library asset exists:
1. LLM generates a new asset following the standard interface
2. Asset passes quality gates (Section 13)
3. If approved, asset is added to the library for future reuse
4. Each new video potentially grows the library

Over time, the library becomes so comprehensive that most videos need ZERO new SVG generation.

---

## 5. Scene Composition (How Scenes Are Built)

### 5.1 Composition System

The LLM composes a scene by selecting assets from the library and specifying their placement:

```typescript
interface ComposedScene {
  /** Layer 1: Sky / far background */
  sky: { asset: string; colorShift?: string };

  /** Layer 2: Terrain / ground */
  terrain: { asset: string; colorShift?: string };

  /** Layer 3: Water (optional) */
  water?: { asset: string; x: number; y: number; scale: number };

  /** Layer 4: Structures (buildings, monuments) */
  structures: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    mirror?: boolean;
  }>;

  /** Layer 5: Vegetation */
  vegetation: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    mirror?: boolean;
  }>;

  /** Layer 6: Characters + Crowd (midground) */
  characters: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
    emotion?: string;
    talking?: boolean;
    activity?: string;
  }>;

  /** Layer 7: Props (small objects) */
  props?: Array<{
    asset: string;
    x: number;
    y: number;
    scale: number;
  }>;

  /** Layer 8: Foreground framing */
  foreground?: Array<{
    asset: string;
    opacity?: number;
  }>;

  /** Layer 9: Atmosphere effects */
  atmosphere?: Array<{
    asset: string;
    opacity?: number;
  }>;

  /** Layer 10: Lighting overlay */
  lighting: {
    asset: string;
    intensity?: number;
  };
}
```

### 5.2 Scene Composer Component

A new core system component renders composed scenes:

```tsx
// src/systems/SceneComposer.tsx
// Takes a ComposedScene definition and renders all layers in order
// Each layer is a positioned SVG asset from the library
// The SceneRenderer calls SceneComposer instead of a hardcoded background
```

### 5.3 Remotion Studio Folder Structure

In Remotion Studio, the asset library is browsable:

```
Remotion Studio Sidebar:
├── 📁 Videos
│   ├── 🎬 ProfessorPint-Pyramids
│   ├── 🎬 ProfessorPint-Aztecs
│   └── 🎬 ProfessorPint-Vikings
├── 📁 Asset Library
│   ├── 📁 Skies (9 previews)
│   ├── 📁 Terrain (11 previews)
│   ├── 📁 Water (8 previews)
│   ├── 📁 Vegetation (15 previews)
│   ├── 📁 Structures
│   │   ├── 📁 Egypt (12 previews)
│   │   ├── 📁 Aztec (10 previews)
│   │   ├── 📁 Roman (9 previews)
│   │   ├── 📁 Viking (7 previews)
│   │   └── 📁 Modern (5 previews)
│   ├── 📁 Props (12 previews)
│   ├── 📁 Atmosphere (11 previews)
│   ├── 📁 Lighting (7 previews)
│   └── 📁 Foreground (8 previews)
├── 📁 Characters
│   ├── 👤 ProfessorPint (permanent)
│   ├── 📁 Egypt (10-15 characters)
│   ├── 📁 Aztec (10-15 characters)
│   ├── 📁 Roman (10-15 characters)
│   └── 📁 Modern (8 characters)
└── 📁 Crowd Figures
    ├── 📁 Egypt (12 figure types)
    ├── 📁 Aztec (12 figure types)
    └── 📁 Roman (12 figure types)
```

Each asset has its own Remotion Composition (small preview) so you can fine-tune it visually.

---

## 6. Character Specification

### 6.1 Professor Pint (Permanent Character)

Professor Pint is the only character that persists across ALL videos. He is never regenerated. He is pre-built and already in the codebase.

| Attribute | Value |
|-----------|-------|
| Appearance | Wild Einstein-like white hair, round glasses, brown vest over white shirt, dark trousers, always holds a pint glass |
| Height | ~200px at scale 1.0 (relative to 1080p canvas) |
| Position | Midground. NEVER floating in front of the scene. Feet on the ground. Cast shadow matches scene lighting. |
| Emotions | See Section 9 (Animation Library) for full list |
| Animations | Idle (breathing, blinking, sway), talking (mouth shapes, gestures), emotion transitions, activity animations |

### 6.2 Theme Characters (Pre-Built Library)

Characters are **pre-built per theme** and stored in the asset library, just like backgrounds. They are fine-tuned once in Remotion Studio, then reused across videos.

#### Character Library per Theme

| Theme | Characters (10-20 per theme) |
|-------|------------------------------|
| Ancient Egypt | Pharaoh, royal guard, scribe, slave/worker, priest, noble woman with fan, fisherman, stone mason, chariot driver, merchant, embalmer, architect, farmer, servant, musician |
| Aztec Empire | Emperor (Tlatoani), eagle warrior, jaguar warrior, priest, farmer, market vendor, noble woman, feathered dancer, canoe paddler, scribe, tribute collector, ball player |
| Roman Empire | Caesar/Emperor, legionnaire, gladiator, senator, slave, merchant, chariot racer, vestal virgin, engineer, plebeian, centurion, patrician woman |
| Vikings | Jarl, berserker, shield maiden, skald (poet), farmer, blacksmith, navigator, thrall, rune carver, trader, völva (seeress), shipbuilder |
| Modern/Finance | Banker, day trader, crypto bro, tax advisor, central banker, hedge fund manager, retail investor, debt collector, economist, startup founder |

#### Character SVG Requirements

| Requirement | Specification |
|-------------|---------------|
| Minimum SVG lines | 150+ per character |
| Distinct colors | 15+ per character |
| Historical accuracy | Clothing, tools, accessories must be period-accurate |
| Recognizability | Each character must be instantly recognizable by their role/class from appearance alone |
| Animation support | Must accept `frame`, `emotion`, `talking`, `activity` props |
| Perspective | Scale correctly when placed at different depths in a scene |
| Variants | At least 3 of the characters per theme must have a female variant |
| Tested | Visually verified in Remotion Studio at multiple scales |

#### Character Component Structure

```tsx
import React from 'react';
import type { Emotion } from '../animations/emotions';
import type { Activity } from '../animations/activities';

interface CharacterProps {
  frame: number;
  emotion?: Emotion;
  talking?: boolean;
  scale?: number;
  activity?: Activity;         // NEW: what the character is doing
  facing?: 'left' | 'right';  // NEW: direction character faces
}
```

---

## 7. Crowd System

### 7.1 Purpose
Crowds make scenes feel alive and populated. Every outdoor scene and large indoor scene MUST have crowd figures.

### 7.2 Crowd Figures (Pre-Built)

Crowd figures are simplified versions of theme characters, optimized for small scale rendering. They are part of the asset library.

| Requirement | Value |
|-------------|-------|
| Minimum figures per crowd scene | 8 |
| Maximum figures per crowd scene | 30 |
| Unique figure types per theme | 12+ |
| Animation | Each figure has at least 1 animated element (arm movement, walking cycle, tool use) |
| Perspective | Figures in background are SMALLER than figures in foreground. Correct vertical placement. |
| Activities | Figures must be DOING something relevant to the scene (building, trading, farming, fighting) |

### 7.3 Crowd Placement Rules

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

### 7.4 CrowdLayer Component

```tsx
interface CrowdConfig {
  figures: Array<{
    type: string;       // figure type from library
    x: number;
    y: number;
    scale: number;
    animOffset: number;
    activity: string;
    facing: 'left' | 'right';
  }>;
}

export const CrowdLayer: React.FC<{ config: CrowdConfig; frame: number }> = ...
```

---

## 8. Camera & Movement

### 8.1 Core Rule
**[GUIDELINE]** Every scene should have camera movement. Short static moments (2-5 seconds) are allowed if the composition quality benefits from it (e.g., a dramatic still close-up). Even "still" shots should have subtle drift (0.5-2px per second).

### 8.2 Camera Presets

| Preset | Description | Use Case |
|--------|-------------|----------|
| `slowZoomIn` | Gradually zoom from 1.0 to 1.2 | Narrative scenes, building tension |
| `slowZoomOut` | Zoom from 1.2 to 1.0 | Establishing shots, revealing scope |
| `panLeftToRight` | Horizontal pan across the scene | Detail shots (hieroglyphs, murals), wide scenes |
| `panRightToLeft` | Horizontal pan, reverse direction | Variety |
| `tiltDown` | Vertical pan from top to bottom | Tall structures (pyramids, temples) |
| `tiltUp` | Vertical pan from bottom to top | Revealing grandeur |
| `establishingShot` | Slow zoom out with slight tilt | Opening a new location |
| `dramaticZoom` | Quick zoom to 1.5x on a focal point | Revelations, dramatic moments |
| `characterTrack` | Camera follows character position | Dialogue, walking scenes |
| `followAction` | Camera follows action in the scene | Battle scenes, construction work |
| `dollyIn` | Smooth forward movement into the scene | Entering a new space |
| `subtle` | Very slight drift (x±3, y±2) | Close-ups, calm moments |
| `orbitalPan` | Gentle circular movement around focal point | Showcasing a monument or scene |
| `pushIn` | Slow dramatic push toward subject | Building to a reveal |
| `pullBack` | Slow pull away from subject | After a reveal, showing context |

### 8.3 Camera Rules

| Rule | Constraint |
|------|-----------|
| Never use the same preset more than 2x in a row | Variety is essential |
| Establishing shots use `establishingShot` or `slowZoomOut` | Setting new locations |
| Dramatic moments use `dramaticZoom` or `pushIn` | Revelations, surprises |
| Detail shots use `panLeftToRight` or `panRightToLeft` | Scanning across objects |
| Professor must stay in frame during `narrative` scenes | Use `characterTrack` if needed |
| Camera zoom range | Never below 0.8x, never above 2.5x |
| Pan range | Never more than ±200px from center |

### 8.4 CameraPath Keyframe Format

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

## 9. Animation Library

### 9.1 Emotion System (Expanded)

Beyond the original 6 emotions, the animation library supports:

| Emotion | Description | Use Case |
|---------|-------------|----------|
| `neutral` | Resting, listening | Default state |
| `happy` | Smiling, bright eyes | Positive facts, greetings |
| `shocked` | Wide eyes, open mouth | Surprising revelations |
| `thinking` | Furrowed brow, hand on chin | Explaining complex ideas |
| `angry` | Frown, tensed | Injustice, conflict |
| `sad` | Drooped features | Tragedy, loss |
| `excited` | Big grin, raised arms | "Mind blown" moments |
| `confused` | Tilted head, raised eyebrow | Setting up a question |
| `proud` | Chest out, confident smile | After explaining something well |
| `whisper` | Leaning forward, hand to mouth | Sharing a secret/fun fact |
| `dramatic` | Wide gesture, theatrical | Over-the-top professor moments |
| `skeptical` | One eyebrow up, slight smirk | "But wait..." moments |

### 9.2 Activity Animations

Characters (including Professor) can perform activities:

| Activity | Description | Characters |
|----------|-------------|------------|
| `idle` | Breathing, blinking, subtle sway | All |
| `talking` | Mouth shapes, hand gestures | All |
| `walking` | Walking cycle animation | All |
| `pointing` | Pointing at something in the scene | Professor, guides |
| `carrying` | Carrying object (stone, basket, goods) | Workers, slaves |
| `building` | Hammering, lifting, placing | Construction workers |
| `farming` | Hoeing, planting, harvesting | Farmers |
| `fighting` | Sword/weapon motion | Warriors, soldiers |
| `praying` | Kneeling or standing prayer pose | Priests |
| `trading` | Exchanging goods, gesturing | Merchants, vendors |
| `rowing` | Rowing motion | Boatmen |
| `dancing` | Rhythmic movement | Dancers, celebrants |
| `writing` | Scribbling/carving motion | Scribes |
| `presenting` | Showing/displaying something | Professor, nobles |
| `drinking` | Lifting cup/pint to mouth | Professor (signature) |
| `cheering` | Arms raised, celebrating | Crowds |

### 9.3 Environmental Animations (Built Into Assets)

These are pre-built into the library assets:

| Element | Animation | Built Into |
|---------|-----------|-----------|
| Water flow | Sine wave motion | water/*.tsx |
| Fire flicker | Multi-frequency sine | structures/*/campfire.tsx, torch_wall.tsx |
| Tree sway | Wind-driven sine | vegetation/*.tsx |
| Cloud drift | Linear horizontal scroll | skies/*.tsx |
| Flag wave | Sine wave along fabric | props/banner.tsx |
| Dust float | Particle drift | atmosphere/dust_particles.tsx |
| Ember rise | Upward particle motion | atmosphere/embers.tsx |
| Rain fall | Downward particle motion | atmosphere/rain.tsx |
| Torch glow | Pulsing light radius | atmosphere/light_rays_torch.tsx |
| Smoke rise | Upward drift with spread | atmosphere/smoke_rising.tsx |

### 9.4 Emotion Transitions
When Professor's emotion changes between scenes, use a smooth 10-frame transition. Never snap from one emotion to another.

### 9.5 Talking Animation
When Professor is talking (`talking: true`), the mouth must cycle through shapes. Minimum 4 mouth shapes per second of speech.

---

## 10. Audio & Music

### 10.1 Voice (TTS)
- **Provider**: ElevenLabs
- **Language**: English
- **Voice**: [TO BE SELECTED — must sound like an educated but casual British/American male, 40-55 years old]
- **Speed**: Natural pace. Not too fast for comprehension, not too slow to bore.
- Every `narrative` and `dialogue` scene with `talking: true` MUST have corresponding audio.
- `establishing` and `detail` scenes may have voiceover OR be music-only.

### 10.2 Background Music

| Rule | Specification |
|------|---------------|
| Always present | Every second of video has background music |
| Volume | -18dB relative to voice (voice is always clearly audible) |
| Style per theme | Must match the theme (see table below) |
| Transitions | Crossfade between music tracks over 2 seconds |
| Loopable | Music tracks must loop seamlessly |
| Source | [TO BE DETERMINED — options: Epidemic Sound, Artlist, Suno AI, royalty-free library] |

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

### 10.3 Sound Effects

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

## 11. Subtitles & Text

### 11.1 Subtitle Rules

| Rule | Specification |
|------|---------------|
| Always visible when Professor is talking | Every `talking: true` scene has subtitles |
| YouTube subtitles | Also export as .srt file for YouTube closed captions |
| Position | Bottom 15% of screen, centered |
| Max characters per line | 60 |
| Max lines visible | 2 |
| Font | Sans-serif, bold, white with dark shadow/outline |
| Size | 42-48px |
| Animation | Fade in (8 frames), stay, fade out (8 frames) |
| Language | English |

### 11.2 Board Text (Chalkboard/Overlay)
In pub scenes, the chalkboard displays key terms. In theme scenes, `boardText` is shown as an integrated overlay.

| Rule | Specification |
|------|---------------|
| Content | Short label: topic name, date, key figure, key stat |
| Max characters | 30 |
| Must be factual | No creative embellishment in boardText |
| Visibility | Must be readable in <0.5 seconds |

### 11.3 SRT Export

The pipeline automatically generates a `.srt` subtitle file alongside the video for YouTube upload:

```
1
00:00:02,000 --> 00:00:07,000
Grab a pint, because today we're going
to Ancient Egypt.

2
00:00:07,500 --> 00:00:14,000
How did they build something 147 meters tall
without cranes, without wheels, without machines?
```

---

## 12. Overlays & Data Visualization

### 12.1 Overlay Types

| Type | Use Case | Frequency |
|------|----------|-----------|
| `statCard` | Display a key statistic (e.g., "Population: 200,000") | 3-5 per video |
| `factBox` | Fun fact or "did you know" callout | 2-4 per video |
| `barChart` | Compare quantities visually | 1-2 per video |
| `topicCard` | Introduce a new sub-topic | At each major topic shift |

### 12.2 Overlay Rules
- Overlays appear WITH a scene, not replacing it.
- Overlay animates in (slide + fade), stays for readable duration, animates out.
- Never more than 1 overlay visible at a time.
- Overlay content must be factual and cited from the source material.
- Style: semi-transparent dark background, white text, accent color matching the theme.

---

## 13. Quality Gates

### 13.1 Overview
Quality gates validate composed scenes and the overall video. Since assets are pre-tested in the library, the focus shifts from "is the SVG good?" to "is the composition good?"

### 13.2 Asset Library Quality Gate (One-Time, Per Asset)

Before any asset enters the library:

```
CHECK 1: SVG Validity — parseable, no broken tags, correct viewBox
CHECK 2: Visual quality — tested in Remotion Studio at 1080p, looks "oil painting" quality
CHECK 3: Animation — uses `frame` parameter, motion is smooth at 30fps
CHECK 4: Interface — follows standard AssetProps interface
CHECK 5: Composability — works alongside other assets without artifacts
CHECK 6: Performance — renders in <50ms per frame (doesn't slow down the pipeline)
→ PASS: Added to library. FAIL: Fix and retest.
```

### 13.3 Scene Composition Quality Gate (Per Scene, Automated)

```
CHECK 1: Duration
  - Scene duration is 300-900 frames (10-30 seconds)
  - [GUIDELINE] Prefer 300-600 frames (10-20 seconds)
  → FAIL: Adjust timing.

CHECK 2: Layer Completeness
  - Scene has sky + terrain + lighting (minimum)
  - Outdoor scenes have atmosphere effect
  → FAIL: "Missing required layers: [list]."

CHECK 3: Character Placement
  - If Professor is in scene: x between 400-1500 (not at extreme edges)
  - If Professor is in scene: y places him in midground (500-800)
  - Character scale matches y-position depth zone
  → FAIL: "Professor placement incorrect."

CHECK 4: Depth & Perspective
  - Elements further up (lower y) have smaller scale values
  - At least 2 depth zones are populated
  → FAIL: "Perspective issue: [specific]."

CHECK 5: Camera Movement
  - Scene has cameraPath or camera differs from previous scene
  → FAIL: "Scene has no camera movement."

CHECK 6: Variety
  - Scene type differs from at least 1 of the 2 preceding scenes
  → FAIL: "Too many [type] scenes in a row."

CHECK 7: Subtitle Length
  - Subtitle ≤ 180 characters per scene
  - Readable within scene duration at 150 wpm
  → FAIL: "Subtitle too long."

CHECK 8: Transition
  - Transition type differs from previous 2 scenes
  → FAIL: "Use different transition."

CHECK 9: Feedback Compliance
  - For each HIGH priority feedback rule: verify no violation
  → FAIL: "Violates feedback rule: [rule text]."
```

### 13.4 Full Video Quality Gate

```
CHECK 1: Structure
  - Starts with pub scene(s), max 45 seconds
  - Ends with pub scene(s) including call-to-action
  - Total scenes ≥ 35
  → FAIL: "Video structure incomplete."

CHECK 2: Scene Type Distribution
  - At least 3 establishing, 4 detail, 2 dialogue, 2 overlay
  → FAIL: "Missing scene types: [list]."

CHECK 3: Pacing
  - No identical composed background in consecutive scenes
  - Average scene duration 10-18 seconds
  → FAIL: "[pacing issue]."

CHECK 4: Content
  - All factual claims traceable to provided sources
  - Topic fully covered
  → FAIL: "Missing content from sources."

CHECK 5: Energy Curve
  - Climax in 60-80% mark
  - Outro calmer than body
  → FAIL: "Energy curve issue."

CHECK 6: Asset Coverage
  - All referenced assets exist in library
  - No undefined component references
  → FAIL: "Missing asset: [id]. Generate or select alternative."
```

---

## 14. YouTube Metadata

### 14.1 Title
- Format: `[Hook/Question] | Professor Pint`
- Max 60 characters
- Must be intriguing — a question or surprising statement
- Examples:
  - "How 2.3 Million Stones Built a Wonder | Professor Pint"
  - "The Aztec City Bigger Than London | Professor Pint"
  - "Why Vikings Were Actually Traders | Professor Pint"

### 14.2 Description
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
[Auto-generated from scene data — every topicCard overlay = timestamp]
00:00 - Intro
[MM:SS] - [Topic label]
...

🔔 Subscribe for weekly episodes: [channel link]

#ProfessorPint #[Topic] #[Era] #History #Education
```

### 14.3 Tags
- Always include: `Professor Pint`, `education`, `history`, `explained`
- Plus 10-15 topic-specific tags generated from the content

### 14.4 Thumbnail Specification
- **1280×720** resolution
- Professor Pint on the right 1/3 with a `shocked` expression
- Key visual from the video on the left 2/3 (pyramid, temple, etc.)
- Large bold text (3-5 words max) — the hook
- High contrast, saturated colors
- YouTube-friendly face + text + bright background formula

### 14.5 Subtitles File
- Export `.srt` file alongside the rendered `.mp4`
- Upload to YouTube as closed captions
- Language: English

---

## 15. Content Guidelines

### 15.1 Research & Sources
- The user provides: **topic + source material** (articles, links, documents).
- The LLM uses ONLY the provided sources for factual claims.
- No invented statistics, dates, or facts.
- If a fact is uncertain, Professor says "historians believe" or "evidence suggests."

### 15.2 Sensitivity
- Historical violence/slavery: acknowledge respectfully, never glorify.
- Human sacrifice (Aztec, etc.): present as cultural context, not sensationalism.
- No graphic depictions — suggest through composition, not explicit imagery.
- Respect all cultures — Professor is curious and respectful, never mocking.

### 15.3 Educational Value
- Every video must teach the viewer at least 5 distinct facts they likely didn't know.
- Complex concepts are ALWAYS explained with a relatable metaphor.
- At least 1 "mind-blown" moment per video where a surprising fact is revealed dramatically.

### 15.4 Engagement Hooks
- First 10 seconds must contain a hook (surprising fact, question, or bold statement).
- Every 2-3 minutes, re-engage with a question or surprising connection.
- End with a memorable one-liner that encapsulates the episode.

---

## Appendix: SceneData Schema

```typescript
interface SceneData {
  /** Unique scene identifier */
  id: string;
  /** Start frame (inclusive) */
  start: number;
  /** End frame (exclusive) */
  end: number;
  /** Composed background (references library assets) */
  bg: string | ComposedScene;
  /** Text for chalkboard/overlay label */
  boardText?: string;
  /** Static camera position */
  camera?: {
    x: number;   // -200 to 200
    y: number;   // -150 to 150
    zoom: number; // 0.8 to 2.5
  };
  /** Dynamic camera movement (overrides camera if present) */
  cameraPath?: CameraPathData;
  /** Characters in the scene */
  characters: Array<{
    id: string;
    x: number;
    y: number;
    scale?: number;
    emotion: Emotion;
    talking: boolean;
    activity?: Activity;
    gesture?: string;
    facing?: 'left' | 'right';
  }>;
  /** Subtitle text (spoken by Professor) */
  subtitle: string;
  /** Scene transition effect */
  transition?: {
    type: 'crossfade' | 'wipe' | 'zoomIn' | 'slide' | 'iris' | 'dissolve';
    duration: number;
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
  /** Sound effects */
  sfx?: Array<{
    type: string;
    volume: number;
    startFrame?: number;
    loop?: boolean;
  }>;
  /** Background music track */
  music?: {
    track: string;
    volume: number;
    fadeIn?: number;
    fadeOut?: number;
  };
}
```

---

## Existing Videos (Reference Only)

The existing PyramidsOfGiza and AztekenVideo compositions are **reference implementations only**. They demonstrate the scene structure and pacing but are NOT YouTube-ready. They serve as templates for the pipeline to learn from.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial specification |
| 2.0 | 2026-02-11 | Major rewrite: Asset Library system replaces from-scratch SVG generation. Expanded animation library (12 emotions, 16 activities). Scene composition system. Guidelines vs hard rules. SRT subtitle export. Existing videos marked as reference only. |
