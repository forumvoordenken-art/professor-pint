# Professor Pint — Project State

> **Lees dit aan het begin van elke nieuwe chat**

**Laatste update:** 2026-02-14

---

## Status: Eerste test scene werkend ✅

**Wat is AF:**
- ✅ Pub Exterior Night scene volledig werkend
  - 7 SVG assets (sky, terrain, foreground, pub, lamps, moon, man+dog)
  - 17 gelaagde animaties (stars, glows, fog, dust)
  - Hardcoded posities (geen metadata systeem)
  - Code: `src/videos/PubExteriorScene.tsx`

**Wat MOET NOG:**
- Meer scenes maken voor complete video (5-10 scenes)
- Audio toevoegen (voice-over, music, SFX)
- YouTube upload pipeline

---

## Hoe we assets maken (bewezen methode)

### Scene-First Workflow

**Stap 1: Complete scene als referentie**
Genereer in ChatGPT één volledige scene-PNG met ALLE elementen samen.

**Prompt voorbeeld:**
```
Create a wide panoramic illustration in Kurzgesagt style showing [DESCRIPTION OF FULL SCENE].
- Flat colors, max 20 colors total
- NO gradients, NO textures, NO realistic shading
- Simple geometric shapes
- 1920x1080 landscape
```

**Stap 2: Elk element apart**
Gebruik de referentie-scene om elk element los te genereren:
```
Geef alleen de [ELEMENT] uit de vorige afbeelding. Zelfde stijl, zelfde kleuren. Op pure witte achtergrond.
```

Voorbeelden:
- "Geef alleen de pub uit de vorige afbeelding"
- "Geef alleen de linker lamp uit de vorige afbeelding"
- "Geef alleen de man met hond uit de vorige afbeelding"

**Stap 3: Vectorize elk element**
- Upload PNG naar vectorizer.ai
- Settings: Fill shapes, Stack on top, Group by Color
- Download SVG (doel: 300-500 paden voor objecten, 500-2000 voor achtergronden)

**Stap 4: Upload en cleanup**
```bash
# Upload naar public/assets/[categorie]/[naam].svg
# Hernoem beschrijvend (geen ChatGPT timestamps)

# Verwijder witte achtergronden
node scripts/clean-svg-backgrounds.js
```

**Stap 5: Claude animeert**
Claude maakt React component met animatie overlays (glow, drift, bob, etc.)

---

## ChatGPT Asset Prompts

### Objecten (props, characters, structures)

```
Create a [OBJECT] as a centered illustration on pure white background.

Style rules (STRICT):
- Flat color fills only — NO gradients, NO soft shadows, NO texture, NO noise
- Maximum 16 distinct colors total
- Bold clean outlines (dark stroke, consistent width)
- Large simple shapes — avoid tiny details
- Cel-shaded look: shadow = one darker flat color per surface
- No background elements — only the object itself on white
- Style reference: Kurzgesagt / TED-Ed animation style

Output: PNG, centered on white background
```

Voorbeelden `[OBJECT]`:
- `a Victorian street lamp with glass lantern`
- `a British pub building with brick facade and wooden door`
- `a man walking a small dog, full body, casual clothing`

### Achtergronden (sky, terrain)

```
Create a wide landscape background in 16:9 aspect ratio showing [SCENE].

Style rules (STRICT):
- Flat color fills only — NO gradients, NO soft shadows, NO texture
- Maximum 24 distinct colors total
- Large simple shapes with clean edges
- Fill the entire frame edge to edge — no white borders
- Style reference: Kurzgesagt / TED-Ed animation backgrounds

Output: PNG, 1920x1080, landscape
```

Voorbeelden `[SCENE]`:
- `a night sky with scattered stars and wispy clouds`
- `a cobblestone street at night with sidewalks`
- `a grassy field with trees in the distance`

---

## vectorizer.ai Settings

- **File Format**: SVG
- **SVG Version**: SVG 1.1
- **Draw Style**: Fill shapes
- **Shape Stacking**: Stack shapes on top
- **Group By**: Color
- **Line Fit Tolerance**: Coarse (objecten) / Medium (achtergronden)
- **Gap Filler**: Fill Gaps ✅

Check padcount: `grep -c '<path' bestand.svg`

---

## Scene Compositie Patronen

### Hardcoded posities (geen metadata)

```ts
// Element sizing based on canvas height + aspect ratio
const ELEMENT_H = H * 0.75; // 75% van canvas hoogte
const ELEMENT_W = ELEMENT_H * (viewBoxW / viewBoxH); // aspect ratio uit SVG viewBox
const ELEMENT = {
  x: (W - ELEMENT_W) / 2, // gecentreerd
  y: H * 0.94 - ELEMENT_H, // bottom at 94% (grondlijn)
  w: ELEMENT_W,
  h: ELEMENT_H,
};
```

### Layering (z-index)

1. Sky (achtergrond)
2. Decoratie (moon, sun, clouds)
3. Stars/atmospheric
4. Terrain (midden/achtergrond)
5. Structures (buildings)
6. Pub/main structure
7. Window lights
8. Foreground terrain
9. Characters/props (voorgrond)
10-17. Lamps, glows, atmosphere, vignette, color grade

---

## Volgende Stappen

### Korte termijn (volgende sessie)
1. **Test PubExteriorScene in Remotion Studio** — visueel valideren
2. **Kies tweede scene** — binnen/buiten? dag/nacht? welk onderwerp?
3. **Genereer assets voor scene 2** via scene-first workflow
4. **Bouw scene 2** met zelfde layering patronen

### Middellange termijn (5-10 sessies)
- 5-10 scenes bouwen voor één complete video
- Audio pipeline: voice-over + music + SFX
- Scene transitions
- YouTube metadata generatie

### Lange termijn
- Volledige n8n automation pipeline
- Asset library uitbreiden (50+ universal assets)
- Meerdere thema's (Egypt, Rome, Medieval, etc.)
- Feedback systeem integreren

---

## Tech Stack

- **Video**: Remotion (React-based, renders to MP4)
- **Assets**: ChatGPT (PNG) → vectorizer.ai (SVG) → Remotion (animatie)
- **Code**: TypeScript, React
- **Testing**: Codespace (npx remotion studio)
- **Git**: Feature branches → main (via gebruiker)
- **Later**: n8n (automation), ElevenLabs (voice), YouTube API (upload)

---

## Hoe verder te gaan in nieuwe chat

1. Lees `CLAUDE.md` + `PROJECT-STATE.md`
2. Check huidige status in deze file
3. Test laatste scene: `npx remotion studio` in Codespace
4. Kies volgende stap uit "Volgende Stappen" sectie
5. Leg WAAROM uit voordat je begint
6. Bouw incrementeel, test vaak

---

## Quick Commands

```bash
# SVG cleanup na asset upload
node scripts/clean-svg-backgrounds.js

# Type check
npx tsc --noEmit

# Preview in Codespace browser
npx remotion studio

# Render scene naar MP4
npx remotion render src/index.ts Pub-Exterior out/pub-exterior.mp4

# Git merge van feature branch (in Codespace)
git fetch origin [branch-naam]
git merge origin/[branch-naam] -m "[beschrijving]"
git push origin main
```
