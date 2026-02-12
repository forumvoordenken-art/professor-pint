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
│   ├── motor/               ← Render engine (camera, transitions, etc.)
│   ├── animaties/           ← Animatie helpers (emotions, idle, talking)
│   └── assets/              ← Statische bestanden
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

## Kernbeslissingen (samenvatting)

1. **Asset Library** — LLM composeert scenes uit pre-gebouwde SVG-componenten (genereert NIET from scratch)
2. **10-laags compositie** — sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting
3. **Position presets** — Voorgedefinieerde x/y/scale posities zodat LLM geen coördinaten raadt
4. **Bestaande code = referentie** — Niet productie, niet fixen
5. **English only** — Alle video content in het Engels
6. **n8n-only feedback** — Geen dashboard, alleen approve/feedback/reject buttons

---

## How to Run

```bash
# Type check
npx tsc --noEmit

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
