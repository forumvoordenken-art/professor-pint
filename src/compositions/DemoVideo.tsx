import React from 'react';
import { SceneRenderer } from '../systems/SceneRenderer';
import type { SceneData } from '../systems/SceneRenderer';

// Demo: 20 seconds at 30fps = 600 frames
// Showcases: SceneRenderer, camera moves, transitions, emotion changes, talking

const DEMO_SCENES: SceneData[] = [
  {
    id: 'intro',
    start: 0,
    end: 120,
    bg: 'pub',
    boardText: "TODAY'S TOPIC",
    camera: { x: 0, y: -50, zoom: 1.1 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'neutral',
        talking: false,
      },
    ],
    subtitle: '',
    transition: { type: 'crossfade', duration: 20 },
  },
  {
    id: 'welcome',
    start: 120,
    end: 240,
    bg: 'pub',
    boardText: "TODAY'S TOPIC",
    camera: { x: 50, y: 0, zoom: 1.3 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'happy',
        talking: true,
      },
    ],
    subtitle: 'Welcome to the pub! Pull up a stool.',
    transition: { type: 'crossfade', duration: 15 },
  },
  {
    id: 'question',
    start: 240,
    end: 360,
    bg: 'pub',
    boardText: "WHY YOU'RE BROKE",
    camera: { x: -30, y: 20, zoom: 1.15 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'thinking',
        talking: true,
      },
    ],
    subtitle: 'Ever wondered why your brain lies to you about money?',
    transition: { type: 'wipe', duration: 18 },
  },
  {
    id: 'revelation',
    start: 360,
    end: 480,
    bg: 'pub',
    boardText: 'INFLATION = -3%/yr',
    camera: { x: 0, y: -20, zoom: 1.5 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'shocked',
        talking: true,
      },
    ],
    subtitle: 'Your savings account is losing value every single day!',
    transition: { type: 'zoomIn', duration: 15 },
  },
  {
    id: 'anger',
    start: 480,
    end: 540,
    bg: 'pub',
    boardText: 'THE TRUTH',
    camera: { x: 60, y: 10, zoom: 1.6 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'angry',
        talking: true,
      },
    ],
    subtitle: "And nobody told you. That's the real scandal.",
    transition: { type: 'slide', duration: 15 },
  },
  {
    id: 'outro',
    start: 540,
    end: 600,
    bg: 'pub',
    boardText: 'PROFESSOR PINT',
    camera: { x: 0, y: 0, zoom: 1 },
    characters: [
      {
        id: 'professorPint',
        x: 960,
        y: 420,
        scale: 2,
        emotion: 'happy',
        talking: false,
      },
    ],
    subtitle: "But don't worry. That's what I'm here for.",
    transition: { type: 'iris', duration: 20 },
  },
];

export const DemoVideo: React.FC = () => {
  return <SceneRenderer scenes={DEMO_SCENES} showDebug />;
};

export default DemoVideo;
