# Professor Pint — Project State

> **Lees dit aan het begin van elke nieuwe chat**

**Laatste update:** 2026-02-15

---

## STATUS: CRISIS — Geen productie, alleen technische experimenten

### Het probleem

**Doel:** Educational YouTube-kanaal bouwen met volledig geanimeerde 10-20 min video's. Characters die bewegen, praten, gebaren. Props die verschijnen. Camera's die zoomen. Kurzgesagt visuele kwaliteit.

**Realiteit:** Weken besteed aan technische experimenten zonder één enkele geanimeerde scene te produceren. Huidige scenes zijn statische SVG achtergronden met alleen procedurele overlays (twinkeling sterren, flikkering lichten). Geen character animatie. Geen prop beweging. Geen camera werk.

**Wat we hebben getest zonder te implementeren:**
1. **Element-voor-element SVG generatie** — Werkt maar te omslachtig
2. **Scene-split methode** — Sneller maar nog steeds statisch
3. **Motion Canvas vs Remotion** — Twee codebases, geen keuze gemaakt
4. **Rive character animatie** — Component gebouwd, geen character geanimeerd
5. **Sprite walkers** — Tests draaien, niet gebruikt in productie

**Het kernprobleem:** Elke keer als er vooruitgang mogelijk is, stappen we over naar een nieuw technisch experiment. Tools worden gebouwd maar niet gebruikt. Methodes worden getest maar geen keuze wordt gemaakt.

---

## Huidige Video: "The History of Money"

**Script:** `docs/videos/001-history-of-money.md`
- Duur: 10:50 minuten
- Scenes: 42 (van prehistorie tot Bitcoin)
- Gesproken woorden: ~1400
- Unieke assets: ~105

**Huidige status:** Scene 1 (Pub Exterior) en Scene 2 (Pub Interior) bestaan als statische backgrounds. Scene 3-42 zijn niet gebouwd. Geen audio. Geen character animatie. Geen echte productie.

---

## Wat er WERKEND is

### Remotion setup
- ✅ `History-of-Money` compositie met Scene 1 → Transition → Scene 2 sequencing
- ✅ `PubExteriorScene.tsx` (v10) — statische achtergrond + procedurele overlays
- ✅ `PubInteriorScene.tsx` — statische achtergrond + procedurele overlays
- ✅ Door-zoom transition tussen scenes

### Scene-split pipeline
- ✅ `split-scene-svg.js` splitst volledige scene-SVG in lagen
- ✅ Region-based layer extraction met `scenes/[scene]-regions.json`
- ✅ Document-order preservation voor correcte z-layering

### Rive integratie (NIET GEBRUIKT)
- ✅ `@remotion/rive` v4.0.422 geïnstalleerd
- ✅ `RiveCharacter.tsx` component aangemaakt
- ❌ Geen enkel character is daadwerkelijk in Rive geanimeerd
- ❌ Geen `.riv` bestanden bestaan

---

## Huidige Assets

```
public/assets/scenes/
├── pub-exterior-full.svg       (volledig statisch)
├── pub-interior-full.svg       (volledig statisch)
└── pub-exterior/               (gesplitte lagen, characters baked-in)
    ├── base.svg
    ├── sky.svg
    ├── pub.svg
    ├── lamp-left.svg
    ├── lamp-right.svg
    ├── characters.svg          (STATISCH — geen animatie)
    ├── sidewalk.svg
    └── street.svg
```

**Geen animeerbare characters. Geen losse props. Geen bewegende elementen.**

---

## Wat er MOET gebeuren

### Immediate next steps

**STOP met technische experimenten. START met produceren.**

1. **Kies ONE animatie methode** en gebruik die consequent:
   - Rive voor bone-based character animatie (praten, lopen, gebaren)
   - Remotion interpolation voor props/camera (verschijnen, bewegen, zoomen)

2. **Maak Scene 2 volledig geanimeerd:**
   - Professor Pint character in Rive (idle → talk → gesture naar bankbiljet)
   - Bankbiljet prop animated (fade in, rotate, zoom)
   - Camera slow push in
   - Sync met voice-over timing

3. **Herhaal voor Scene 3-42:**
   - Één scene per keer
   - Geen nieuwe tools bouwen
   - Gebruik bestaande pipeline

---

## Bewezen Workflow (moet consequent worden gebruikt)

### Asset generatie

1. **ChatGPT:** Genereer complete scene-PNG (1920×1080, flat colors, Kurzgesagt stijl)
2. **vectorizer.ai:** Converteer naar SVG ("Group By: None" instelling)
3. **Upload:** Zet op main via GitHub web UI → `public/assets/scenes/[naam]-full.svg`
4. **(Optioneel) Split:** Voor aparte animeerbare lagen:
   ```bash
   node scripts/split-scene-svg.js public/assets/scenes/[scene]-full.svg \
     --config scenes/[scene]-regions.json
   ```

### Character animatie (Rive) — NOG NIET GEBRUIKT

1. Genereer character parts (body, head, arms, legs) als losse PNGs via ChatGPT
2. Upload naar rive.app, zet bones op, maak animaties (walk, idle, talk)
3. Export als `.riv` → `public/assets/characters/`
4. Gebruik `<RiveCharacter>` in scene:
   ```tsx
   <RiveCharacter
     src="assets/characters/professor-pint.riv"
     animation="talk-gesture"
     style={{ position: 'absolute', left: '38%', top: '45%', width: 300, height: 400 }}
   />
   ```

---

## Tech Stack

- **Video rendering:** Remotion v4.0.422
- **Character animatie:** Rive via `@remotion/rive` (NOG NIET GEÏMPLEMENTEERD)
- **Asset pipeline:** ChatGPT (PNG) → vectorizer.ai (SVG) → split-scene-svg.js (lagen)
- **Code:** TypeScript, React
- **Testing:** GitHub Codespace + `npx remotion studio`

---

## Quick Commands

```bash
# Preview in Codespace
npx remotion studio

# Type check
npx tsc --noEmit

# Render scene naar MP4
npx remotion render src/index.ts History-of-Money out/history-of-money.mp4

# Split scene in lagen
node scripts/split-scene-svg.js public/assets/scenes/[scene]-full.svg \
  --config scenes/[scene]-regions.json

# Merge van feature branch (in Codespace)
git pull origin main
git fetch origin [branch-naam]
git checkout origin/[branch-naam] -- [exacte bestandspaden]
git add -A && git commit -m "[beschrijving]"
git push origin main
```

---

## CRITICAL: Next Session Instructions

**Als je deze chat leest aan het begin van een nieuwe sessie:**

1. **Vraag NIET** wat de gebruiker wil doen
2. **Geef GEEN** opties of keuzes
3. **Stel VOOR:** "Zal ik Scene 2 volledig animeren met Professor Pint als bewegend character?"
4. **Als ja:** Geef direct de ChatGPT prompt voor character parts, geen uitleg
5. **Bouw daarna** de geanimeerde scene met Rive character + props
6. **Push werkende code** met kant-en-klare merge commando's

**GEEN nieuwe technische experimenten. ALLEEN produceren.**
