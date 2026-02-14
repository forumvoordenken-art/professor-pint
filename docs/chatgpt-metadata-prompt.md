# ChatGPT Metadata Generator Prompt

Gebruik deze prompt in ChatGPT om metadata te genereren voor scene assets.

---

## Prompt voor ChatGPT

```
Ik heb een referentie-PNG van een scene met meerdere elementen.

Analyseer deze afbeelding en genereer TypeScript asset metadata voor elk element.

**Outputformat:**

```ts
{
  '[element-id]': {
    id: '[element-id]',
    category: '[sky|terrain|structure|prop|character|vegetation]',
    anchor: '[top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right]',
    naturalWidth: 0.XX,   // fractie van canvas breedte (0-1)
    naturalHeight: 0.XX,  // fractie van canvas hoogte (0-1)
    groundLine: 0.XX,     // y-positie waar element grond raakt (0-1), alleen voor grond-elementen
    viewBox: { width: XXXX, height: XXXX },  // uit SVG viewBox
    notes: 'Beschrijving van element',
  },
}
```

**Analyseer voor elk element:**

1. **Categorie** — is het sky, terrain, structure, prop, character, of vegetation?
2. **Anchor point** — waar is het element "vastgemaakt"?
   - Elementen die op de grond staan: `bottom-center`
   - Sky: `top-center`
   - Props in de lucht (maan, vogels): `center`
3. **Natural width** — hoe breed is het element als fractie van canvas?
   - Meet visueel: "Dit element neemt ~60% van de scherm breedte in" → 0.6
4. **Natural height** — hoe hoog is het element als fractie van canvas?
   - Meet visueel: "Dit element neemt ~75% van de scherm hoogte in" → 0.75
5. **Ground line** — alleen voor elementen die de grond raken
   - Op welke y-positie (0=top, 1=bottom) raakt het element de grond?
   - Meestal ~0.90-0.95 voor elementen op de grond
6. **ViewBox** — laat leeg, ik vul dit later in uit de SVG

**Belangrijke regels:**

- Sky vult altijd 100% (1.0 × 1.0)
- Terrain anchor is `bottom-center`, groundLine is `1.0` (onderkant canvas)
- Elementen die op de grond staan delen dezelfde groundLine
- Schattingen zijn prima — het gaat om verhoudingen, niet exacte pixels
- Als twee elementen dezelfde grondlijn delen (bijv. pub en lantaarnpaal), gebruik dan dezelfde groundLine waarde

**Elementen in deze scene:**

[Lijst hier de elementen die je ziet, bijv:]
- Sky (achtergrond)
- Terrain (keistraat onderaan)
- Pub building (centraal)
- Street lamp (links)
- Street lamp (rechts)
- Moon (rechtsboven)

Genereer de metadata voor elk element.
```

---

## Voorbeeld Output van ChatGPT

ChatGPT zou ongeveer dit moeten genereren:

```ts
{
  'sky-evening-warm': {
    id: 'sky-evening-warm',
    category: 'sky',
    anchor: 'top-center',
    naturalWidth: 1.0,
    naturalHeight: 1.0,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Warme avondlucht, vult hele achtergrond',
  },

  'terrain-cobblestone-street': {
    id: 'terrain-cobblestone-street',
    category: 'terrain',
    anchor: 'bottom-center',
    naturalWidth: 1.0,
    naturalHeight: 0.45,
    groundLine: 1.0,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Keistraat, onderste 45% van canvas',
  },

  'struct-pub-exterior': {
    id: 'struct-pub-exterior',
    category: 'structure',
    anchor: 'bottom-center',
    naturalWidth: 0.58,
    naturalHeight: 0.72,
    groundLine: 0.92,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Pub gebouw, centraal gepositioneerd',
  },

  'prop-street-lamp': {
    id: 'prop-street-lamp',
    category: 'prop',
    anchor: 'bottom-center',
    naturalWidth: 0.065,
    naturalHeight: 0.68,
    groundLine: 0.92,
    viewBox: { width: 1024, height: 1536 },
    notes: 'Victoriaanse lantaarnpaal',
  },

  'prop-moon-crescent': {
    id: 'prop-moon-crescent',
    category: 'prop',
    anchor: 'center',
    naturalWidth: 0.09,
    naturalHeight: 0.09,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Wassende maan, rechtsboven',
  },
}
```

---

## Workflow

1. Upload referentie-PNG naar ChatGPT
2. Gebruik bovenstaande prompt
3. ChatGPT genereert metadata
4. Kopieer de output en plak in Claude
5. Claude voegt het toe aan `src/motor/AssetMetadata.ts`
6. Klaar!

**Geen handmatig werk, geen gokken, geen meten — ChatGPT doet de visuele analyse.**
