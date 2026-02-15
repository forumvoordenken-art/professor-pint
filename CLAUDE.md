# Professor Pint — Claude Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## CRITICAL: Project Status — Reset State

**Het probleem:** Weken van technische experimenten, nul geanimeerde scenes geproduceerd. De volledige codebase is gereset naar een skeleton.

**Het doel:** Educational YouTube-kanaal met **volledig geanimeerde** 10-20 min video's. Characters die bewegen, praten, gebaren. Props die verschijnen. Camera's die zoomen. Niet slideshow van statische illustraties.

**Huidige realiteit (per 2026-02-15):**
- `src/` bevat ALLEEN `index.ts` (4 regels) en `Root.tsx` (9 regels, leeg component)
- `src/components/`, `src/scenes/`, `src/assets/` bevatten alleen `.gitkeep`
- **Geen** scene componenten, **geen** animatie code, **geen** compositions
- **Geen** `public/assets/` directory
- Alleen twee referentiebestanden: `public/actors/prof_idle.png` en `public/backgrounds/pub.jpg`
- `@remotion/rive` is **NIET** geïnstalleerd (niet in package.json)

**Jouw taak:** STOP met experimenteren. START met produceren. Scene voor scene, volledig geanimeerd, tot de video af is.

---

## Wat we bouwen

**Professor Pint** — Educational YouTube-kanaal. Fictief personage (professor, tweed jasje, bril, pintje in hand) legt complexe onderwerpen uit in pub-setting. Visueel Kurzgesagt-niveau. Engels gesproken, Nederlands onderling.

**Eerste video:** "The History of Money" — 10:50 min, 42 scenes, prehistorie tot Bitcoin, ~1400 gesproken woorden, ~105 unieke assets.

**Volledig productiescript:** `docs/videos/001-history-of-money.md`

---

## Wat er WEL bestaat

### Broncode (skeleton)
```
src/
├── index.ts              → Entry point (registerRoot)
├── Root.tsx              → Lege RemotionRoot component (geen compositions)
├── components/.gitkeep   → Leeg
├── scenes/.gitkeep       → Leeg
└── assets/.gitkeep       → Leeg
```

### Referentie-assets
```
public/
├── actors/
│   └── prof_idle.png     → 281 KB, 1632×1088, Professor Pint idle pose referentie
└── backgrounds/
    └── pub.jpg           → 400 KB, pub interieur referentie/moodboard
```

### Utility scripts (werkend, niet gebruikt)
```
scripts/
├── clean-svg-backgrounds.js  → Verwijdert witte achtergronden uit vectorized SVGs
├── split-scene-svg.js         → Splitst scene-SVG in aparte lagen (sky, pub, etc.)
├── extract-svg-parts.js       → Extraheert body parts uit SVG voor debugging
├── analyze-svg-groups.js      → Analyseert SVG groepstructuur
└── crop-svg-viewbox.js        → Auto-crop SVG viewBox naar content bounds
```

### Scene regio-configuratie
```
scenes/
└── pub-exterior-regions.json  → Laag-definitie voor split-scene-svg.js
```

### Configuratie
- **Remotion:** v4.0.422 (`remotion`, `@remotion/cli`)
- **React:** v19.2.3
- **TypeScript:** v5.9.3 (strict mode)
- **Output:** JPEG format, overwrite enabled
- **Linting:** ESLint + Prettier (2 spaces, geen tabs)
- **Dev deps:** `sharp` (geïnstalleerd maar ongebruikt)

### Documentatie
```
docs/
├── PROJECT-STATE.md                    → Projectstatus
├── CHARACTER-ANIMATION-COMPARISON.md   → Vergelijking Spritesheet vs Code vs Rive
└── videos/
    └── 001-history-of-money.md         → Volledig productiescript (42 scenes, ~48 KB)
```

---

## Wat er NIET bestaat

- **Geen scene componenten** — Nul `.tsx` bestanden voor scenes
- **Geen compositions** — `Root.tsx` registreert geen `<Composition>`
- **Geen character animatie** — Geen Rive, geen procedurele SVG, geen sprites
- **Geen scene SVGs** — `public/assets/` directory bestaat niet
- **Geen audio** — Geen voice-over, geen muziek, geen SFX
- **Geen `@remotion/rive`** — Niet geïnstalleerd in package.json

---

## Wat er VOORHEEN bestond (verwijderd bij reset)

Alles hieronder is **verwijderd** uit de codebase. Zie `LEGACY_KNOWLEDGE.md` voor details.

| Verwijderd | Wat het was |
|-----------|------------|
| `src/motor/` | Over-engineered 10-laags scene compositie engine |
| `src/animaties/` | Procedurele animatie systeem (easing, emotions, idle, talking, gestures) |
| `src/personages/ProfessorPint.tsx` | 1600-regels procedurele SVG character met 12 emoties |
| `src/components/RiveCharacter.tsx` | Rive integratie component (nooit gebruikt, geen .riv bestanden) |
| `src/components/SpriteWalker.tsx` | Spritesheet walker (Ludo.ai experiment) |
| `src/components/SVGWalker.tsx` | Hybride SVG walker |
| `src/components/WalkingCharacter.tsx` | Procedurele skeletal walk cycle |
| `src/compositions/HistoryOfMoney.tsx` | Scene sequencing (Scene 1 → Transition → Scene 2) |
| `src/videos/PubExteriorScene.tsx` | Statische achtergrond + 40 sterren, maangloed, rook, mist |
| `src/videos/PubInteriorScene.tsx` | Statische achtergrond + lantaarngloed, stof, zoom 1.0→1.08 |
| `src/assets/withAssetPaint.tsx` | 466-regels oil painting effect HOC |
| `motion-canvas/` | Parallel framework experiment (volledig apart project) |
| `public/assets/scenes/*.svg` | Scene SVGs (pub-exterior-full.svg, pub-interior-full.svg, gesplitte lagen) |

---

## Workflow: Scene produceren (VERPLICHT)

### Stap 1: Asset generatie

1. **ChatGPT prompt** (exact kopiëren, geen aanpassingen):
   ```
   Create a [SCENE BESCHRIJVING] as a wide 16:9 illustration.

   Style (STRICT):
   - Flat colors only — NO gradients, NO shadows, NO texture
   - Max 20 colors
   - Bold clean outlines, simple shapes
   - Kurzgesagt/TED-Ed style

   Output: PNG, 1920x1080
   ```

2. **Vectorizer.ai:**
   - Upload PNG
   - Instelling: "Group By: None"
   - Download SVG

3. **Upload naar main:**
   - GitHub web UI → `public/assets/scenes/[naam]-full.svg`

4. **(Optioneel) Witte achtergrond verwijderen:**
   ```bash
   node scripts/clean-svg-backgrounds.js
   ```

5. **(Optioneel) Splitsen in lagen:**
   ```bash
   node scripts/split-scene-svg.js public/assets/scenes/[scene]-full.svg \
     --config scenes/[scene]-regions.json
   ```

### Stap 2: Character animatie

**Nog te bepalen welke methode.** Opties (zie `docs/CHARACTER-ANIMATION-COMPARISON.md`):

| Methode | Setup | Per character | Kwaliteit |
|---------|-------|--------------|-----------|
| Spritesheet (Ludo.ai) | 30 min | 5 min | OK |
| Programmatisch (SVG + code) | 2-3 uur | 15-30 min | OK |
| Rive (skeletal rigging) | 2-4 uur | 30-60 min | Excellent |

**Let op:** Rive vereist `npm install @remotion/rive` — is momenteel NIET geïnstalleerd.

### Stap 3: Scene code bouwen

**Claude bouwt de scene component in `src/scenes/`:**

```tsx
// src/scenes/Scene1PubExterior.tsx
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';

export const Scene1PubExterior: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Background */}
      <Img src={staticFile('assets/scenes/pub-exterior-full.svg')} />

      {/* Animated props */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: interpolate(frame, [0, 60], [-100, 400]),
        opacity: interpolate(frame, [30, 60], [0, 1]),
      }}>
        <Img src={staticFile('assets/props/item.svg')} width={200} />
      </div>

      {/* Camera movement */}
      <div style={{
        transform: `scale(${interpolate(frame, [0, 300], [1, 1.2])})`,
        transformOrigin: '50% 40%',
      }}>
        {/* scene content */}
      </div>
    </AbsoluteFill>
  );
};
```

### Stap 4: Registreer in Root.tsx

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { Scene1PubExterior } from './scenes/Scene1PubExterior';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="History-of-Money"
        component={HistoryOfMoney}
        durationInFrames={19500}  // ~10:50 @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

---

## Props Animatie (Remotion interpolation)

```tsx
const frame = useCurrentFrame();

// Fade in + move up
<div style={{
  opacity: interpolate(frame, [0, 30], [0, 1]),
  transform: `translateY(${interpolate(frame, [0, 60], [100, 0])}px)`,
}}>
  <Img src={staticFile('assets/props/item.svg')} />
</div>

// Rotate + scale
<div style={{
  transform: `
    rotate(${interpolate(frame, [0, 90], [0, 360])}deg)
    scale(${interpolate(frame, [0, 90], [0.5, 1.5])})
  `,
}}>
  <Img src={staticFile('assets/props/coin.svg')} />
</div>
```

---

## Camera Movement

```tsx
// Zoom in
<div style={{
  transform: `scale(${interpolate(frame, [0, 300], [1.0, 1.3])})`,
  transformOrigin: '50% 40%',
}}>
  {/* scene content */}
</div>

// Pan + zoom
<div style={{
  transform: `
    scale(${interpolate(frame, [0, 300], [1.0, 1.5])})
    translate(${interpolate(frame, [0, 300], [0, -50])}px, 0px)
  `,
}}>
  {/* scene content */}
</div>
```

---

## Scene Transitie

Tussen scenes gebruik `<Sequence>` in hoofdcompositie:

```tsx
<Sequence from={0} durationInFrames={300}>
  <Scene1 />
</Sequence>
<Sequence from={300} durationInFrames={90}>
  <Transition />
</Sequence>
<Sequence from={390} durationInFrames={510}>
  <Scene2 />
</Sequence>
```

**Eerder gebouwde transitie (verwijderd maar te hergebruiken):**
DoorTransition met 3 fases: zoom 1.0→2.8x in pub deur (frames 0-40), full black hold (40-55), black bars openen naar interieur (55-90).

---

## Git Workflow

### Rollen
- **Gebruiker:** werkt op `main` via GitHub Codespace
- **Claude:** werkt op feature branch, kan NIET naar main pushen

### Assets ophalen van main
```bash
git fetch origin main
git checkout origin/main -- public/assets/scenes/[naam].svg
```

### SVG assets: NOOIT committen op feature branch
- Claude fetcht SVGs van main om te gebruiken
- Claude commit ALLEEN code (.tsx, .ts, .md)
- Dit voorkomt merge conflicts

### Opleverprotocol (VERPLICHT na elke push)

**Geef ALTIJD kant-en-klare commando's:**

```bash
git pull origin main
git fetch origin [branch-naam]
git checkout origin/[branch-naam] -- [exacte bestandspaden]
git add -A && git commit -m "[beschrijving]"
git push origin main
```

**GEEN uitleg. GEEN opties. Alleen de commando's met ingevulde waarden.**

---

## Testing (in Codespace)

```bash
# Type check
npx tsc --noEmit

# Preview
npx remotion studio
# of: npm run dev

# Render
npx remotion render src/index.ts History-of-Money out/history-of-money.mp4

# Lint
npm run lint
```

**NOOIT lokale servers draaien in Claude chat.**

---

## Video Structuur: "The History of Money"

**Volledig script:** `docs/videos/001-history-of-money.md`

| Act | Scenes | Setting | Onderwerp | Duur |
|-----|--------|---------|-----------|------|
| INTRO | 1-3 | Pub | Professor introduceert topic | 0:00-0:40 |
| ACT 1 | 4-9 | Savanna → Mesopotamië | De Ruilmiddel Mythe | 0:40-2:10 |
| ACT 2 | 10-15 | Malediven → Afrika | Cowrie Schelpen | 2:10-3:45 |
| ACT 3 | 16-20 | Lydië → Griekenland | Eerste Munten | 3:45-5:00 |
| ACT 4 | 21-28 | Romeinse Rijk | Rome's Inflatie | 5:00-7:15 |
| ACT 5 | 29-33 | China → Middeleeuwen | Papiergeld & Tempeliers | 7:15-8:45 |
| ACT 6 | 34-38 | Moderne wereld | Gold Standard → Bitcoin | 8:45-10:10 |
| OUTRO | 39-42 | Terug in pub | Conclusie + CTA | 10:10-10:50 |

### Asset Totalen
| Categorie | Aantal |
|-----------|--------|
| Skies | 7 |
| Terrains | 9 |
| Water | 2 |
| Structures | 15 |
| Vegetation | 7 |
| Characters | 18 (Professor Pint hero + 17 historisch) |
| Crowd figures | 12 |
| Props | 19 |
| Foreground | 5 |
| Atmosphere | 6 |
| Lighting | 5 |
| **Totaal** | **~105** |

### Productievolgorde (8 batches)
1. **Pub** (scenes 1-3, 40-42) — 12 assets
2. **Prehistoric + Mesopotamië** (scenes 5-8) — ~15 assets
3. **Cowrie/Tropisch** (scenes 10-14) — ~8 assets
4. **Lydië + Griekenland** (scenes 16-20) — ~12 assets
5. **Rome** (scenes 22-27) — ~12 assets
6. **China + Tempeliers** (scenes 29-33) — ~16 assets
7. **Modern + Bitcoin** (scenes 35-38) — ~12 assets
8. **Props + Overlays** — ~10 items

---

## User Preferences

- **Communicatie:** Nederlands
- **Video content:** Engels
- **Stijl:** Casual pub-sfeer, bier-metaforen
- **Visueel:** Gedetailleerd, levendig, veel figuren — niet minimalistisch
- **Aanpak:** **Scene voor scene produceren. GEEN nieuwe tools. GEEN experimenten.**

---

## CRITICAL: Next Session Protocol

**Als je een nieuwe chat start:**

1. Lees dit bestand + `docs/PROJECT-STATE.md` volledig
2. **Vraag NIET** wat de gebruiker wil
3. **Geef GEEN** opties
4. **Stel VOOR:** "Zal ik beginnen met Scene 1 (Pub Exterior) op te bouwen? Ik heb de ChatGPT prompts voor de assets klaar."
5. **Als ja:** Geef direct ChatGPT prompts voor de benodigde assets
6. **Bouw scene** met character + props + camera
7. **Push** met kant-en-klare merge commando's

**GEEN technische experimenten. ALLEEN produceren.**

---

## Quick Reference

**Huidige video:** `docs/videos/001-history-of-money.md` (42 scenes)

**Bestaande code:**
- `src/index.ts` — Entry point (registerRoot)
- `src/Root.tsx` — Leeg RemotionRoot component
- `src/components/` — Leeg (.gitkeep)
- `src/scenes/` — Leeg (.gitkeep)

**Bestaande assets:**
- `public/actors/prof_idle.png` — Professor Pint referentie (1632×1088)
- `public/backgrounds/pub.jpg` — Pub interieur moodboard

**Scripts:**
- `scripts/clean-svg-backgrounds.js` — Witte achtergronden verwijderen
- `scripts/split-scene-svg.js` — SVG splitsen in lagen
- `scripts/extract-svg-parts.js` — Body parts extraheren
- `scripts/analyze-svg-groups.js` — SVG groepen analyseren
- `scripts/crop-svg-viewbox.js` — ViewBox auto-crop

**Compositions:** GEEN — Root.tsx is leeg

**Status:** Skeleton codebase. Nul scenes. Nul animatie. Nul assets.

**Volgende stap:** Scene 1 (Pub Exterior) assets genereren en bouwen.
