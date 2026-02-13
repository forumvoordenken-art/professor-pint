# Professor Pint — Project Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## STAP 1: Lees docs/PROJECT-STATE.md

**docs/PROJECT-STATE.md is de ENIGE bron van waarheid voor wat er gedaan is en wat er nog moet gebeuren.**

Lees dat bestand EERST. Daarin staat:
- Huidige project status
- Alle genomen beslissingen
- Geïdentificeerde risico's
- Het complete stappenplan (Phase 0-6) met status per stap
- Welke bestanden aangemaakt moeten worden

**Doe NIETS voordat je docs/PROJECT-STATE.md hebt gelezen en begrepen.**

---

## STAP 2: Begrijp de project-structuur

### Mappenstructuur

```
professor-pint/
├── docs/                    ← Spec-documenten (plan & specs)
│   ├── PROJECT-STATE.md     ← Waar we staan + stappenplan
│   ├── VIDEO-SPEC.md        ← Alle regels voor video output
│   ├── PIPELINE-ARCHITECTURE.md  ← End-to-end pipeline spec
│   └── FEEDBACK-SYSTEM.md   ← Self-learning feedback spec
│
├── src/                     ← Alle broncode
│   ├── personages/          ← Character SVG-componenten
│   ├── videos/              ← Video compositions
│   ├── motor/               ← Render engine + post-processing (SceneComposer, withAssetPaint, OilPaintFilter, etc.)
│   ├── animaties/           ← Animatie helpers (emotions, idle, talking)
│   └── assets/              ← Sky, terrain, test assets (index-bestanden wrappen met paint effects)
│
├── CLAUDE.md                ← Dit bestand
└── [config bestanden]       ← package.json, tsconfig.json, etc.
```

### Bestaande code = REFERENTIEMATERIAAL

De bestanden in `src/` zijn **voorbeelden en referentie**. Ze tonen:
- SVG-kwaliteit en stijl (oil painting look)
- Animatie-patronen (emotions, lip sync, idle)
- Architectuur-patronen (SceneRenderer, CameraPath, etc.)

**Gebruik deze code als inspiratie, NIET als iets dat "gefixed" of "verbeterd" moet worden.**

---

## STAP 3: Wat je NIET moet doen

- **NIET** de bestaande code gaan "fixen" (tsconfig, dependencies, bugs)
- **NIET** de bestaande compositions gaan verbeteren
- **NIET** een eigen roadmap verzinnen — het stappenplan staat in docs/PROJECT-STATE.md
- **NIET** aannemen dat het project "80% klaar" is — de implementatie is nog niet gestart
- **NIET** bestanden lezen/analyseren tenzij het relevant is voor de huidige stap
- **NOOIT** servers starten (geen `npx remotion studio`, geen dev servers). Dit werkt niet in deze omgeving.

---

## STAP 4: Hoe je werkt

### Elke stap moet uitgelegd worden

Voordat je een stap uit het stappenplan uitvoert, leg je ALTIJD uit:
1. **WAAROM** we deze stap doen — wat is het nut, welk probleem lost het op?
2. **WAT** je gaat bouwen — concreet, geen vage beschrijvingen
3. **HOE** het past in het grotere geheel — welke stappen komen erna en hoe hangt het samen?

De gebruiker wil kritisch meedenken. Geef hem de informatie om dat te kunnen doen.

### Branch & merge workflow

Bij het opleveren van werk, geef ALTIJD deze instructies:

1. **Op welke branch het werk staat** — noem de exacte branch naam
2. **Hoe te mergen naar main** — exacte commando's die de gebruiker in zijn Codespace terminal moet draaien.
   Voeg ALTIJD een merge-bericht toe van max 4 woorden in het Nederlands:
   ```bash
   git fetch origin [branch-naam]
   git stash
   git merge origin/[branch-naam] -m "[max 4 woorden NL]"
   git stash pop
   git push origin main
   ```
3. **Hoe te testen** — exacte commando's:
   ```bash
   # Type check
   npx tsc --noEmit
   # Preview in browser
   npx remotion studio
   # Render naar bestand
   npx remotion render src/index.ts [CompositionId] out/output.mp4
   ```

---

## Kernbeslissingen (samenvatting)

1. **Asset Library** — LLM composeert scenes uit pre-gebouwde SVG-componenten (genereert NIET from scratch)
2. **10-laags compositie** — sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting
3. **Position presets** — Voorgedefinieerde x/y/scale posities zodat LLM geen coördinaten raadt
4. **Bestaande code = referentie** — Niet productie, niet fixen
5. **English only** — Alle video content in het Engels
6. **n8n-only feedback** — Geen dashboard, alleen approve/feedback/reject buttons
7. **Per-asset post-processing** — Painterly effecten zitten op asset-niveau (via `withAssetPaint` HOC in index-bestanden), NIET op scene-niveau. Dit voorkomt dubbele filters en maakt per-asset tuning mogelijk.
8. **Geen vignette op showcases** — Showcases tonen assets puur, zonder extra scene-level effecten
9. **Asset creation via ChatGPT + vectorizer.ai** — Assets worden via ChatGPT (flat-color, max 16 kleuren, Kurzgesagt-stijl) gegenereerd als PNG, dan via vectorizer.ai naar SVG getraceerd (doel: 300-500 paden). Claude animeert de SVG in Remotion. Zie docs/PROJECT-STATE.md voor de volledige prompt en workflow.

---

## How to Run

```bash
# Type check
npx tsc --noEmit

# Preview in browser (alleen in Codespace, niet in Claude omgeving)
npx remotion studio

# Render a specific composition
npx remotion render src/index.ts [CompositionId] out/output.mp4
```

---

## User Preferences

- **Communicatie**: Nederlands
- **Video content**: Engels
- **Stijl**: Casual, pub-sfeer, bier-metaforen, straattaal gemixed met academisch
- **Visueel**: Gedetailleerd, levendig, veel geanimeerde figuren — niet minimalistisch
- **Aanpak**: Eerst plan, dan bouwen. Geen tokens verspillen aan werk zonder richting.
- **Kritisch meedenken**: Leg bij elke stap uit WAAROM we het doen, zodat de gebruiker kan challengen.
