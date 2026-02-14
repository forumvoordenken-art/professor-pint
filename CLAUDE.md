# Professor Pint — Claude Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## Wat we bouwen

**Professor Pint** — Educational YouTube videos (10-20 min) over filosofie, geschiedenis, wetenschap. Stijl: casual pub-sfeer, Nederlandse communicatie, Engelse content.

**Huidige status:** Eerste test scene werkend (Pub Exterior Night met man+dog).

**Volgende:** Meer scenes maken → complete video samenstellen → audio toevoegen → YouTube upload.

---

## Huidige Workflow (bewezen methode)

### Assets maken via ChatGPT + vectorizer.ai

1. **Scene-first**: Genereer EERST complete scene-PNG in ChatGPT (alle elementen samen als referentie)
2. **Elk element apart**: Genereer elk element los op witte achtergrond ("Geef alleen de [X] uit de vorige afbeelding")
3. **Vectorize**: Via vectorizer.ai → SVG (doel: 300-500 paden, max 16 kleuren)
4. **Upload**: Naar `public/assets/[categorie]/[naam].svg`
5. **Cleanup**: `node scripts/clean-svg-backgrounds.js`
6. **Claude animeert**: React component met animatie overlays

**Waarom scene-first?** Eén monolithische SVG (hele scene) kan NIET goed geanimeerd worden. Losse elementen WEL.

---

## ChatGPT Prompts

### Voor objecten (props, characters, structures)

```
Create a [OBJECT] as a centered illustration on pure white background.

Style (STRICT):
- Flat colors only — NO gradients, NO shadows, NO texture
- Max 16 colors
- Bold clean outlines, simple shapes
- Kurzgesagt/TED-Ed style

Output: PNG, centered on white
```

### Voor achtergronden (sky, terrain)

```
Create a wide 16:9 background showing [SCENE].

Style (STRICT):
- Flat colors only — NO gradients, NO shadows, NO texture
- Max 24 colors
- Fill entire frame edge-to-edge
- Kurzgesagt/TED-Ed style

Output: PNG, 1920x1080
```

---

## Git Workflow

**BELANGRIJK:**
- **Gebruiker werkt ALTIJD op main** (niet op branch)
- **Claude werkt op feature branch** (kan niet naar main pushen)
- **Opleverprotocol**: Claude geeft ALTIJD coderegels voor gebruiker om naar main te pushen

**Merge instructies voor gebruiker:**
```bash
# In Codespace terminal
git fetch origin [branch-naam]
git merge origin/[branch-naam] -m "[korte beschrijving]"
git push origin main
```

**Als SVG assets toegevoegd:**
```bash
node scripts/clean-svg-backgrounds.js
git add -A
git commit -m "Cleanup SVG backgrounds"
```

---

## Testing (ALLEEN in Codespace)

**NOOIT lokale servers draaien in Claude chat.** Altijd coderegels geven voor gebruiker.

```bash
# Type check
npx tsc --noEmit

# Preview in browser (in Codespace)
npx remotion studio

# Render naar bestand
npx remotion render src/index.ts Pub-Exterior out/pub-exterior.mp4
```

---

## Scene Compositie

Scenes zijn **gelaagd (z-index)**:
1. Sky (achtergrond)
2. Moon/Sun (decoratie)
3. Stars/clouds (animatie)
4. Terrain (midden)
5. Structures (pub, buildings)
6. Characters/props (voorgrond)
7. Atmosphere (fog, dust, glows)

**Hardcoded posities** - geen metadata systeem:
```ts
const PUB_H = H * 0.95;
const PUB_W = PUB_H * (1024 / 1536); // aspect ratio uit viewBox
const PUB = {
  x: (W - PUB_W) / 2,
  y: H * 0.94 - PUB_H,
  w: PUB_W,
  h: PUB_H,
};
```

---

## User Preferences

- **Communicatie**: Nederlands
- **Video content**: Engels
- **Stijl**: Casual, pub-sfeer, bier-metaforen, mix van straattaal en academisch
- **Visueel**: Gedetailleerd, levendig, veel figuren — niet minimalistisch
- **Aanpak**: Eerst plan, dan bouwen. Leg WAAROM uit zodat gebruiker kan challengen.

---

## Quick Reference

**Huidige scene:** `src/videos/PubExteriorScene.tsx`
- Pub exterior night
- Assets: sky-night.svg, terrain-street.svg, terrain-sidewalk-foreground.svg, struct-pub.svg, prop-lamp.svg, prop-moon.svg, prop-dog+man.svg
- 17 layers, animaties: stars twinkle, moon glow, lamp glow, window light, dust motes, fog

**Volgende stappen:** Zie `docs/PROJECT-STATE.md`
