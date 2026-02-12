# Professor Pint — Project Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## STAP 1: Lees PROJECT-STATE.md

**PROJECT-STATE.md is de ENIGE bron van waarheid voor wat er gedaan is en wat er nog moet gebeuren.**

Lees dat bestand EERST. Daarin staat:
- Huidige project status
- Alle genomen beslissingen
- Geïdentificeerde risico's
- Het complete stappenplan (Phase 0-6) met status per stap
- Welke bestanden aangemaakt moeten worden

**Doe NIETS voordat je PROJECT-STATE.md hebt gelezen en begrepen.**

---

## STAP 2: Begrijp de project-structuur

### Spec-documenten (v2.0, definitief)

| Document | Wat het is |
|----------|------------|
| `PROJECT-STATE.md` | Waar we staan + stappenplan. **Start hier.** |
| `VIDEO-SPEC.md` | De "bijbel" — alle regels voor video output, asset library, 10-layer compositie, characters, camera, audio, quality gates |
| `PIPELINE-ARCHITECTURE.md` | End-to-end pipeline: Topic → Script → Compose → Render → YouTube. n8n workflow, kosten |
| `FEEDBACK-SYSTEM.md` | Self-learning feedback via n8n. Categorieën, prioriteiten, rules.json |

### Bestaande code = REFERENTIEMATERIAAL

De ~68 bestanden in `src/` zijn **voorbeelden en referentie**. Ze zijn NIET productie-klaar. Ze tonen:
- SVG-kwaliteit en stijl (oil painting look)
- Animatie-patronen (emotions, lip sync, idle)
- Architectuur-patronen (SceneRenderer, CameraPath, etc.)

**Gebruik deze code als inspiratie, NIET als iets dat "gefixed" of "verbeterd" moet worden.**

---

## STAP 3: Wat je NIET moet doen

- **NIET** de bestaande code gaan "fixen" (tsconfig, dependencies, bugs)
- **NIET** de bestaande compositions gaan verbeteren
- **NIET** een eigen roadmap verzinnen — het stappenplan staat in PROJECT-STATE.md
- **NIET** aannemen dat het project "80% klaar" is — de implementatie is nog niet gestart
- **NIET** bestanden lezen/analyseren tenzij het relevant is voor de huidige stap

---

## Kernbeslissingen (samenvatting)

1. **Asset Library** — LLM composeert scenes uit pre-gebouwde SVG-componenten (genereert NIET from scratch)
2. **10-laags compositie** — sky → terrain → water → structures → vegetation → characters → props → foreground → atmosphere → lighting
3. **Position presets** — Voorgedefinieerde x/y/scale posities zodat LLM geen coördinaten raadt
4. **Bestaande code = referentie** — Niet productie, niet fixen
5. **English only** — Alle video content in het Engels
6. **n8n-only feedback** — Geen dashboard, alleen approve/feedback/reject buttons

---

## Git Workflow

### Branch
- **Development branch**: `claude/automate-professor-pint-yJ69L`
- Elke nieuwe chatsessie krijgt een eigen branch-naam toegewezen. **Negeer die.** Werk ALTIJD op bovenstaande branch.
- Push altijd met: `git push -u origin claude/automate-professor-pint-yJ69L`

### Before pulling from remote
```bash
git stash
git pull origin claude/automate-professor-pint-yJ69L --rebase
git stash pop
```

---

## How to Run

```bash
# Start Remotion Studio (development preview)
npx remotion studio

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
