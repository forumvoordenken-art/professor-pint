# Professor Pint — Project State

> **Lees dit aan het begin van elke nieuwe chat**

**Laatste update:** 2026-02-14

---

## Status: Pub Exterior scene — visuele bugs fixen

**Wat is AF:**
- ✅ Project opgeschoond (oude docs verwijderd, alleen CLAUDE.md + PROJECT-STATE.md)
- ✅ 7 SVG assets geüpload en in scene verwerkt
- ✅ PubExteriorScene.tsx met 17 layers en animaties
- ✅ Git workflow gedocumenteerd in CLAUDE.md

**Bekende visuele bugs (PRIORITEIT voor volgende sessie):**
1. **Trottoir (terrain-sidewalk-foreground.svg)** — heeft een wit/licht blok zichtbaar. Het cleanup script (`clean-svg-backgrounds.js`) ving het niet op. Mogelijke oorzaken:
   - Near-white kleur die niet in de whitelist staat (script checkt alleen exact `#ffffff` t/m `#fcfcfc`)
   - Of een `<rect>` element ipv `<path>` dat het script niet detecteert
   - **Fix:** Script verbeteren OF handmatig eerste witte shape verwijderen uit SVG
2. **Man+dog (prop-dog+man.svg)** — staat te klein en te laag. Aspect ratio is landscape (viewBox 1536x1024) maar het figuur zelf is portrait. De `MAN_DOG_W` berekening `H * 0.35 * (1536/1024)` maakt het te breed/plat.
   - **Fix:** Aspect ratio handmatig instellen op basis van het werkelijke figuur, niet de viewBox
3. **Maan (prop-moon.svg)** — heeft een lichtblauw/grijs rechthoekig vlak erachter zichtbaar. Witte achtergrond die niet goed is opgeschoond, of near-white kleur.
   - **Fix:** Zelfde als trottoir — cleanup script of handmatig

**Wat MOET NOG (na bugfixes):**
- Meer scenes maken voor complete video (5-10 scenes)
- Audio toevoegen (voice-over, music, SFX)
- YouTube upload pipeline

---

## Huidige Assets

```
public/assets/
├── props/
│   ├── prop-lamp.svg       (1024×1536, portrait) ✅
│   ├── prop-moon.svg       (1024×1024, square) ⚠️ achtergrond bug
│   └── prop-dog+man.svg    (1536×1024, landscape) ⚠️ sizing bug
├── sky/
│   └── sky-night.svg       (1536×1024, landscape) ✅
├── structures/
│   └── struct-pub.svg      (1024×1536, portrait) ✅
└── terrain/
    ├── terrain-street.svg              (1536×1024, landscape) ✅
    └── terrain-sidewalk-foreground.svg (1536×1024, landscape) ⚠️ achtergrond bug
```

---

## Scene Code

**File:** `src/videos/PubExteriorScene.tsx`

**Layers (z-index 1-17):**
1. Sky (top 50%, clipped)
2. Moon
3. Moon glow (radial gradient, screen blend)
4. Twinkling stars (40 circles, sine animation)
5. Terrain street (bottom 50%, scaleX 1.3)
6. Horizon blend (gradient overlay)
7. Pub building (center, 95% height)
8. Window light glow
9. Foreground sidewalk (bottom 25%) ⚠️
10. Man + dog ⚠️
11-12. Street lamps (left + mirrored right)
13. Lamp glow halos
14. Dust motes (particles near lamps)
15. Ground fog (drifting ellipses)
16. Vignette
17. Color grade (warm tint)

---

## Verwijderde Docs (deze sessie)

De volgende verouderde docs zijn verwijderd — ze beschreven systemen die niet bestaan:
- `VIDEO-SPEC.md` — fantasy asset library met .tsx components, oil painting style
- `PIPELINE-ARCHITECTURE.md` — niet-bestaande n8n automatisering
- `FEEDBACK-SYSTEM.md` — niet-bestaand feedback systeem
- `CUSTOM-GPT-INSTRUCTIONS.md` — redundant met CLAUDE.md
- `chatgpt-metadata-prompt.md` — verlaten metadata systeem

**Bewaard:** `docs/videos/001-history-of-money.md` (video productiedocument)

---

## Tech Stack

- **Video**: Remotion (React-based, renders to MP4)
- **Assets**: ChatGPT (PNG) → vectorizer.ai (SVG) → Remotion (animatie)
- **Code**: TypeScript, React
- **Testing**: Codespace (npx remotion studio)
- **Git**: Feature branches → main (via gebruiker)

---

## Quick Commands

```bash
# SVG cleanup na asset upload
node scripts/clean-svg-backgrounds.js

# Preview in Codespace browser
npx remotion studio

# Render scene naar MP4
npx remotion render src/index.ts Pub-Exterior out/pub-exterior.mp4

# Git merge van feature branch (in Codespace)
git fetch origin [branch-naam]
git merge origin/[branch-naam] -m "[beschrijving]"
node scripts/clean-svg-backgrounds.js
git add -A && git commit -m "SVG cleanup" || true
git push origin main
```
