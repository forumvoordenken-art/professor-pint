# Professor Pint — Claude Instructions

> **STOP. Lees dit bestand volledig voordat je iets doet.**

---

## Wat we bouwen

**Professor Pint** — Educational YouTube videos (10-20 min) over filosofie, geschiedenis, wetenschap. Stijl: casual pub-sfeer, Nederlandse communicatie, Engelse content.

**Huidige status:** Eerste test scene werkend (Pub Exterior Night met man+dog).

**Volgende:** Meer scenes maken → complete video samenstellen → audio toevoegen → YouTube upload.

---

## Huidige Workflow (bewezen methode)

### Scene-split aanpak (NIEUW — vervangt element-voor-element workflow)

1. **Genereer complete scene-PNG** in ChatGPT (alle elementen samen)
2. **Vectorize hele scene** via vectorizer.ai → één grote SVG
3. **Upload naar main**: `public/assets/scenes/[scene-naam]-full.svg`
4. **Split in lagen** met het split script:
   ```bash
   node scripts/split-scene-svg.js public/assets/scenes/[scene]-full.svg \
     --config scenes/[scene]-regions.json \
     --output-dir public/assets/scenes/[scene]
   ```
   Output: meerdere SVGs met **dezelfde viewBox** → stapelen met `inset: 0`, geen handmatige positionering.
5. **Claude animeert**: React component met animatie overlays per laag

**Waarom scene-split?** Losse elementen genereren + vectorizen + cleanen + handmatig positioneren was "veels te omslachtig". Scene-split geeft hetzelfde resultaat (afzonderlijke animeerbare lagen) met 90% minder werk.

### Fallback: Element-voor-element (alleen als scene-split niet werkt)

1. Genereer elk element apart op witte achtergrond
2. Vectorize per element via vectorizer.ai
3. Upload naar `public/assets/[categorie]/[naam].svg`
4. Cleanup + Crop:
   ```bash
   node scripts/clean-svg-backgrounds.js   # verwijdert witte achtergrond-paths
   node scripts/crop-svg-viewbox.js        # cropped viewBox naar echte content
   ```
5. Handmatig positioneren in scene component (aspect ratios uit gecropte viewBox)

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

**BELANGRIJK — LEES DIT GOED:**

### Rollen
- **Gebruiker werkt ALTIJD op `main`** via GitHub Codespace. Upload assets via GitHub web UI → die staan dan op `origin/main`.
- **Claude werkt op feature branch** (kan NIET naar main pushen).

### Hoe Claude nieuwe assets van main ophaalt
Als gebruiker zegt dat er nieuwe bestanden op main staan:
```bash
git fetch origin main
git checkout origin/main -- pad/naar/bestand.svg
```
**NIET** vragen "waar staan ze?" — ze staan op main. Altijd.

### SVG assets: NOOIT committen op feature branch
SVG bestanden die de gebruiker uploadt naar main worden **NIET** gecommit op de feature branch. Dit voorkomt merge conflicts.
- Claude fetcht SVGs van main om ze te gebruiken (viewBox checken, cleanup testen)
- Claude commit alleen **code** (.tsx, .ts, .md) op de feature branch
- Gebruiker runt na de merge: `node scripts/clean-svg-backgrounds.js && node scripts/crop-svg-viewbox.js`

### Opleverprotocol (VERPLICHT bij elke push)
Na elke `git push` MOET Claude kant-en-klare commando's geven.

**NOOIT `git merge` gebruiken** — dit veroorzaakt merge conflicts omdat main en feature branch dezelfde bestanden wijzigen. Gebruik ALTIJD `git checkout` om specifieke bestanden van de branch te pakken:

```bash
git pull origin main
git fetch origin [branch-naam]
git checkout origin/[branch-naam] -- [lijst van gewijzigde bestanden]
git add -A && git commit -m "[korte beschrijving]"
git push origin main
```

Claude MOET de exacte bestandspaden meegeven (niet `-- .`). Voorbeeld:
```bash
git checkout origin/claude/my-branch-123 -- src/videos/PubExteriorScene.tsx scripts/split-scene-svg.js
```

Geen uitleg, geen opties, gewoon de regels met ingevulde branch-naam, bestanden en beschrijving.
**ALTIJD** `git pull origin main` als eerste stap — voorkomt rejected pushes.

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

### Scene-split methode (huidig)

Alle lagen delen dezelfde viewBox → geen handmatige positionering:
```ts
const LAYER_STYLE: React.CSSProperties = {
  position: 'absolute', inset: 0, width: '100%', height: '100%',
};

// Elke laag is gewoon:
<Img src={staticFile(layer.src)} style={{ ...LAYER_STYLE, zIndex: layer.zIndex }} />
```

Animatie-overlays (stars, glow, fog, dust) zijn procedureel en gebruiken ANCHORS object met relatieve posities.

### Region config (`scenes/[scene]-regions.json`)

Definieert ruimtelijke regio's als fracties (0-1) van de viewBox:
```json
{ "id": "pub", "x": [0.20, 0.80], "y": [0.10, 0.75], "priority": 1 }
```
- Lagere `priority` = wordt eerst gecheckt bij overlap
- Breed elements (>60% viewBox breedte) gaan automatisch naar "base" laag

### Oud: Hardcoded posities (element-voor-element methode)

Alleen relevant als je NIET de scene-split methode gebruikt:
```ts
const PUB_H = H * 0.70;
const PUB_W = PUB_H * 0.95; // aspect ratio uit GECROPTE viewBox
```

---

## vectorizer.ai SVG Structuur — Bekende Valkuilen

SVGs van vectorizer.ai hebben een specifieke structuur. Het split script (`split-scene-svg.js`) moet hier rekening mee houden:

1. **Meerdere stroke groups**: Een SVG kan MEERDERE `<g stroke-width="..." fill="none">` groups bevatten (niet slechts 1). Gebruik NOOIT `.match()` (vindt alleen eerste) — altijd loopen met depth tracking.

2. **Fill-inheritance via groups**: Paths in `<g fill="#abc">` erven de kleur van de parent. Als je zo'n path individueel extraheert (buiten de group), heeft het geen fill → **rendert zwart**. Oplossing: groepen als geheel extraheren, EERST uit de content verwijderen, daarna overgebleven paths extraheren.

3. **Geneste `<g>` groups**: Lazy regex `[\s\S]*?</g>` stopt bij de eerste `</g>` in plaats van de matchende. Gebruik depth-tracking (teller bij `<g` omhoog, bij `</g>` omlaag) om de juiste sluittag te vinden.

4. **Alleen `<g fill="...">` extraheren**: NIET alle `<g>` groups — `<g transform>`, `<g opacity>` etc. bevatten geen fill-context en moeten intact blijven met hun kinderen.

5. **`preserveAspectRatio="none"`**: Altijd toevoegen aan output SVGs als de SVG aspect ratio (bijv. 3:2) verschilt van het canvas (16:9). Zonder dit wordt het element niet uitgerekt naar de volle breedte.

6. **Brede elementen = achtergrond**: Elements breder dan 60% van de viewBox zijn scene-achtergronden (lucht, grond, overlays) → apart "base" layer, niet toewijzen aan regio's.

---

## User Preferences

- **Communicatie**: Nederlands
- **Video content**: Engels
- **Stijl**: Casual, pub-sfeer, bier-metaforen, mix van straattaal en academisch
- **Visueel**: Gedetailleerd, levendig, veel figuren — niet minimalistisch
- **Aanpak**: Eerst plan, dan bouwen. Leg WAAROM uit zodat gebruiker kan challengen.

---

## Quick Reference

**Huidige scene:** `src/videos/PubExteriorScene.tsx` (v9, scene-split methode)
- Pub exterior night, scene-split uit `pub-exterior-full.svg`
- 8 SVG lagen: base, sky, pub, sidewalk, street, characters, lamp-left, lamp-right
- Region config: `scenes/pub-exterior-regions.json`
- Animatie overlays: stars twinkle, moon glow, lamp glow, window light, dust motes, fog
- Alle lagen gestapeld met `position: absolute; inset: 0` (shared viewBox)

**Scripts:**
- `scripts/split-scene-svg.js` — splitst scene SVG in lagen op basis van regio's
- `scripts/clean-svg-backgrounds.js` — verwijdert witte achtergrond-paths
- `scripts/crop-svg-viewbox.js` — cropped viewBox naar echte content

**Status:** Zwarte elementen bug wordt nog gefixt (stroke group extractie herschreven, nog niet visueel geverifieerd door gebruiker)

**Volgende stappen:** Zie `docs/PROJECT-STATE.md`
