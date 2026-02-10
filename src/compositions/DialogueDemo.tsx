import React from 'react';
import { SceneRenderer } from '../systems/SceneRenderer';
import type { SceneData } from '../systems/SceneRenderer';

// DialogueDemo: 30 seconds at 30fps = 900 frames
// Showcases: two characters, shot-reverse-shot camera, classroom BG, emotion interplay

const DIALOGUE_SCENES: SceneData[] = [
  {
    id: 'classroom-intro',
    start: 0,
    end: 90,
    bg: 'classroom',
    boardText: "COMPOUND INTEREST",
    camera: { x: 0, y: -30, zoom: 1 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'neutral',
        talking: false,
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'neutral',
        talking: false,
      },
    ],
    subtitle: '',
    transition: { type: 'crossfade', duration: 20 },
  },
  {
    id: 'professor-greeting',
    start: 90,
    end: 210,
    bg: 'classroom',
    boardText: "COMPOUND INTEREST",
    camera: { x: -80, y: 0, zoom: 1.3 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'happy',
        talking: true,
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'neutral',
        talking: false,
      },
    ],
    subtitle: 'Alright Joe, today I\'m going to blow your mind with compound interest.',
    transition: { type: 'crossfade', duration: 12 },
  },
  {
    id: 'joe-confused',
    start: 210,
    end: 330,
    bg: 'classroom',
    boardText: "COMPOUND INTEREST",
    camera: { x: 80, y: 0, zoom: 1.3 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'neutral',
        talking: false,
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'thinking',
        talking: true,
      },
    ],
    subtitle: 'Compound what now? Is that like... double interest?',
    transition: { type: 'wipe', duration: 15 },
  },
  {
    id: 'professor-explains',
    start: 330,
    end: 510,
    bg: 'classroom',
    boardText: "INTEREST ON INTEREST",
    camera: { x: -60, y: -20, zoom: 1.25 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'happy',
        talking: true,
        gesture: 'explain',
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'neutral',
        talking: false,
      },
    ],
    subtitle: 'Even better! It\'s interest earning interest. Your money makes money, which makes more money.',
    transition: { type: 'crossfade', duration: 12 },
    overlays: [
      {
        type: 'statCard',
        startFrame: 360,
        endFrame: 490,
        props: {
          value: '€100',
          label: 'becomes €265 in 20 years at 5%',
          position: 'right',
          color: '#2D5016',
        },
      },
    ],
  },
  {
    id: 'joe-shocked',
    start: 510,
    end: 630,
    bg: 'classroom',
    boardText: "INTEREST ON INTEREST",
    camera: { x: 60, y: 10, zoom: 1.4 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'happy',
        talking: false,
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'shocked',
        talking: true,
      },
    ],
    subtitle: 'Wait, €100 becomes €265?! Why did nobody tell me this sooner?',
    transition: { type: 'zoomIn', duration: 12 },
  },
  {
    id: 'professor-revelation',
    start: 630,
    end: 780,
    bg: 'classroom',
    boardText: "START EARLY!",
    camera: { x: -40, y: -10, zoom: 1.5 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'shocked',
        talking: true,
        gesture: 'point',
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'shocked',
        talking: false,
      },
    ],
    subtitle: 'That\'s the scandal! Nobody teaches this in school. The earlier you start, the richer you get.',
    transition: { type: 'slide', duration: 15 },
    overlays: [
      {
        type: 'barChart',
        startFrame: 660,
        endFrame: 770,
        props: {
          title: 'Starting at age...',
          bars: [
            { label: '20', value: 265, color: '#2D5016' },
            { label: '30', value: 163, color: '#D4A012' },
            { label: '40', value: 100, color: '#FF6B35' },
          ],
          position: 'right',
        },
      },
    ],
  },
  {
    id: 'both-happy',
    start: 780,
    end: 900,
    bg: 'pub',
    boardText: "CHEERS!",
    camera: { x: 0, y: 0, zoom: 1.1 },
    characters: [
      {
        id: 'professorPint',
        x: 650,
        y: 420,
        scale: 1.8,
        emotion: 'happy',
        talking: false,
        gesture: 'cheers',
      },
      {
        id: 'averageJoe',
        x: 1270,
        y: 440,
        scale: 1.8,
        emotion: 'happy',
        talking: true,
      },
    ],
    subtitle: 'Alright, I\'m opening an investment account tonight. Cheers, Professor!',
    transition: { type: 'iris', duration: 20 },
  },
];

export const DialogueDemo: React.FC = () => {
  return <SceneRenderer scenes={DIALOGUE_SCENES} showDebug />;
};

export default DialogueDemo;
