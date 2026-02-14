# Professor Pint — Project State

> **Lees dit aan het begin van elke nieuwe chat**

**Laatste update:** 2026-02-14

---

## Status: Scene-split workflow — zwarte elementen fixen

### Grote verandering deze sessie: Scene-split vervangt element-voor-element

**Oud (v6):** Elk element apart genereren → vectorizen → cleanen → handmatig positioneren met pixel-berekeningen (480+ regels code).

**Nieuw (v9):** Eén complete scene-PNG → vectorize → split in lagen via `split-scene-svg.js` → alle lagen delen dezelfde viewBox → `position: absolute; inset: 0`. Geen handmatige positionering meer.

### Wat is AF:
- ✅ Project opgeschoond (oude docs verwijderd)
- ✅ `split-scene-svg.js` geschreven — splitst scene SVG in lagen via spatial regions
- ✅ `scenes/pub-exterior-regions.json` — region config voor pub exterior
- ✅ `PubExteriorScene.tsx` herschreven naar v9 (scene-split, SCENE_LAYERS array)
- ✅ Git workflow geüpdated: `git checkout` ipv `git merge` (voorkomt merge conflicts)
- ✅ CLAUDE.md geüpdated met scene-split workflow + vectorizer.ai valkuilen
- ✅ 3 stroke groups bug gefixt (script vond alleen de eerste)
- ✅ Fill-group extractie met depth tracking (nested `<g>` support)
- ✅ `preserveAspectRatio="none"` voor aspect ratio mismatch
- ✅ Brede elementen (>60% viewBox) → automatisch "base" layer

### Nog te verifiëren:
- ⚠️ **Zwarte elementen**: De 3-stroke-groups fix is gecommit maar nog NIET visueel geverifieerd door gebruiker. Vorige sessie waren nog zwart: pub stenen, uithangborden, maanvlekken, kat, schoorsteen, zijbord. De fix zou dit moeten oplossen maar moet getest worden in Remotion studio.

### Wat MOET NOG (na bugfixes):
- Meer scenes maken voor complete video (5-10 scenes)
- Audio toevoegen (voice-over, music, SFX)
- YouTube upload pipeline

---

## Huidige Assets

```
public/assets/scenes/
├── pub-exterior-full.svg          (1536×1024, bron SVG van vectorizer.ai)
└── pub-exterior/                  (gegenereerd door split-scene-svg.js)
    ├── base.svg                   (26 elements — brede achtergronden)
    ├── sky.svg                    (14 elements)
    ├── pub.svg                    (459 elements)
    ├── lamp-left.svg              (102 elements)
    ├── lamp-right.svg             (61 elements)
    ├── characters.svg             (22 elements)
    ├── sidewalk.svg               (24 elements)
    └── street.svg                 (2 elements)
```

Totaal: 710 elements, 0 uncategorized.

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
- Lamp glow (halos bij lampen)
- Window light (glow achter ramen)
- Dust motes (deeltjes bij lampen)
- Ground fog (drijvende ellipsen)

---

## Bugfix Geschiedenis (deze sessie)

| Bug | Oorzaak | Fix |
|-----|---------|-----|
| Zwarte gebieden (sidewalk/street) | Brede achtergronden toegewezen aan "pub" door centroid | `assignToRegion()`: >60% width → "base" layer |
| `base` bucket crash | `buckets['base']` niet geïnitialiseerd | `buckets['base'] = []` toevoegen |
| Zwarte rand onderkant | SVG 3:2 vs canvas 16:9 | `preserveAspectRatio="none"` |
| Veel zwarte elementen | Paths in `<g fill>` dubbel geëxtraheerd | Extract groups EERST, remove uit remaining |
| Nested `<g>` fout | Lazy regex `[\s\S]*?</g>` stopt bij eerste `</g>` | Depth-tracking functie |
| Alle `<g>` geëxtraheerd | Script pakte ook `<g transform>`, `<g opacity>` | Filter op `<g fill="(?!none)">` |
| Nog meer zwarte elementen | 3 stroke groups, script vond alleen eerste | Loop met depth tracking ipv `.match()` |

---

## Tech Stack

- **Video**: Remotion v4.0.422 (React-based, renders to MP4)
- **Assets**: ChatGPT (PNG) → vectorizer.ai (SVG) → split-scene-svg.js (lagen) → Remotion (animatie)
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
