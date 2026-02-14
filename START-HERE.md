# 🍺 Professor Pint — START HERE

> **Schone lei. We beginnen opnieuw, rustig en overzichtelijk.**

---

## Wat we HEBBEN (en werkt)

### ✅ Render Engine (klaar voor gebruik)
```
src/motor/
├── SceneComposer.tsx          → Composeert scenes uit assets (10 lagen)
├── AssetMetadata.ts           → Metadata systeem voor asset positionering
├── PositionPresets.ts         → 18 pre-defined posities
├── withAssetPaint.tsx         → Painterly effecten per asset
├── OilPaintFilter.tsx         → SVG-based oil painting effect
├── TextureOverlay.tsx         → Canvas grain, film grain
└── [meer effecten...]         → Camera, transitions, subtitles
```

**Status:** Werkt. Getest met MozesScene.

### ✅ Animatie Systeem (klaar voor gebruik)
```
src/animaties/
├── easing.ts                  → Easing functies (cubic, sine, lerp)
├── emotions.ts                → 12 emotion states met transitions
├── idle.ts                    → Breathing, blinking, swaying
├── talking.ts                 → Mouth shapes, phoneme support
└── gestures.ts                → Wave, point, shrug, explain, cheers
```

**Status:** Werkt. Professor Pint character volledig geanimeerd.

### ✅ Character (volledig geanimeerd)
```
src/personages/
└── ProfessorPint.tsx          → 1600 regels SVG, 12 emotions, idle + talking
```

**Status:** Werkt. Klaar voor scenes.

### ✅ Tooling (scripts)
```
scripts/
└── clean-svg-backgrounds.js   → Verwijdert automatisch witte achtergronden uit SVGs
```

**Status:** Werkt. Draai voor elke push.

### ✅ Documentatie
```
docs/
├── PROJECT-STATE.md           → Huidige status + stappenplan
├── VIDEO-SPEC.md              → Brand identity, scene types, asset specs
├── PIPELINE-ARCHITECTURE.md   → End-to-end pipeline spec
├── FEEDBACK-SYSTEM.md         → n8n feedback workflow
├── chatgpt-metadata-prompt.md → ChatGPT prompt voor metadata generatie
└── CLAUDE.md                  → AI instructions (dit bestand)
```

**Status:** Up-to-date.

---

## Wat we NIET HEBBEN (en gaan maken)

### ❌ Assets (SVGs voor scenes)
```
public/assets/                 → LEEG (schone lei)
```

**Wat nodig:** Sky, terrain, structures, props voor eerste scene.

### ❌ Scene compositie (connectie assets ↔ scene)
```
src/videos/PubExteriorScene.tsx → Bestaat, maar verwijst naar niet-bestaande assets
```

**Wat nodig:** Update met echte asset IDs na generatie.

---

## 🎯 De Plan: Scene voor Scene

### **Scene 1: Pub Exterior (Night)**

**Referentie:** Je hebt de referentie-PNG al (pub met maan, straat, lantaarns).

**Wat we gaan doen:**

1. **Genereer 4 assets in ChatGPT** (15 min)
   - Night sky with full moon
   - Cobblestone street
   - Pub building (inclusief sign, wall lanterns, window boxes)
   - Victorian street lamp

2. **Vectoriseer via vectorizer.ai** (10 min)
   - Upload PNG → Download SVG
   - Hernoem netjes

3. **Plaats in Github** (2 min)
   ```
   public/assets/
   ├── sky-night-pub.svg
   ├── terrain-street.svg
   ├── struct-pub.svg
   └── prop-lamp.svg
   ```

4. **Metadata genereren** (5 min)
   - Upload referentie-PNG naar ChatGPT
   - Gebruik `docs/chatgpt-metadata-prompt.md`
   - Plak output naar Claude

5. **Scene compositie updaten** (Claude doet dit)
   - AssetMetadata.ts vullen
   - PubExteriorScene.tsx updaten met echte asset IDs
   - Animaties toevoegen (glows, particles, etc.)

6. **Render eerste scene** (5 min)
   ```bash
   npx remotion render src/index.ts Pub-Exterior out/pub.mp4
   ```

**Totaal: ~40 minuten → eerste werkende scene.**

---

## 📋 Checklist voor Scene 1

- [ ] 1. Genereer 4 PNG's in ChatGPT
- [ ] 2. Vectoriseer via vectorizer.ai
- [ ] 3. Plaats SVGs in `public/assets/`
- [ ] 4. Genereer metadata via ChatGPT
- [ ] 5. Plak metadata naar Claude
- [ ] 6. Claude update AssetMetadata.ts + scene compositie
- [ ] 7. Draai cleanup script: `node scripts/clean-svg-backgrounds.js`
- [ ] 8. Render: `npx remotion render src/index.ts Pub-Exterior out/pub.mp4`
- [ ] 9. Check resultaat, tweak metadata indien nodig
- [ ] 10. Klaar! Eerste scene af.

---

## 🚀 Na Scene 1

**Dan hebben we bewezen dat het werkt.** Daarna:

- Scene 2 (pub interior)
- Scene 3 (iets anders)
- Opschalen (meer scenes)
- Pipeline automatiseren (n8n)

**Maar eerst:** Scene 1. Eén ding tegelijk.

---

## 💡 Hoe verder?

**Zeg gewoon:** "Stap 1" en ik geef je de exacte ChatGPT prompts voor de 4 assets.

**Je rol:**
1. ChatGPT → PNG's genereren
2. Vectorizer.ai → SVG's maken
3. Github → uploaden
4. ChatGPT → metadata genereren
5. Claude → plakken

**Mijn rol:**
1. Code schrijven
2. Scene samenstellen
3. Animaties toevoegen

**Samen: Eerste scene in ~40 minuten.** 🍻
