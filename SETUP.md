# Professor Pint - Setup Instructies

## Wat je hebt gekregen
15 bestanden die de volledige projectstructuur vormen. Hieronder staat precies waar elk bestand moet komen.

## Stap 1: Verwijder de oude template bestanden

In je Codespace terminal (de tweede terminal, niet waar Remotion draait):

```bash
rm src/Composition.tsx
```

## Stap 2: Maak de mappen aan

```bash
mkdir -p src/characters src/backgrounds src/animations src/systems src/props src/compositions src/schema
```

## Stap 3: Maak de bestanden aan

De makkelijkste manier: klik rechts op een map in de VS Code file explorer > "New File" en plak de inhoud.

De bestanden en hun paden:

```
src/index.ts                     (OVERSCHRIJVEN - vervang bestaande)
src/Root.tsx                     (OVERSCHRIJVEN - vervang bestaande)
src/animations/easing.ts
src/animations/idle.ts
src/animations/talking.ts
src/animations/emotions.ts
src/animations/index.ts
src/characters/ProfessorPint.tsx
src/characters/index.ts
src/backgrounds/Pub.tsx
src/backgrounds/index.ts
src/props/PintGlass.tsx
src/props/index.ts
src/systems/Subtitles.tsx
src/systems/index.ts
src/compositions/DemoVideo.tsx
src/schema/scene-schema.json
```

## Stap 4: Herstart Remotion Studio

Ga naar de terminal waar Remotion draait, druk Ctrl+C, en dan:

```bash
npx remotion studio
```

## Stap 5: Bekijk het resultaat

In Remotion Studio zie je drie composities:
1. **DemoVideo** - 20 seconden demo met alle features (1920x1080)
2. **ProfessorPint-Preview** - Karakter preview met happy emotie en praten
3. **Pub-Preview** - Achtergrond preview

Selecteer "DemoVideo" en druk op play. Je zou moeten zien:
- Professor Pint staand in de pub
- Idle animaties (ademhaling, knipperen, sway, biersway)
- 6 scenes met verschillende emoties die smooth in elkaar overlopen
- Praat-animatie (mond beweegt, lichaam bounced, hand gesticuleert)
- Subtitles die in- en uitfaden
- Krijtbord tekst die per scene verandert
- Debug info rechtsboven (scene nummer, frame, emotie)

## Structuur overzicht

```
src/
├── animations/          # Herbruikbare animatie-functies
│   ├── easing.ts       # Cubic ease, lerp, sine wave, seeded random
│   ├── idle.ts         # Breathing, blink, sway, pupil, beer sway
│   ├── talking.ts      # Mouth shapes, body bounce, hand gesture
│   ├── emotions.ts     # 6 emoties met smooth interpolatie
│   └── index.ts        # Re-exports
├── characters/
│   ├── ProfessorPint.tsx  # Hoofdkarakter met alle animaties
│   └── index.ts
├── backgrounds/
│   ├── Pub.tsx         # Pub met bar, flessen, krijtbord, lampen
│   └── index.ts
├── props/
│   ├── PintGlass.tsx   # Bierglas met vloeistof-animatie
│   └── index.ts
├── systems/
│   ├── Subtitles.tsx   # Subtitle systeem met fade in/out
│   └── index.ts
├── compositions/
│   └── DemoVideo.tsx   # 20-sec demo met 6 scenes
├── schema/
│   └── scene-schema.json  # JSON schema voor AI scene-generatie
├── Root.tsx            # Composition registry
└── index.ts            # Entry point
```
