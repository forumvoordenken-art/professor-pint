# Professor Pint — Project State

> **Lees dit aan het begin van elke nieuwe chat**

**Laatste update:** 2026-02-15

---

## Status: Rive character animation integratie

### Scene-split workflow: WERKEND
De scene-split pipeline werkt volledig. Pub exterior scene rendert correct met alle lagen.

### Character animatie: Rive gekozen
Statische SVG characters kunnen niet lopen/bewegen (hele laag beweegt mee inclusief achtergrond). Rive gekozen als oplossing voor skeletal character animatie.

### Wat is AF:
- ✅ Scene-split pipeline volledig werkend (split-scene-svg.js + regions)
- ✅ Zwarte elementen bug opgelost (document-order fix + "Group By: None" re-vectorize)
- ✅ PubExteriorScene.tsx v9 met procedurele animatie overlays (stars, glow, smoke, fog)
- ✅ `@remotion/rive` geïnstalleerd (v4.0.422, matcht Remotion versie)
- ✅ `RiveCharacter` component aangemaakt (`src/components/RiveCharacter.tsx`)
- ✅ Kapotte walk animatie verwijderd (bewoog hele characters laag)

### Nog te doen:
- 🔄 **Eerste Rive character maken:**
  1. Genereer character parts (body, head, arms, legs) als losse PNGs via ChatGPT
  2. Upload naar [rive.app](https://rive.app) (gratis account)
  3. Zet bones/skeletal animation op (walk cycle, idle, etc.)
  4. Export als `.riv` bestand
  5. Zet in `public/assets/characters/`
  6. Integreer in PubExteriorScene met `<RiveCharacter>` component
- 🔄 **Meer scenes maken** voor complete video (5-10 scenes)
- 🔄 **Audio toevoegen** (voice-over, music, SFX)
- 🔄 **YouTube upload pipeline**

---

## Huidige Assets

```
public/assets/scenes/
├── pub-exterior-full.svg          (1536×1024, bron SVG van vectorizer.ai)
└── pub-exterior/                  (gegenereerd door split-scene-svg.js)
    ├── base.svg                   (brede achtergronden)
    ├── sky.svg                    (lucht, maan, sterren)
    ├── pub.svg                    (pub gebouw)
    ├── lamp-left.svg              (linker lantaarnpaal)
    ├── lamp-right.svg             (rechter lantaarnpaal)
    ├── characters.svg             (man + hond — statisch, wordt vervangen door Rive)
    ├── sidewalk.svg               (stoep)
    └── street.svg                 (straat)
```

---

## Character Animatie (Rive)

**Package:** `@remotion/rive` v4.0.422
**Component:** `src/components/RiveCharacter.tsx`

### Hoe het werkt:
```tsx
import { RiveCharacter } from '../components/RiveCharacter';

// In je scene component:
<RiveCharacter
  src="assets/characters/boy-walking.riv"
  animation="walk"
  style={{ position: 'absolute', left: '60%', bottom: '20%', width: 200, height: 300 }}
/>
```

`RemotionRiveCanvas` synct automatisch met `useCurrentFrame()` — de Rive animatie volgt exact het Remotion frame, geen timing issues.

### Rive workflow:
1. **Character parts genereren** → ChatGPT met flat-color prompt (losse body parts)
2. **Rive editor** → bones opzetten, animaties maken (walk, idle, talk)
3. **Export** → `.riv` bestand in `public/assets/characters/`
4. **Gebruik** → `<RiveCharacter>` in scene component

---

## Scene Code

**File:** `src/videos/PubExteriorScene.tsx` (v9)

**Lagen (scene-split):**
```typescript
const SCENE_LAYERS = [
  { id: 'base',       zIndex: 0 },
  { id: 'sky',        zIndex: 1 },
  { id: 'pub',        zIndex: 6 },
  { id: 'sidewalk',   zIndex: 8 },
  { id: 'street',     zIndex: 9 },
  { id: 'characters', zIndex: 10 },
  { id: 'lamp-left',  zIndex: 11 },
  { id: 'lamp-right', zIndex: 11 },
];
```

**Animatie overlays (procedureel):**
- Stars (40 twinkeling circles)
- Moon glow (radial gradient)
- Chimney smoke (18 rising puffs)
- Lamp glow (halos bij lampen)
- Pub lantern glow (flickering warmte)
- Window light (glow achter ramen)
- Dust motes (deeltjes bij lampen)
- Ground fog (drijvende ellipsen)

---

## Tech Stack

- **Video**: Remotion v4.0.422 (React-based, renders to MP4)
- **Character animatie**: Rive via `@remotion/rive` (skeletal/bone animation)
- **Assets**: ChatGPT (PNG) → vectorizer.ai (SVG, "Group By: None") → split-scene-svg.js (lagen) → Remotion (animatie)
- **Code**: TypeScript, React
- **Testing**: Codespace (npx remotion studio)
- **Git**: Feature branches → main (via `git checkout origin/branch -- files`)

---

## Quick Commands

```bash
# Scene splitten in lagen
node scripts/split-scene-svg.js public/assets/scenes/[scene]-full.svg \
  --config scenes/[scene]-regions.json \
  --output-dir public/assets/scenes/[scene]

# SVG cleanup (voor element-voor-element workflow)
node scripts/clean-svg-backgrounds.js
node scripts/crop-svg-viewbox.js

# Preview in Codespace browser
npx remotion studio

# Render scene naar MP4
npx remotion render src/index.ts Pub-Exterior out/pub-exterior.mp4

# Merge van feature branch (in Codespace)
git pull origin main
git fetch origin [branch-naam]
git checkout origin/[branch-naam] -- [bestanden]
git add -A && git commit -m "[beschrijving]" || true
git push origin main
```
