import React from 'react';
import { SceneRenderer } from '../systems/SceneRenderer';
import type { SceneData } from '../systems/SceneRenderer';

// Het Azteekse Rijk – volledige 12-minuten video
// 21 600 frames @ 30 fps = 720 s = 12 min
// Professor Pint vertelt over de opkomst en val van de Azteken

const S: SceneData[] = [
  // ============================================================
  //  ACT 1 — PUB INTRO  (0 – 1 800 · 60 s)
  // ============================================================
  {
    id: 'intro-1',
    start: 0,
    end: 300,
    bg: 'pub',
    boardText: 'PROFESSOR PINT',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'neutral', talking: false },
    ],
    subtitle: '',
    transition: { type: 'crossfade', duration: 25 },
  },
  {
    id: 'intro-2',
    start: 300,
    end: 600,
    bg: 'pub',
    boardText: 'PROFESSOR PINT',
    camera: { x: 80, y: -60, zoom: 2.5 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'Welkom terug bij Professor Pint! Pak een biertje en ga er lekker bij zitten.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'intro-3',
    start: 600,
    end: 900,
    bg: 'pub',
    boardText: 'HET AZTEEKSE RIJK',
    camera: { x: -40, y: -50, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 900, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'Vandaag nemen we je mee naar Midden-Amerika. We gaan het hebben over het machtige Azteekse Rijk.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'intro-4',
    start: 900,
    end: 1200,
    bg: 'pub',
    boardText: '1325 – 1521',
    camera: { x: 60, y: -40, zoom: 2.8 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Een beschaving die in tweehonderd jaar tijd uitgroeide tot het grootste rijk van Meso-Amerika. En toen... pats. Weg.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'intro-5',
    start: 1200,
    end: 1500,
    bg: 'pub',
    boardText: '200.000 INWONERS',
    camera: { x: 0, y: -30, zoom: 3.2 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'shocked', talking: true },
    ],
    subtitle: 'Tenochtitlan, hun hoofdstad, had tweehonderdduizend inwoners. Groter dan Londen of Parijs in die tijd. Midden in een meer!',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'intro-6',
    start: 1500,
    end: 1800,
    bg: 'pub',
    boardText: 'BIER & AZTEKEN',
    camera: { x: -30, y: -70, zoom: 2.3 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'En wist je dat de Azteken hun eigen bier hadden? Pulque, gemaakt van agave. Proost op de geschiedenisles!',
    transition: { type: 'crossfade', duration: 15 },
  },

  // ============================================================
  //  ACT 2 — TENOCHTITLAN: DE STAD  (1 800 – 3 300 · 50 s)
  // ============================================================
  {
    id: 'teno-1',
    start: 1800,
    end: 2100,
    bg: 'tenochtitlan',
    boardText: 'TENOCHTITLAN',
    camera: { x: 0, y: -100, zoom: 1.8 },
    characters: [
      { id: 'professorPint', x: 500, y: 460, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'Kijk om je heen! Dit is Tenochtitlan, de hoofdstad van het Azteekse Rijk. Gebouwd op een eiland in het meer van Texcoco.',
    transition: { type: 'crossfade', duration: 20 },
  },
  {
    id: 'teno-2',
    start: 2100,
    end: 2400,
    bg: 'tenochtitlan',
    boardText: 'MEER VAN TEXCOCO',
    camera: { x: -100, y: -60, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Volgens de legende zagen de Mexica een adelaar op een cactus, die een slang opat. Hier moeten we onze stad bouwen, zeiden ze.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'teno-3',
    start: 2400,
    end: 2700,
    bg: 'tenochtitlan',
    boardText: 'TEMPLO MAYOR',
    camera: { x: 60, y: -80, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 700, y: 450, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'De Templo Mayor, het hart van de stad. Zestig meter hoog. Twee tempels op de top: één voor de regengod Tlaloc, één voor de oorlogsgod Huitzilopochtli.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'teno-4',
    start: 2700,
    end: 3000,
    bg: 'tenochtitlan',
    boardText: 'CAUSEWAYS',
    camera: { x: -80, y: -40, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 1200, y: 460, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Drie lange dijken verbonden de stad met het vasteland. Bruggen die je kon openen als er vijanden kwamen. Slim hè?',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'teno-5',
    start: 3000,
    end: 3300,
    bg: 'tenochtitlan',
    boardText: 'AQUADUCTEN',
    camera: { x: 100, y: -50, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 600, y: 450, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'Ze hadden aquaducten voor drinkwater, openbare toiletten, en straten die elke dag werden schoongeveegd. Schoner dan Europese steden!',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 3 — CHINAMPAS: DRIJVENDE TUINEN  (3 300 – 4 200 · 30 s)
  // ============================================================
  {
    id: 'chin-1',
    start: 3300,
    end: 3600,
    bg: 'chinampas',
    boardText: 'CHINAMPAS',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 500, y: 460, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'En dan de chinampas! Drijvende tuinen op het meer. De Azteken legden vlotten van takken en modder aan en groeiden er groenten op.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'chin-2',
    start: 3600,
    end: 3900,
    bg: 'chinampas',
    boardText: 'LANDBOUW INNOVATIE',
    camera: { x: -80, y: -50, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Maïs, bonen, pompoen, tomaten, cacao. Alles groeide hier. Vier tot zeven oogsten per jaar! Dat is industriële landbouw avant la lettre.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'chin-3',
    start: 3900,
    end: 4200,
    bg: 'chinampas',
    boardText: 'CACAO = GELD',
    camera: { x: 60, y: -40, zoom: 2.8 },
    characters: [
      { id: 'professorPint', x: 800, y: 450, scale: 0.7, emotion: 'shocked', talking: true },
    ],
    subtitle: 'En cacao? Dat was letterlijk geld! Cacaobonen waren de munteenheid. Een kalkoen kostte honderd bonen. Een avocado drie.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 4 — DE MARKT  (4 200 – 5 400 · 40 s)
  // ============================================================
  {
    id: 'market-1',
    start: 4200,
    end: 4500,
    bg: 'aztecMarket',
    boardText: 'TLATELOLCO MARKT',
    camera: { x: 0, y: -90, zoom: 1.9 },
    characters: [
      { id: 'professorPint', x: 550, y: 460, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'De markt van Tlatelolco. Zestigduizend handelaren per dag! Groter dan welke markt in Europa dan ook.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'market-2',
    start: 4500,
    end: 4800,
    bg: 'aztecMarket',
    boardText: 'HANDELSNETWERK',
    camera: { x: -60, y: -50, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 1150, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Jade uit Guatemala, veren van quetzals, obsidiaan messen, goud, textiel. Alles werd hier verhandeld. En er waren rechters die op eerlijke handel toezagen.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'market-3',
    start: 4800,
    end: 5100,
    bg: 'aztecMarket',
    boardText: 'POCHTECA',
    camera: { x: 80, y: -40, zoom: 2.8 },
    characters: [
      { id: 'professorPint', x: 700, y: 450, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'De pochteca, de langeafstandshandelaren, waren ook spionnen voor de keizer. Business en espionage in één pakketje.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'market-4',
    start: 5100,
    end: 5400,
    bg: 'aztecMarket',
    boardText: 'BELASTINGSTELSEL',
    camera: { x: 0, y: -70, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 960, y: 455, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'En alles werd belast. De Azteken hadden een gedetailleerd tributsysteem. Veroverde steden moesten betalen in goederen, arbeid of krijgers.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 5 — RELIGIE & OFFERS  (5 400 – 6 900 · 50 s)
  // ============================================================
  {
    id: 'sac-1',
    start: 5400,
    end: 5700,
    bg: 'pub',
    boardText: 'RELIGIE',
    camera: { x: 50, y: -60, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'neutral', talking: true },
    ],
    subtitle: 'Oké, nu wordt het een beetje heftig. We moeten het hebben over de Azteekse religie. En ja, over de mensenoffers.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'sac-2',
    start: 5700,
    end: 6000,
    bg: 'aztecSacrifice',
    boardText: 'HUITZILOPOCHTLI',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 550, y: 460, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'De Azteken geloofden dat de zon elke dag opnieuw geboren moest worden. Huitzilopochtli, de zonnegod, had mensenbloed nodig als brandstof.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'sac-3',
    start: 6000,
    end: 6300,
    bg: 'aztecSacrifice',
    boardText: 'BLOEMENOORLOGEN',
    camera: { x: -60, y: -50, zoom: 2.5 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'De Bloemenoorlogen waren rituele gevechten om gevangenen te maken voor offers. Niet om te doden op het slagveld, maar om levend mee te nemen.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'sac-4',
    start: 6300,
    end: 6600,
    bg: 'aztecSacrifice',
    boardText: 'TZOMPANTLI',
    camera: { x: 80, y: -40, zoom: 2.8 },
    characters: [
      { id: 'professorPint', x: 700, y: 450, scale: 0.7, emotion: 'shocked', talking: true },
    ],
    subtitle: 'Het tzompantli, het schedelrek. Archeologen hebben er meer dan zeshonderd schedels bij gevonden in Mexico-Stad. Van mannen, vrouwen en kinderen.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'sac-5',
    start: 6600,
    end: 6900,
    bg: 'pub',
    boardText: 'CONTEXT',
    camera: { x: -20, y: -40, zoom: 3.0 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'neutral', talking: true },
    ],
    subtitle: 'Maar laten we eerlijk zijn: de Spanjaarden die hen veroordeelden, voerden zelf de Inquisitie uit. Geschiedenis is nooit zwart-wit.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 6 — DE OORLOG  (6 900 – 8 100 · 40 s)
  // ============================================================
  {
    id: 'war-1',
    start: 6900,
    end: 7200,
    bg: 'pub',
    boardText: 'AZTEEKSE KRIJGERS',
    camera: { x: 0, y: -70, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'De Azteekse krijgers waren beesten! Jaguar-krijgers, adelaar-krijgers. Ze vochten met de macuahuitl, een houten zwaard met obsidiaan messen aan de zijkant.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'war-2',
    start: 7200,
    end: 7500,
    bg: 'battleScene',
    boardText: 'MACUAHUITL',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 550, y: 460, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Obsidiaan is scherper dan een chirurgisch mes. Eén klap met zo\'n macuahuitl en je was je arm kwijt. Serieus eng wapen.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'war-3',
    start: 7500,
    end: 7800,
    bg: 'battleScene',
    boardText: 'AZTEEKS LEGER',
    camera: { x: -80, y: -50, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 1150, y: 450, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'Het Azteekse leger was gigantisch. Honderdduizenden krijgers. Goed getraind, gedisciplineerd. En ze hadden een rangsysteem gebaseerd op het aantal gevangenen.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'war-4',
    start: 7800,
    end: 8100,
    bg: 'battleScene',
    boardText: 'VEROVERING',
    camera: { x: 60, y: -60, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 800, y: 455, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Maar ze maakten ook vijanden. Veel vijanden. Veroverde volken werden uitgeperst met belastingen en tributen. Dat zou later hun ondergang worden.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 7 — CORTÉS & DE VAL  (8 100 – 9 900 · 60 s)
  // ============================================================
  {
    id: 'cortes-1',
    start: 8100,
    end: 8400,
    bg: 'pub',
    boardText: '1519',
    camera: { x: 0, y: -50, zoom: 2.8 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'neutral', talking: true },
    ],
    subtitle: 'Dan komt het jaar 1519. Hernán Cortés landt met vijfhonderd man aan de kust van Mexico. Het begin van het einde.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'cortes-2',
    start: 8400,
    end: 8700,
    bg: 'cortesLanding',
    boardText: 'HERNÁN CORTÉS',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 550, y: 460, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Cortés was geen genie. Hij had geluk, lef, en een geheim wapen: de vijanden van de Azteken. Duizenden Tlaxcalteken sloten zich bij hem aan.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'cortes-3',
    start: 8700,
    end: 9000,
    bg: 'cortesLanding',
    boardText: 'PAARDEN & KANONNEN',
    camera: { x: -60, y: -50, zoom: 2.5 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'shocked', talking: true },
    ],
    subtitle: 'De Azteken hadden nog nooit paarden gezien. Of kanonnen gehoord. De psychologische impact was enorm.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'cortes-4',
    start: 9000,
    end: 9300,
    bg: 'tenochtitlan',
    boardText: 'MOCTEZUMA II',
    camera: { x: 80, y: -60, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 700, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Keizer Moctezuma twijfelde. Was Cortés de teruggekeerde god Quetzalcoatl? Hij nodigde de Spanjaarden uit in zijn paleis. Fatale fout.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'cortes-5',
    start: 9300,
    end: 9600,
    bg: 'battleScene',
    boardText: 'LA NOCHE TRISTE',
    camera: { x: -30, y: -70, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 1000, y: 455, scale: 0.7, emotion: 'neutral', talking: true },
    ],
    subtitle: 'La Noche Triste, de droevige nacht. De Azteken joegen de Spanjaarden de stad uit. Honderden Spanjaarden verdronken door het gewicht van gestolen goud.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'cortes-6',
    start: 9600,
    end: 9900,
    bg: 'battleScene',
    boardText: 'BELEG 1521',
    camera: { x: 60, y: -50, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 650, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Maar Cortés kwam terug. Met meer mannen, meer bondgenoten, en bootjes voor op het meer. Tachtig dagen belegerde hij Tenochtitlan.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 8 — DE PEST  (9 900 – 11 100 · 40 s)
  // ============================================================
  {
    id: 'plague-1',
    start: 9900,
    end: 10200,
    bg: 'pub',
    boardText: 'HET ÉCHTE WAPEN',
    camera: { x: 0, y: -50, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'neutral', talking: true },
    ],
    subtitle: 'Maar het échte wapen van de Spanjaarden was onzichtbaar. Ziektes. Pokken, mazelen, tyfus. De Azteken hadden er geen weerstand tegen.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'plague-2',
    start: 10200,
    end: 10500,
    bg: 'aztecPlague',
    boardText: 'POKKEN',
    camera: { x: 0, y: -80, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 550, y: 460, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'De pokken kwamen in 1520. Binnen een paar maanden was veertig procent van Tenochtitlan dood. Inclusief de nieuwe keizer Cuitláhuac.',
    transition: { type: 'crossfade', duration: 18 },
  },
  {
    id: 'plague-3',
    start: 10500,
    end: 10800,
    bg: 'aztecPlague',
    boardText: 'BEVOLKINGSCRASH',
    camera: { x: -60, y: -50, zoom: 2.5 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'shocked', talking: true },
    ],
    subtitle: 'In honderd jaar na de verovering daalde de bevolking van vijfentwintig miljoen naar één miljoen. Een van de grootste demografische rampen uit de geschiedenis.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'plague-4',
    start: 10800,
    end: 11100,
    bg: 'aztecPlague',
    boardText: 'COCOLIZTLI',
    camera: { x: 60, y: -40, zoom: 2.2 },
    characters: [
      { id: 'professorPint', x: 800, y: 455, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'En dan was er cocoliztli, een mysterieuze epidemie in 1545. Waarschijnlijk een hemorragische koorts. Vijftien miljoen doden in drie jaar.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 9 — ERFENIS & LESSEN  (11 100 – 12 000 · 30 s)
  // ============================================================
  {
    id: 'legacy-1',
    start: 11100,
    end: 11400,
    bg: 'tenochtitlan',
    boardText: 'MEXICO-STAD',
    camera: { x: 0, y: -70, zoom: 2.0 },
    characters: [
      { id: 'professorPint', x: 600, y: 455, scale: 0.7, emotion: 'neutral', talking: true },
    ],
    subtitle: 'Tenochtitlan werd platgebrand en herbouwd als Mexico-Stad. De Templo Mayor werd pas in 1978 herontdekt, onder het centrale plein.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'legacy-2',
    start: 11400,
    end: 11700,
    bg: 'chinampas',
    boardText: 'ERFENIS',
    camera: { x: -80, y: -50, zoom: 2.3 },
    characters: [
      { id: 'professorPint', x: 1100, y: 450, scale: 0.7, emotion: 'happy', talking: true },
    ],
    subtitle: 'Maar de erfenis leeft voort. Chocolade, tomaat, avocado, cacao. Allemaal Nahuatl-woorden. En in Xochimilco kun je nog steeds op chinampas varen.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'legacy-3',
    start: 11700,
    end: 12000,
    bg: 'aztecMarket',
    boardText: 'NAHUATL',
    camera: { x: 60, y: -40, zoom: 2.6 },
    characters: [
      { id: 'professorPint', x: 750, y: 450, scale: 0.7, emotion: 'thinking', talking: true },
    ],
    subtitle: 'Anderhalf miljoen mensen spreken nog Nahuatl. De Azteekse kalender, de kunst, de mythologie: het leeft allemaal nog.',
    transition: { type: 'crossfade', duration: 12 },
  },

  // ============================================================
  //  ACT 10 — PUB OUTRO  (12 000 – 12 600 · 20 s)
  // ============================================================
  {
    id: 'outro-1',
    start: 12000,
    end: 12300,
    bg: 'pub',
    boardText: 'SAMENVATTING',
    camera: { x: 0, y: -60, zoom: 2.4 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'Dus wat leren we? De Azteken waren geen barbaren. Het was een geavanceerde beschaving die pech had met timing en ziektes.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'outro-2',
    start: 12300,
    end: 12600,
    bg: 'pub',
    boardText: 'PROOST!',
    camera: { x: 40, y: -30, zoom: 3.0 },
    characters: [
      { id: 'professorPint', x: 960, y: 440, scale: 1.0, emotion: 'happy', talking: true },
    ],
    subtitle: 'En op die noot, neem nog een slokje pulque. Of gewoon een biertje. Like, subscribe, en tot de volgende keer!',
    transition: { type: 'iris', duration: 25 },
  },
];

// 12 600 frames @ 30 fps = 420 s = 7 min
export const AztekenVideo: React.FC = () => {
  return <SceneRenderer scenes={S} showDebug />;
};

export default AztekenVideo;
