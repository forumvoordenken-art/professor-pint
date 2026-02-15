import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ProfessorPint } from '../components/ProfessorPint';
import { SceneShell } from '../components/SceneShell';
import { Palette } from '../design-system/Palette';

type BottleShape = 'tall' | 'round' | 'square' | 'flask' | 'longneck';

type BottleData = {
  id: number;
  x: number;
  shelf: number;
  width: number;
  height: number;
  shape: BottleShape;
  glassColor: string;
  liquidColor: string;
  liquidLevel: number;
  opacity: number;
  labelColor: string;
};

const seededRandom = (seed: number): (() => number) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const generateBottles = (): BottleData[] => {
  const rand = seededRandom(421337);
  const glassPalette = ['#4f7a63', '#3f5668', '#6f4d5f', '#6f7b3f', '#59708a', '#7f5b39'];
  const liquidPalette = ['#c86a1d', '#a33232', '#d9bc63', '#87b57e', '#7a4bc2', '#3d89a8'];
  const labels = ['#e7d4a8', '#d9d9d9', '#f2c7c7', '#c7e1f2', '#f2efc7'];
  const shapes: BottleShape[] = ['tall', 'round', 'square', 'flask', 'longneck'];
  return new Array(50).fill(null).map((_, index) => ({
    id: index,
    x: 180 + (index % 25) * 60 + Math.floor(rand() * 12),
    shelf: index < 25 ? 0 : 1,
    width: 22 + Math.floor(rand() * 24),
    height: 70 + Math.floor(rand() * 90),
    shape: shapes[Math.floor(rand() * shapes.length)],
    glassColor: glassPalette[Math.floor(rand() * glassPalette.length)],
    liquidColor: liquidPalette[Math.floor(rand() * liquidPalette.length)],
    liquidLevel: 0.35 + rand() * 0.55,
    opacity: 0.45 + rand() * 0.45,
    labelColor: labels[Math.floor(rand() * labels.length)],
  }));
};

const BAR_SCRATCHES: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; opacity: number }> = [
  {
    x1: 120,
    y1: 760,
    x2: 126,
    y2: 758,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 127,
    y1: 772,
    x2: 147,
    y2: 771,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 134,
    y1: 784,
    x2: 168,
    y2: 784,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 141,
    y1: 796,
    x2: 189,
    y2: 797,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 148,
    y1: 808,
    x2: 210,
    y2: 810,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 155,
    y1: 820,
    x2: 161,
    y2: 818,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 162,
    y1: 832,
    x2: 182,
    y2: 831,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 169,
    y1: 844,
    x2: 203,
    y2: 844,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 176,
    y1: 856,
    x2: 224,
    y2: 857,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 183,
    y1: 761,
    x2: 245,
    y2: 763,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 190,
    y1: 773,
    x2: 196,
    y2: 771,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 197,
    y1: 785,
    x2: 217,
    y2: 784,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 204,
    y1: 797,
    x2: 238,
    y2: 797,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 211,
    y1: 809,
    x2: 259,
    y2: 810,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 218,
    y1: 821,
    x2: 280,
    y2: 823,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 225,
    y1: 833,
    x2: 231,
    y2: 831,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 232,
    y1: 845,
    x2: 252,
    y2: 844,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 239,
    y1: 857,
    x2: 273,
    y2: 857,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 246,
    y1: 762,
    x2: 294,
    y2: 763,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 253,
    y1: 774,
    x2: 315,
    y2: 776,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 260,
    y1: 786,
    x2: 266,
    y2: 784,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 267,
    y1: 798,
    x2: 287,
    y2: 797,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 274,
    y1: 810,
    x2: 308,
    y2: 810,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 281,
    y1: 822,
    x2: 329,
    y2: 823,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 288,
    y1: 834,
    x2: 350,
    y2: 836,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 295,
    y1: 846,
    x2: 301,
    y2: 844,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 302,
    y1: 858,
    x2: 322,
    y2: 857,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 309,
    y1: 763,
    x2: 343,
    y2: 763,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 316,
    y1: 775,
    x2: 364,
    y2: 776,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 323,
    y1: 787,
    x2: 385,
    y2: 789,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 330,
    y1: 799,
    x2: 336,
    y2: 797,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 337,
    y1: 811,
    x2: 357,
    y2: 810,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 344,
    y1: 823,
    x2: 378,
    y2: 823,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 351,
    y1: 835,
    x2: 399,
    y2: 836,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 358,
    y1: 847,
    x2: 420,
    y2: 849,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 365,
    y1: 859,
    x2: 371,
    y2: 857,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 372,
    y1: 764,
    x2: 392,
    y2: 763,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 379,
    y1: 776,
    x2: 413,
    y2: 776,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 386,
    y1: 788,
    x2: 434,
    y2: 789,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 393,
    y1: 800,
    x2: 455,
    y2: 802,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 400,
    y1: 812,
    x2: 406,
    y2: 810,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 407,
    y1: 824,
    x2: 427,
    y2: 823,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 414,
    y1: 836,
    x2: 448,
    y2: 836,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 421,
    y1: 848,
    x2: 469,
    y2: 849,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 428,
    y1: 860,
    x2: 490,
    y2: 862,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 435,
    y1: 765,
    x2: 441,
    y2: 763,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 442,
    y1: 777,
    x2: 462,
    y2: 776,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 449,
    y1: 789,
    x2: 483,
    y2: 789,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 456,
    y1: 801,
    x2: 504,
    y2: 802,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 463,
    y1: 813,
    x2: 525,
    y2: 815,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 470,
    y1: 825,
    x2: 476,
    y2: 823,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 477,
    y1: 837,
    x2: 497,
    y2: 836,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 484,
    y1: 849,
    x2: 518,
    y2: 849,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 491,
    y1: 861,
    x2: 539,
    y2: 862,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 498,
    y1: 760,
    x2: 560,
    y2: 762,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 505,
    y1: 772,
    x2: 511,
    y2: 770,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 512,
    y1: 784,
    x2: 532,
    y2: 783,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 519,
    y1: 796,
    x2: 553,
    y2: 796,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 526,
    y1: 808,
    x2: 574,
    y2: 809,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 533,
    y1: 820,
    x2: 595,
    y2: 822,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 540,
    y1: 832,
    x2: 546,
    y2: 830,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 547,
    y1: 844,
    x2: 567,
    y2: 843,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 554,
    y1: 856,
    x2: 588,
    y2: 856,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 561,
    y1: 761,
    x2: 609,
    y2: 762,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 568,
    y1: 773,
    x2: 630,
    y2: 775,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 575,
    y1: 785,
    x2: 581,
    y2: 783,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 582,
    y1: 797,
    x2: 602,
    y2: 796,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 589,
    y1: 809,
    x2: 623,
    y2: 809,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 596,
    y1: 821,
    x2: 644,
    y2: 822,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 603,
    y1: 833,
    x2: 665,
    y2: 835,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 610,
    y1: 845,
    x2: 616,
    y2: 843,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 617,
    y1: 857,
    x2: 637,
    y2: 856,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 624,
    y1: 762,
    x2: 658,
    y2: 762,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 631,
    y1: 774,
    x2: 679,
    y2: 775,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 638,
    y1: 786,
    x2: 700,
    y2: 788,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 645,
    y1: 798,
    x2: 651,
    y2: 796,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 652,
    y1: 810,
    x2: 672,
    y2: 809,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 659,
    y1: 822,
    x2: 693,
    y2: 822,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 666,
    y1: 834,
    x2: 714,
    y2: 835,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 673,
    y1: 846,
    x2: 735,
    y2: 848,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 680,
    y1: 858,
    x2: 686,
    y2: 856,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 687,
    y1: 763,
    x2: 707,
    y2: 762,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 694,
    y1: 775,
    x2: 728,
    y2: 775,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 701,
    y1: 787,
    x2: 749,
    y2: 788,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 708,
    y1: 799,
    x2: 770,
    y2: 801,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 715,
    y1: 811,
    x2: 721,
    y2: 809,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 722,
    y1: 823,
    x2: 742,
    y2: 822,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 729,
    y1: 835,
    x2: 763,
    y2: 835,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 736,
    y1: 847,
    x2: 784,
    y2: 848,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 743,
    y1: 859,
    x2: 805,
    y2: 861,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 750,
    y1: 764,
    x2: 756,
    y2: 762,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 757,
    y1: 776,
    x2: 777,
    y2: 775,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 764,
    y1: 788,
    x2: 798,
    y2: 788,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 771,
    y1: 800,
    x2: 819,
    y2: 801,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 778,
    y1: 812,
    x2: 840,
    y2: 814,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 785,
    y1: 824,
    x2: 791,
    y2: 822,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 792,
    y1: 836,
    x2: 812,
    y2: 835,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 799,
    y1: 848,
    x2: 833,
    y2: 848,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 806,
    y1: 860,
    x2: 854,
    y2: 861,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 813,
    y1: 765,
    x2: 875,
    y2: 767,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 820,
    y1: 777,
    x2: 826,
    y2: 775,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 827,
    y1: 789,
    x2: 847,
    y2: 788,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 834,
    y1: 801,
    x2: 868,
    y2: 801,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 841,
    y1: 813,
    x2: 889,
    y2: 814,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 848,
    y1: 825,
    x2: 910,
    y2: 827,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 855,
    y1: 837,
    x2: 861,
    y2: 835,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 862,
    y1: 849,
    x2: 882,
    y2: 848,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 869,
    y1: 861,
    x2: 903,
    y2: 861,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 876,
    y1: 760,
    x2: 924,
    y2: 761,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 883,
    y1: 772,
    x2: 945,
    y2: 774,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 890,
    y1: 784,
    x2: 896,
    y2: 782,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 897,
    y1: 796,
    x2: 917,
    y2: 795,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 904,
    y1: 808,
    x2: 938,
    y2: 808,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 911,
    y1: 820,
    x2: 959,
    y2: 821,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 918,
    y1: 832,
    x2: 980,
    y2: 834,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 925,
    y1: 844,
    x2: 931,
    y2: 842,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 932,
    y1: 856,
    x2: 952,
    y2: 855,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 939,
    y1: 761,
    x2: 973,
    y2: 761,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 946,
    y1: 773,
    x2: 994,
    y2: 774,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 953,
    y1: 785,
    x2: 1015,
    y2: 787,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 960,
    y1: 797,
    x2: 966,
    y2: 795,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 967,
    y1: 809,
    x2: 987,
    y2: 808,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 974,
    y1: 821,
    x2: 1008,
    y2: 821,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 981,
    y1: 833,
    x2: 1029,
    y2: 834,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 988,
    y1: 845,
    x2: 1050,
    y2: 847,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 995,
    y1: 857,
    x2: 1001,
    y2: 855,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1002,
    y1: 762,
    x2: 1022,
    y2: 761,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1009,
    y1: 774,
    x2: 1043,
    y2: 774,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1016,
    y1: 786,
    x2: 1064,
    y2: 787,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1023,
    y1: 798,
    x2: 1085,
    y2: 800,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1030,
    y1: 810,
    x2: 1036,
    y2: 808,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1037,
    y1: 822,
    x2: 1057,
    y2: 821,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1044,
    y1: 834,
    x2: 1078,
    y2: 834,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1051,
    y1: 846,
    x2: 1099,
    y2: 847,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1058,
    y1: 858,
    x2: 1120,
    y2: 860,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1065,
    y1: 763,
    x2: 1071,
    y2: 761,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1072,
    y1: 775,
    x2: 1092,
    y2: 774,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1079,
    y1: 787,
    x2: 1113,
    y2: 787,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1086,
    y1: 799,
    x2: 1134,
    y2: 800,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1093,
    y1: 811,
    x2: 1155,
    y2: 813,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1100,
    y1: 823,
    x2: 1106,
    y2: 821,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1107,
    y1: 835,
    x2: 1127,
    y2: 834,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1114,
    y1: 847,
    x2: 1148,
    y2: 847,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1121,
    y1: 859,
    x2: 1169,
    y2: 860,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1128,
    y1: 764,
    x2: 1190,
    y2: 766,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1135,
    y1: 776,
    x2: 1141,
    y2: 774,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1142,
    y1: 788,
    x2: 1162,
    y2: 787,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1149,
    y1: 800,
    x2: 1183,
    y2: 800,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1156,
    y1: 812,
    x2: 1204,
    y2: 813,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1163,
    y1: 824,
    x2: 1225,
    y2: 826,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1170,
    y1: 836,
    x2: 1176,
    y2: 834,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1177,
    y1: 848,
    x2: 1197,
    y2: 847,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1184,
    y1: 860,
    x2: 1218,
    y2: 860,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1191,
    y1: 765,
    x2: 1239,
    y2: 766,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1198,
    y1: 777,
    x2: 1260,
    y2: 779,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1205,
    y1: 789,
    x2: 1211,
    y2: 787,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1212,
    y1: 801,
    x2: 1232,
    y2: 800,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1219,
    y1: 813,
    x2: 1253,
    y2: 813,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1226,
    y1: 825,
    x2: 1274,
    y2: 826,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1233,
    y1: 837,
    x2: 1295,
    y2: 839,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1240,
    y1: 849,
    x2: 1246,
    y2: 847,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1247,
    y1: 861,
    x2: 1267,
    y2: 860,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1254,
    y1: 760,
    x2: 1288,
    y2: 760,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1261,
    y1: 772,
    x2: 1309,
    y2: 773,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1268,
    y1: 784,
    x2: 1330,
    y2: 786,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1275,
    y1: 796,
    x2: 1281,
    y2: 794,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1282,
    y1: 808,
    x2: 1302,
    y2: 807,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1289,
    y1: 820,
    x2: 1323,
    y2: 820,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1296,
    y1: 832,
    x2: 1344,
    y2: 833,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1303,
    y1: 844,
    x2: 1365,
    y2: 846,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1310,
    y1: 856,
    x2: 1316,
    y2: 854,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1317,
    y1: 761,
    x2: 1337,
    y2: 760,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1324,
    y1: 773,
    x2: 1358,
    y2: 773,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1331,
    y1: 785,
    x2: 1379,
    y2: 786,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1338,
    y1: 797,
    x2: 1400,
    y2: 799,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1345,
    y1: 809,
    x2: 1351,
    y2: 807,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1352,
    y1: 821,
    x2: 1372,
    y2: 820,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1359,
    y1: 833,
    x2: 1393,
    y2: 833,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1366,
    y1: 845,
    x2: 1414,
    y2: 846,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1373,
    y1: 857,
    x2: 1435,
    y2: 859,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1380,
    y1: 762,
    x2: 1386,
    y2: 760,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1387,
    y1: 774,
    x2: 1407,
    y2: 773,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1394,
    y1: 786,
    x2: 1428,
    y2: 786,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1401,
    y1: 798,
    x2: 1449,
    y2: 799,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1408,
    y1: 810,
    x2: 1470,
    y2: 812,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1415,
    y1: 822,
    x2: 1421,
    y2: 820,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1422,
    y1: 834,
    x2: 1442,
    y2: 833,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1429,
    y1: 846,
    x2: 1463,
    y2: 846,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1436,
    y1: 858,
    x2: 1484,
    y2: 859,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1443,
    y1: 763,
    x2: 1505,
    y2: 765,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1450,
    y1: 775,
    x2: 1456,
    y2: 773,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1457,
    y1: 787,
    x2: 1477,
    y2: 786,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1464,
    y1: 799,
    x2: 1498,
    y2: 799,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1471,
    y1: 811,
    x2: 1519,
    y2: 812,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1478,
    y1: 823,
    x2: 1540,
    y2: 825,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1485,
    y1: 835,
    x2: 1491,
    y2: 833,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1492,
    y1: 847,
    x2: 1512,
    y2: 846,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1499,
    y1: 859,
    x2: 1533,
    y2: 859,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1506,
    y1: 764,
    x2: 1554,
    y2: 765,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1513,
    y1: 776,
    x2: 1575,
    y2: 778,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1520,
    y1: 788,
    x2: 1526,
    y2: 786,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1527,
    y1: 800,
    x2: 1547,
    y2: 799,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1534,
    y1: 812,
    x2: 1568,
    y2: 812,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1541,
    y1: 824,
    x2: 1589,
    y2: 825,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1548,
    y1: 836,
    x2: 1610,
    y2: 838,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1555,
    y1: 848,
    x2: 1561,
    y2: 846,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1562,
    y1: 860,
    x2: 1582,
    y2: 859,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1569,
    y1: 765,
    x2: 1603,
    y2: 765,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1576,
    y1: 777,
    x2: 1624,
    y2: 778,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1583,
    y1: 789,
    x2: 1645,
    y2: 791,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1590,
    y1: 801,
    x2: 1596,
    y2: 799,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1597,
    y1: 813,
    x2: 1617,
    y2: 812,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1604,
    y1: 825,
    x2: 1638,
    y2: 825,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1611,
    y1: 837,
    x2: 1659,
    y2: 838,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1618,
    y1: 849,
    x2: 1680,
    y2: 851,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1625,
    y1: 861,
    x2: 1631,
    y2: 859,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1632,
    y1: 760,
    x2: 1652,
    y2: 759,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1639,
    y1: 772,
    x2: 1673,
    y2: 772,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1646,
    y1: 784,
    x2: 1694,
    y2: 785,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1653,
    y1: 796,
    x2: 1715,
    y2: 798,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1660,
    y1: 808,
    x2: 1666,
    y2: 806,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1667,
    y1: 820,
    x2: 1687,
    y2: 819,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1674,
    y1: 832,
    x2: 1708,
    y2: 832,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1681,
    y1: 844,
    x2: 1729,
    y2: 845,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1688,
    y1: 856,
    x2: 1750,
    y2: 858,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1695,
    y1: 761,
    x2: 1701,
    y2: 759,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1702,
    y1: 773,
    x2: 1722,
    y2: 772,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1709,
    y1: 785,
    x2: 1743,
    y2: 785,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 1716,
    y1: 797,
    x2: 1764,
    y2: 798,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 1723,
    y1: 809,
    x2: 1785,
    y2: 811,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 1730,
    y1: 821,
    x2: 1736,
    y2: 819,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 1737,
    y1: 833,
    x2: 1757,
    y2: 832,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 1744,
    y1: 845,
    x2: 1778,
    y2: 845,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 1751,
    y1: 857,
    x2: 1799,
    y2: 858,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 1758,
    y1: 762,
    x2: 1820,
    y2: 764,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 1765,
    y1: 774,
    x2: 1771,
    y2: 772,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 1772,
    y1: 786,
    x2: 1792,
    y2: 785,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 1779,
    y1: 798,
    x2: 1813,
    y2: 798,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 1786,
    y1: 810,
    x2: 1834,
    y2: 811,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 1793,
    y1: 822,
    x2: 1855,
    y2: 824,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 120,
    y1: 834,
    x2: 126,
    y2: 832,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 127,
    y1: 846,
    x2: 147,
    y2: 845,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 134,
    y1: 858,
    x2: 168,
    y2: 858,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 141,
    y1: 763,
    x2: 189,
    y2: 764,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 148,
    y1: 775,
    x2: 210,
    y2: 777,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 155,
    y1: 787,
    x2: 161,
    y2: 785,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 162,
    y1: 799,
    x2: 182,
    y2: 798,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 169,
    y1: 811,
    x2: 203,
    y2: 811,
    width: 1.0,
    opacity: 0.17,
  },
  {
    x1: 176,
    y1: 823,
    x2: 224,
    y2: 824,
    width: 0.4,
    opacity: 0.22,
  },
  {
    x1: 183,
    y1: 835,
    x2: 245,
    y2: 837,
    width: 0.6,
    opacity: 0.27,
  },
  {
    x1: 190,
    y1: 847,
    x2: 196,
    y2: 845,
    width: 0.8,
    opacity: 0.32,
  },
  {
    x1: 197,
    y1: 859,
    x2: 217,
    y2: 858,
    width: 1.0,
    opacity: 0.37,
  },
  {
    x1: 204,
    y1: 764,
    x2: 238,
    y2: 764,
    width: 0.4,
    opacity: 0.12,
  },
  {
    x1: 211,
    y1: 776,
    x2: 259,
    y2: 777,
    width: 0.6,
    opacity: 0.17,
  },
  {
    x1: 218,
    y1: 788,
    x2: 280,
    y2: 790,
    width: 0.8,
    opacity: 0.22,
  },
  {
    x1: 225,
    y1: 800,
    x2: 231,
    y2: 798,
    width: 1.0,
    opacity: 0.27,
  },
  {
    x1: 232,
    y1: 812,
    x2: 252,
    y2: 811,
    width: 0.4,
    opacity: 0.32,
  },
  {
    x1: 239,
    y1: 824,
    x2: 273,
    y2: 824,
    width: 0.6,
    opacity: 0.37,
  },
  {
    x1: 246,
    y1: 836,
    x2: 294,
    y2: 837,
    width: 0.8,
    opacity: 0.12,
  },
  {
    x1: 253,
    y1: 848,
    x2: 315,
    y2: 850,
    width: 1.0,
    opacity: 0.17,
  },
];

const PANEL_POSTS: Array<{ x: number; h: number; o: number }> = [
  {
    x: 40,
    h: 40,
    o: 0.08,
  },
  {
    x: 54,
    h: 44,
    o: 0.14,
  },
  {
    x: 68,
    h: 48,
    o: 0.20,
  },
  {
    x: 82,
    h: 52,
    o: 0.26,
  },
  {
    x: 96,
    h: 56,
    o: 0.32,
  },
  {
    x: 110,
    h: 60,
    o: 0.08,
  },
  {
    x: 124,
    h: 64,
    o: 0.14,
  },
  {
    x: 138,
    h: 40,
    o: 0.20,
  },
  {
    x: 152,
    h: 44,
    o: 0.26,
  },
  {
    x: 166,
    h: 48,
    o: 0.32,
  },
  {
    x: 180,
    h: 52,
    o: 0.08,
  },
  {
    x: 194,
    h: 56,
    o: 0.14,
  },
  {
    x: 208,
    h: 60,
    o: 0.20,
  },
  {
    x: 222,
    h: 64,
    o: 0.26,
  },
  {
    x: 236,
    h: 40,
    o: 0.32,
  },
  {
    x: 250,
    h: 44,
    o: 0.08,
  },
  {
    x: 264,
    h: 48,
    o: 0.14,
  },
  {
    x: 278,
    h: 52,
    o: 0.20,
  },
  {
    x: 292,
    h: 56,
    o: 0.26,
  },
  {
    x: 306,
    h: 60,
    o: 0.32,
  },
  {
    x: 320,
    h: 64,
    o: 0.08,
  },
  {
    x: 334,
    h: 40,
    o: 0.14,
  },
  {
    x: 348,
    h: 44,
    o: 0.20,
  },
  {
    x: 362,
    h: 48,
    o: 0.26,
  },
  {
    x: 376,
    h: 52,
    o: 0.32,
  },
  {
    x: 390,
    h: 56,
    o: 0.08,
  },
  {
    x: 404,
    h: 60,
    o: 0.14,
  },
  {
    x: 418,
    h: 64,
    o: 0.20,
  },
  {
    x: 432,
    h: 40,
    o: 0.26,
  },
  {
    x: 446,
    h: 44,
    o: 0.32,
  },
  {
    x: 460,
    h: 48,
    o: 0.08,
  },
  {
    x: 474,
    h: 52,
    o: 0.14,
  },
  {
    x: 488,
    h: 56,
    o: 0.20,
  },
  {
    x: 502,
    h: 60,
    o: 0.26,
  },
  {
    x: 516,
    h: 64,
    o: 0.32,
  },
  {
    x: 530,
    h: 40,
    o: 0.08,
  },
  {
    x: 544,
    h: 44,
    o: 0.14,
  },
  {
    x: 558,
    h: 48,
    o: 0.20,
  },
  {
    x: 572,
    h: 52,
    o: 0.26,
  },
  {
    x: 586,
    h: 56,
    o: 0.32,
  },
  {
    x: 600,
    h: 60,
    o: 0.08,
  },
  {
    x: 614,
    h: 64,
    o: 0.14,
  },
  {
    x: 628,
    h: 40,
    o: 0.20,
  },
  {
    x: 642,
    h: 44,
    o: 0.26,
  },
  {
    x: 656,
    h: 48,
    o: 0.32,
  },
  {
    x: 670,
    h: 52,
    o: 0.08,
  },
  {
    x: 684,
    h: 56,
    o: 0.14,
  },
  {
    x: 698,
    h: 60,
    o: 0.20,
  },
  {
    x: 712,
    h: 64,
    o: 0.26,
  },
  {
    x: 726,
    h: 40,
    o: 0.32,
  },
  {
    x: 740,
    h: 44,
    o: 0.08,
  },
  {
    x: 754,
    h: 48,
    o: 0.14,
  },
  {
    x: 768,
    h: 52,
    o: 0.20,
  },
  {
    x: 782,
    h: 56,
    o: 0.26,
  },
  {
    x: 796,
    h: 60,
    o: 0.32,
  },
  {
    x: 810,
    h: 64,
    o: 0.08,
  },
  {
    x: 824,
    h: 40,
    o: 0.14,
  },
  {
    x: 838,
    h: 44,
    o: 0.20,
  },
  {
    x: 852,
    h: 48,
    o: 0.26,
  },
  {
    x: 866,
    h: 52,
    o: 0.32,
  },
  {
    x: 880,
    h: 56,
    o: 0.08,
  },
  {
    x: 894,
    h: 60,
    o: 0.14,
  },
  {
    x: 908,
    h: 64,
    o: 0.20,
  },
  {
    x: 922,
    h: 40,
    o: 0.26,
  },
  {
    x: 936,
    h: 44,
    o: 0.32,
  },
  {
    x: 950,
    h: 48,
    o: 0.08,
  },
  {
    x: 964,
    h: 52,
    o: 0.14,
  },
  {
    x: 978,
    h: 56,
    o: 0.20,
  },
  {
    x: 992,
    h: 60,
    o: 0.26,
  },
  {
    x: 1006,
    h: 64,
    o: 0.32,
  },
  {
    x: 1020,
    h: 40,
    o: 0.08,
  },
  {
    x: 1034,
    h: 44,
    o: 0.14,
  },
  {
    x: 1048,
    h: 48,
    o: 0.20,
  },
  {
    x: 1062,
    h: 52,
    o: 0.26,
  },
  {
    x: 1076,
    h: 56,
    o: 0.32,
  },
  {
    x: 1090,
    h: 60,
    o: 0.08,
  },
  {
    x: 1104,
    h: 64,
    o: 0.14,
  },
  {
    x: 1118,
    h: 40,
    o: 0.20,
  },
  {
    x: 1132,
    h: 44,
    o: 0.26,
  },
  {
    x: 1146,
    h: 48,
    o: 0.32,
  },
  {
    x: 1160,
    h: 52,
    o: 0.08,
  },
  {
    x: 1174,
    h: 56,
    o: 0.14,
  },
  {
    x: 1188,
    h: 60,
    o: 0.20,
  },
  {
    x: 1202,
    h: 64,
    o: 0.26,
  },
  {
    x: 1216,
    h: 40,
    o: 0.32,
  },
  {
    x: 1230,
    h: 44,
    o: 0.08,
  },
  {
    x: 1244,
    h: 48,
    o: 0.14,
  },
  {
    x: 1258,
    h: 52,
    o: 0.20,
  },
  {
    x: 1272,
    h: 56,
    o: 0.26,
  },
  {
    x: 1286,
    h: 60,
    o: 0.32,
  },
  {
    x: 1300,
    h: 64,
    o: 0.08,
  },
  {
    x: 1314,
    h: 40,
    o: 0.14,
  },
  {
    x: 1328,
    h: 44,
    o: 0.20,
  },
  {
    x: 1342,
    h: 48,
    o: 0.26,
  },
  {
    x: 1356,
    h: 52,
    o: 0.32,
  },
  {
    x: 1370,
    h: 56,
    o: 0.08,
  },
  {
    x: 1384,
    h: 60,
    o: 0.14,
  },
  {
    x: 1398,
    h: 64,
    o: 0.20,
  },
  {
    x: 1412,
    h: 40,
    o: 0.26,
  },
  {
    x: 1426,
    h: 44,
    o: 0.32,
  },
  {
    x: 1440,
    h: 48,
    o: 0.08,
  },
  {
    x: 1454,
    h: 52,
    o: 0.14,
  },
  {
    x: 1468,
    h: 56,
    o: 0.20,
  },
  {
    x: 1482,
    h: 60,
    o: 0.26,
  },
  {
    x: 1496,
    h: 64,
    o: 0.32,
  },
  {
    x: 1510,
    h: 40,
    o: 0.08,
  },
  {
    x: 1524,
    h: 44,
    o: 0.14,
  },
  {
    x: 1538,
    h: 48,
    o: 0.20,
  },
  {
    x: 1552,
    h: 52,
    o: 0.26,
  },
  {
    x: 1566,
    h: 56,
    o: 0.32,
  },
  {
    x: 1580,
    h: 60,
    o: 0.08,
  },
  {
    x: 1594,
    h: 64,
    o: 0.14,
  },
  {
    x: 1608,
    h: 40,
    o: 0.20,
  },
  {
    x: 1622,
    h: 44,
    o: 0.26,
  },
  {
    x: 1636,
    h: 48,
    o: 0.32,
  },
  {
    x: 1650,
    h: 52,
    o: 0.08,
  },
  {
    x: 1664,
    h: 56,
    o: 0.14,
  },
  {
    x: 1678,
    h: 60,
    o: 0.20,
  },
  {
    x: 1692,
    h: 64,
    o: 0.26,
  },
  {
    x: 1706,
    h: 40,
    o: 0.32,
  },
  {
    x: 1720,
    h: 44,
    o: 0.08,
  },
  {
    x: 1734,
    h: 48,
    o: 0.14,
  },
  {
    x: 1748,
    h: 52,
    o: 0.20,
  },
  {
    x: 1762,
    h: 56,
    o: 0.26,
  },
  {
    x: 1776,
    h: 60,
    o: 0.32,
  },
  {
    x: 1790,
    h: 64,
    o: 0.08,
  },
  {
    x: 1804,
    h: 40,
    o: 0.14,
  },
  {
    x: 1818,
    h: 44,
    o: 0.20,
  },
  {
    x: 1832,
    h: 48,
    o: 0.26,
  },
  {
    x: 1846,
    h: 52,
    o: 0.32,
  },
  {
    x: 1860,
    h: 56,
    o: 0.08,
  },
  {
    x: 1874,
    h: 60,
    o: 0.14,
  },
  {
    x: 1888,
    h: 64,
    o: 0.20,
  },
  {
    x: 1902,
    h: 40,
    o: 0.26,
  },
  {
    x: 1916,
    h: 44,
    o: 0.32,
  },
  {
    x: 1930,
    h: 48,
    o: 0.08,
  },
  {
    x: 1944,
    h: 52,
    o: 0.14,
  },
  {
    x: 1958,
    h: 56,
    o: 0.20,
  },
  {
    x: 1972,
    h: 60,
    o: 0.26,
  },
  {
    x: 1986,
    h: 64,
    o: 0.32,
  },
];

const WoodGrain: React.FC<{ x: number; y: number; width: number; height: number; seed: number; tone?: string }> = ({
  x,
  y,
  width,
  height,
  seed,
  tone = '#4b2f22',
}) => {
  const strokes = useMemo(() => {
    const rand = seededRandom(seed);
    return new Array(520).fill(null).map((_, index) => {
      const x1 = x + rand() * width;
      const y1 = y + rand() * height;
      const drift = (rand() - 0.5) * 48;
      const x2 = x1 + drift;
      const y2 = y1 + 12 + rand() * 36;
      return {
        id: index,
        x1,
        y1,
        x2,
        y2,
        width: 0.4 + rand() * 1.3,
        opacity: 0.05 + rand() * 0.2,
      };
    });
  }, [height, seed, width, x, y]);

  return (
    <g>
      {strokes.map((stroke) => (
        <line
          key={stroke.id}
          x1={stroke.x1}
          y1={stroke.y1}
          x2={stroke.x2}
          y2={stroke.y2}
          stroke={tone}
          strokeWidth={stroke.width}
          opacity={stroke.opacity}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

const BrickWall: React.FC<{ x: number; y: number; width: number; height: number }> = ({ x, y, width, height }) => {
  const rows = Math.ceil(height / 24);
  const cols = Math.ceil(width / 60);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#5a4335" opacity={0.7} />
      {new Array(rows).fill(null).map((_, row) => (
        <g key={`row-${row}`}>
          {new Array(cols).fill(null).map((__, col) => {
            const offset = row % 2 === 0 ? 0 : 30;
            const bx = x + col * 60 - offset;
            const by = y + row * 24;
            const shade = (row + col) % 3;
            const fill = shade === 0 ? '#6b4f3f' : shade === 1 ? '#715444' : '#624838';
            return (
              <rect
                key={`brick-${row}-${col}`}
                x={bx}
                y={by}
                width={58}
                height={22}
                fill={fill}
                stroke="#4f3a2f"
                strokeWidth={1}
                opacity={0.35}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
};

const Bottle: React.FC<{ data: BottleData }> = ({ data }) => {
  const baseY = data.shelf === 0 ? 540 : 420;
  const neckW = Math.max(6, data.width * 0.28);
  const bodyX = data.x - data.width / 2;
  const topY = baseY - data.height;
  const liquidHeight = (data.height - 16) * data.liquidLevel;
  return (
    <g opacity={data.opacity}>
      {data.shape === 'round' && (
        <path d={`M ${bodyX} ${baseY} L ${bodyX + 6} ${topY + 30} Q ${data.x} ${topY} ${bodyX + data.width - 6} ${topY + 30} L ${bodyX + data.width} ${baseY} Z`} fill={data.glassColor} stroke="#c3b9ac" strokeWidth={1.3} />
      )}
      {data.shape === 'square' && (
        <rect x={bodyX} y={topY + 14} width={data.width} height={data.height - 14} rx={5} fill={data.glassColor} stroke="#d4cbbe" strokeWidth={1.2} />
      )}
      {data.shape === 'flask' && (
        <path d={`M ${bodyX} ${baseY} L ${bodyX + data.width * 0.2} ${topY + 42} L ${bodyX + data.width * 0.8} ${topY + 42} L ${bodyX + data.width} ${baseY} Z`} fill={data.glassColor} stroke="#d0c5b7" strokeWidth={1.2} />
      )}
      {data.shape === 'tall' && (
        <rect x={bodyX + data.width * 0.15} y={topY + 8} width={data.width * 0.7} height={data.height - 8} rx={12} fill={data.glassColor} stroke="#d0c2b0" strokeWidth={1.2} />
      )}
      {data.shape === 'longneck' && (
        <path d={`M ${bodyX + 4} ${baseY} L ${bodyX + 2} ${topY + 35} Q ${data.x} ${topY + 8} ${bodyX + data.width - 2} ${topY + 35} L ${bodyX + data.width - 4} ${baseY} Z`} fill={data.glassColor} stroke="#c7bcaf" strokeWidth={1.2} />
      )}
      <rect x={data.x - neckW / 2} y={topY - 10} width={neckW} height={22} rx={4} fill={data.glassColor} stroke="#d8cfbf" strokeWidth={1} />
      <rect x={bodyX + 4} y={baseY - liquidHeight - 4} width={Math.max(4, data.width - 8)} height={liquidHeight} rx={4} fill={data.liquidColor} opacity={0.62} />
      <rect x={bodyX + 5} y={baseY - data.height * 0.42} width={Math.max(8, data.width - 10)} height={14} rx={3} fill={data.labelColor} opacity={0.84} />
    </g>
  );
};

const VolumetricRays: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {[0, 1, 2, 3].map((idx) => {
        const sway = Math.sin(frame / 48 + idx) * 40;
        return (
          <path
            key={idx}
            d={`M ${220 + idx * 420 + sway} 80 L ${420 + idx * 420 + sway} 80 L ${550 + idx * 260} 860 L ${110 + idx * 260} 860 Z`}
            fill="url(#ray-grad)"
            opacity={0.22}
          />
        );
      })}
    </g>
  );
};

const DustMotes: React.FC = () => {
  const frame = useCurrentFrame();
  const motes = useMemo(() => {
    const rand = seededRandom(99017);
    return new Array(100).fill(null).map((_, idx) => ({
      id: idx,
      baseX: rand() * 1920,
      baseY: rand() * 1080,
      radius: 0.7 + rand() * 2.4,
      speed: 0.2 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
    }));
  }, []);
  return (
    <g>
      {motes.map((mote) => {
        const x = mote.baseX + Math.sin(frame / 35 * mote.speed + mote.phase) * 18 + Math.sin(frame / 97 + mote.phase) * 8;
        const y = mote.baseY + Math.cos(frame / 42 * mote.speed + mote.phase) * 18 + Math.sin(frame / 58 + mote.phase) * 10;
        const opacity = 0.08 + ((Math.sin(frame / 18 + mote.phase) + 1) / 2) * 0.25;
        return <circle key={mote.id} cx={x} cy={y} r={mote.radius} fill="#ffeccc" opacity={opacity} />;
      })}
    </g>
  );
};

const Lamp: React.FC<{ x: number; y: number; flickerOffset: number }> = ({ x, y, flickerOffset }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 6 + flickerOffset), [-1, 1], [0.68, 1]);
  return (
    <g>
      <rect x={x - 4} y={y - 50} width={8} height={40} fill="#3a2c20" />
      <ellipse cx={x} cy={y} rx={28} ry={20} fill="#f7d092" opacity={0.9 * glow} />
      <circle cx={x} cy={y - 2} r={9} fill="#fff2bf" opacity={0.95 * glow} />
      <ellipse cx={x} cy={y + 8} rx={95} ry={24} fill="#f7d092" opacity={0.1 * glow} />
    </g>
  );
};

const PintGlass: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const bubbles = useMemo(() => {
    const rand = seededRandom(5050);
    return new Array(36).fill(null).map((_, i) => ({
      id: i,
      bx: x - 12 + rand() * 24,
      by: y - 80 + rand() * 72,
      r: 1 + rand() * 2.4,
      speed: 0.7 + rand() * 1.8,
      phase: rand() * Math.PI * 2,
    }));
  }, [x, y]);
  return (
    <g>
      <path d={`M ${x - 20} ${y} L ${x - 14} ${y - 86} Q ${x} ${y - 96} ${x + 14} ${y - 86} L ${x + 20} ${y} Z`} fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
      <path d={`M ${x - 15} ${y - 2} L ${x - 11} ${y - 72} Q ${x} ${y - 79} ${x + 11} ${y - 72} L ${x + 15} ${y - 2} Z`} fill="#d3982c" opacity={0.85} />
      <ellipse cx={x} cy={y - 79} rx={13} ry={5} fill="#fff5d6" opacity={0.92} />
      {bubbles.map((bubble) => {
        const rise = ((frame * bubble.speed + bubble.phase * 20) % 86);
        const by = y - 8 - rise;
        return <circle key={bubble.id} cx={bubble.bx} cy={by} r={bubble.r} fill="#ffe8b0" opacity={0.38} />;
      })}
    </g>
  );
};

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bottles = useMemo(generateBottles, []);
  const pub = Palette.Pub;
  const slowZoom = interpolate(frame, [0, durationInFrames], [1, 1.03]);

  return (
    <SceneShell title="Scene 01 · Pub Establishing" act="Pub">
      <AbsoluteFill style={{ transform: `scale(${slowZoom})`, transformOrigin: '52% 52%' }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="ray-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe2b0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffe2b0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="counter-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7f5337" />
              <stop offset="100%" stopColor="#3f281c" />
            </linearGradient>
          </defs>

          <rect x={0} y={0} width={1920} height={1080} fill={pub.background} />
          <BrickWall x={130} y={130} width={1660} height={210} />
          <rect x={120} y={300} width={1680} height={430} fill="#674532" />
          <WoodGrain x={120} y={300} width={1680} height={430} seed={44} tone="#3f281d" />
          {PANEL_POSTS.map((post, idx) => (
            <rect key={`post-${idx}`} x={post.x} y={730 - post.h} width={8} height={post.h} fill="#3f271b" opacity={post.o} />
          ))}

          <rect x={150} y={400} width={1620} height={16} fill="#8c6246" />
          <rect x={150} y={520} width={1620} height={18} fill="#8c6246" />
          <WoodGrain x={150} y={392} width={1620} height={30} seed={62} tone="#2f1a12" />
          <WoodGrain x={150} y={510} width={1620} height={36} seed={63} tone="#2f1a12" />
          {bottles.map((bottle) => (
            <Bottle key={bottle.id} data={bottle} />
          ))}

          <VolumetricRays />
          <DustMotes />
          <Lamp x={420} y={190} flickerOffset={0.2} />
          <Lamp x={940} y={180} flickerOffset={0.9} />
          <Lamp x={1460} y={195} flickerOffset={1.4} />

          <rect x={0} y={740} width={1920} height={340} fill="url(#counter-grad)" />
          <rect x={0} y={720} width={1920} height={36} fill="#996845" />
          <WoodGrain x={0} y={720} width={1920} height={340} seed={91} tone="#2e1c13" />
          {BAR_SCRATCHES.map((scratch, idx) => (
            <line key={`scratch-${idx}`} x1={scratch.x1} y1={scratch.y1} x2={scratch.x2} y2={scratch.y2} stroke="#d9a273" strokeWidth={scratch.width} opacity={scratch.opacity} strokeLinecap="round" />
          ))}

          {[0, 1, 2, 3, 4, 5].map((tap) => (
            <g key={`tap-${tap}`} transform={`translate(${620 + tap * 110}, 700)`}>
              <rect x={-9} y={-42} width={18} height={52} rx={6} fill="#ad8b46" />
              <rect x={-16} y={-56} width={32} height={15} rx={5} fill="#c4a158" />
              <circle cx={0} cy={-48} r={5} fill="#e2c17a" />
            </g>
          ))}

          <g transform="translate(1180, 580)">
            <ProfessorPint talking={false} scale={1.18} />
          </g>
          <PintGlass x={1090} y={760} />
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
};
