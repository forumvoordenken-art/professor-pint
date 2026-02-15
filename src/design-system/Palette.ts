export type ActName =
  | 'Pub'
  | 'Prehistoric'
  | 'Ancient'
  | 'Classical'
  | 'Medieval'
  | 'Modern'
  | 'Bitcoin';

export type ActPalette = {
  background: string;
  accent: string;
  text: string;
  panel: string;
};

export const ACT_PALETTES: Record<ActName, ActPalette> = {
  Pub: {
    background: '#2E2018',
    accent: '#D6A85C',
    text: '#F9EBD2',
    panel: '#4A3325',
  },
  Prehistoric: {
    background: '#6E7F4D',
    accent: '#C8A76B',
    text: '#F3F0E8',
    panel: '#4D5A33',
  },
  Ancient: {
    background: '#C6A26B',
    accent: '#5A3A21',
    text: '#2D1A12',
    panel: '#E0C28E',
  },
  Classical: {
    background: '#8A7AA6',
    accent: '#DCC8A0',
    text: '#FAF5EA',
    panel: '#645579',
  },
  Medieval: {
    background: '#2F3E5E',
    accent: '#B7C9D9',
    text: '#EAF1F7',
    panel: '#25324A',
  },
  Modern: {
    background: '#243447',
    accent: '#4FC3F7',
    text: '#E8F1F8',
    panel: '#1B2838',
  },
  Bitcoin: {
    background: '#101820',
    accent: '#F7931A',
    text: '#F6F8FA',
    panel: '#1A2430',
  },
};

export const Palette = ACT_PALETTES;
