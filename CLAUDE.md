# Professor Pint — Claude Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## CRITICAL: Project Crisis

**Het probleem:** Weken van technische experimenten, nul geanimeerde scenes geproduceerd.

**Het doel:** Educational YouTube-kanaal met **volledig geanimeerde** 10-20 min video's. Characters die bewegen, praten, gebaren. Props die verschijnen. Camera's die zoomen. Niet slideshow van statische illustraties.

**Jouw taak:** STOP met experimenteren. START met produceren. Scene voor scene, volledig geanimeerd, tot de video af is.

---

## Wat we bouwen

**Professor Pint** — Educational YouTube-kanaal. Fictief personage (professor, tweed, pintje) legt complexe onderwerpen uit in pub-setting. Visueel Kurzgesagt-niveau. Engels gesproken, Nederlands onderling.

**Eerste video:** "The History of Money" — 10:50 min, 42 scenes, prehistorie tot Bitcoin.

**Huidige status:** Scene 1+2 bestaan als statische achtergronden. Scene 3-42 zijn niet gebouwd. Geen character animatie. Geen productie.

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

### Stap 2: Character animatie (Rive)

**Als scene een character heeft die beweegt:**

1. **ChatGPT prompt voor character parts:**
   ```
   Create separate PNG images for a [CHARACTER] character rig:
   - Body (torso)
   - Head
   - Left arm (upper + lower)
   - Right arm (upper + lower)
   - Left leg (upper + lower)
   - Right leg (upper + lower)

   Each part on transparent background, pivot points clearly marked.
   Flat colors, Kurzgesagt style, max 12 colors.
   ```

2. **Rive.app:**
   - Upload parts
   - Zet bones op (spine, neck, shoulders, elbows, hips, knees)
   - Maak animaties: idle, talk, gesture, walk (wat nodig is)
   - Export als `.riv`

3. **Upload `.riv`:**
   - GitHub web UI → `public/assets/characters/[naam].riv`

### Stap 3: Scene code bouwen

**Claude bouwt de scene component:**

```tsx
import { RiveCharacter } from '../components/RiveCharacter';

export const SceneX: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Background */}
      <Img src={staticFile('assets/scenes/[naam]-full.svg')} />

      {/* Animated character */}
      <RiveCharacter
        src="assets/characters/professor-pint.riv"
        animation="talk-gesture"
        style={{
          position: 'absolute',
          left: '40%',
          top: '30%',
          width: 400,
          height: 600
        }}
      />

      {/* Animated props (via Remotion interpolation) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: interpolate(frame, [0, 60], [-100, 400]),
        opacity: interpolate(frame, [30, 60], [0, 1]),
      }}>
        <Img src={staticFile('assets/props/banknote.svg')} width={200} />
      </div>

      {/* Camera movement */}
      <div style={{
        transform: `scale(${interpolate(frame, [0, 300], [1, 1.2])})`,
      }}>
        {/* ... scene content ... */}
      </div>
    </AbsoluteFill>
  );
};
```

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
git checkout origin/[branch-naam] -- [exacte bestandspaden met spaties]
git add -A && git commit -m "[beschrijving]"
git push origin main
```

**Voorbeeld:**
```bash
git pull origin main
git fetch origin claude/scene-2-animated-abc123
git checkout origin/claude/scene-2-animated-abc123 -- src/videos/Scene2Animated.tsx src/components/BanknoteProps.tsx
git add -A && git commit -m "Scene 2 volledig geanimeerd: Professor + bankbiljet"
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

# Render
npx remotion render src/index.ts History-of-Money out/history-of-money.mp4
```

**NOOIT lokale servers draaien in Claude chat.**

---

## Character Animatie (Rive)

### Component gebruik

```tsx
<RiveCharacter
  src="assets/characters/professor-pint.riv"
  animation="talk-gesture"      // animatie naam uit Rive
  autoplay={true}                // start automatisch
  style={{
    position: 'absolute',
    left: '40%',
    top: '30%',
    width: 400,
    height: 600
  }}
/>
```

### Timing sync met Remotion

`RemotionRiveCanvas` synct automatisch met `useCurrentFrame()` — Rive animatie volgt exact Remotion timeline.

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
  transformOrigin: '50% 40%',  // zoom naar character
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

1. Lees `docs/PROJECT-STATE.md` volledig
2. **Vraag NIET** wat de gebruiker wil
3. **Geef GEEN** opties
4. **Stel VOOR:** "Zal ik Scene 2 volledig animeren met Professor Pint als bewegend character?"
5. **Als ja:** Geef direct ChatGPT prompts, geen uitleg
6. **Bouw scene** met Rive character + props + camera
7. **Push** met kant-en-klare merge commando's

**GEEN technische experimenten. ALLEEN produceren.**

---

## Quick Reference

**Huidige video:** `docs/videos/001-history-of-money.md` (42 scenes)

**Huidige scenes:**
- Scene 1: `src/videos/PubExteriorScene.tsx` (statisch)
- Scene 2: `src/videos/PubInteriorScene.tsx` (statisch)
- Scene 3-42: NIET GEBOUWD

**Compositie:** `src/videos/HistoryOfMoney.tsx` (sequencing)

**Components:**
- `src/components/RiveCharacter.tsx` (NIET GEBRUIKT — geen `.riv` bestanden)

**Scripts:**
- `scripts/split-scene-svg.js` (optioneel, voor gesplitte lagen)

**Status:** Twee statische scenes, geen animatie, geen productie.

**Volgende:** Scene 2 volledig animeren met Rive character.
