import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ProfessorPint } from '../components/ProfessorPint';
import { SceneShell } from '../components/SceneShell';
import { Palette } from '../design-system/Palette';

type VortexType = 'coin' | 'spear' | 'shell' | 'gear';
type VortexParticle = {
  id: number;
  angle: number;
  radius: number;
  size: number;
  depth: number;
  type: VortexType;
  hue: string;
  phase: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const seededRandom = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const SYMBOL_PATHS = [
  'H000-COIN-SHELL-SPEAR-GEAR',
  'H001-COIN-SHELL-SPEAR-GEAR',
  'H002-COIN-SHELL-SPEAR-GEAR',
  'H003-COIN-SHELL-SPEAR-GEAR',
  'H004-COIN-SHELL-SPEAR-GEAR',
  'H005-COIN-SHELL-SPEAR-GEAR',
  'H006-COIN-SHELL-SPEAR-GEAR',
  'H007-COIN-SHELL-SPEAR-GEAR',
  'H008-COIN-SHELL-SPEAR-GEAR',
  'H009-COIN-SHELL-SPEAR-GEAR',
  'H010-COIN-SHELL-SPEAR-GEAR',
  'H011-COIN-SHELL-SPEAR-GEAR',
  'H012-COIN-SHELL-SPEAR-GEAR',
  'H013-COIN-SHELL-SPEAR-GEAR',
  'H014-COIN-SHELL-SPEAR-GEAR',
  'H015-COIN-SHELL-SPEAR-GEAR',
  'H016-COIN-SHELL-SPEAR-GEAR',
  'H017-COIN-SHELL-SPEAR-GEAR',
  'H018-COIN-SHELL-SPEAR-GEAR',
  'H019-COIN-SHELL-SPEAR-GEAR',
  'H020-COIN-SHELL-SPEAR-GEAR',
  'H021-COIN-SHELL-SPEAR-GEAR',
  'H022-COIN-SHELL-SPEAR-GEAR',
  'H023-COIN-SHELL-SPEAR-GEAR',
  'H024-COIN-SHELL-SPEAR-GEAR',
  'H025-COIN-SHELL-SPEAR-GEAR',
  'H026-COIN-SHELL-SPEAR-GEAR',
  'H027-COIN-SHELL-SPEAR-GEAR',
  'H028-COIN-SHELL-SPEAR-GEAR',
  'H029-COIN-SHELL-SPEAR-GEAR',
  'H030-COIN-SHELL-SPEAR-GEAR',
  'H031-COIN-SHELL-SPEAR-GEAR',
  'H032-COIN-SHELL-SPEAR-GEAR',
  'H033-COIN-SHELL-SPEAR-GEAR',
  'H034-COIN-SHELL-SPEAR-GEAR',
  'H035-COIN-SHELL-SPEAR-GEAR',
  'H036-COIN-SHELL-SPEAR-GEAR',
  'H037-COIN-SHELL-SPEAR-GEAR',
  'H038-COIN-SHELL-SPEAR-GEAR',
  'H039-COIN-SHELL-SPEAR-GEAR',
  'H040-COIN-SHELL-SPEAR-GEAR',
  'H041-COIN-SHELL-SPEAR-GEAR',
  'H042-COIN-SHELL-SPEAR-GEAR',
  'H043-COIN-SHELL-SPEAR-GEAR',
  'H044-COIN-SHELL-SPEAR-GEAR',
  'H045-COIN-SHELL-SPEAR-GEAR',
  'H046-COIN-SHELL-SPEAR-GEAR',
  'H047-COIN-SHELL-SPEAR-GEAR',
  'H048-COIN-SHELL-SPEAR-GEAR',
  'H049-COIN-SHELL-SPEAR-GEAR',
  'H050-COIN-SHELL-SPEAR-GEAR',
  'H051-COIN-SHELL-SPEAR-GEAR',
  'H052-COIN-SHELL-SPEAR-GEAR',
  'H053-COIN-SHELL-SPEAR-GEAR',
  'H054-COIN-SHELL-SPEAR-GEAR',
  'H055-COIN-SHELL-SPEAR-GEAR',
  'H056-COIN-SHELL-SPEAR-GEAR',
  'H057-COIN-SHELL-SPEAR-GEAR',
  'H058-COIN-SHELL-SPEAR-GEAR',
  'H059-COIN-SHELL-SPEAR-GEAR',
  'H060-COIN-SHELL-SPEAR-GEAR',
  'H061-COIN-SHELL-SPEAR-GEAR',
  'H062-COIN-SHELL-SPEAR-GEAR',
  'H063-COIN-SHELL-SPEAR-GEAR',
  'H064-COIN-SHELL-SPEAR-GEAR',
  'H065-COIN-SHELL-SPEAR-GEAR',
  'H066-COIN-SHELL-SPEAR-GEAR',
  'H067-COIN-SHELL-SPEAR-GEAR',
  'H068-COIN-SHELL-SPEAR-GEAR',
  'H069-COIN-SHELL-SPEAR-GEAR',
  'H070-COIN-SHELL-SPEAR-GEAR',
  'H071-COIN-SHELL-SPEAR-GEAR',
  'H072-COIN-SHELL-SPEAR-GEAR',
  'H073-COIN-SHELL-SPEAR-GEAR',
  'H074-COIN-SHELL-SPEAR-GEAR',
  'H075-COIN-SHELL-SPEAR-GEAR',
  'H076-COIN-SHELL-SPEAR-GEAR',
  'H077-COIN-SHELL-SPEAR-GEAR',
  'H078-COIN-SHELL-SPEAR-GEAR',
  'H079-COIN-SHELL-SPEAR-GEAR',
  'H080-COIN-SHELL-SPEAR-GEAR',
  'H081-COIN-SHELL-SPEAR-GEAR',
  'H082-COIN-SHELL-SPEAR-GEAR',
  'H083-COIN-SHELL-SPEAR-GEAR',
  'H084-COIN-SHELL-SPEAR-GEAR',
  'H085-COIN-SHELL-SPEAR-GEAR',
  'H086-COIN-SHELL-SPEAR-GEAR',
  'H087-COIN-SHELL-SPEAR-GEAR',
  'H088-COIN-SHELL-SPEAR-GEAR',
  'H089-COIN-SHELL-SPEAR-GEAR',
  'H090-COIN-SHELL-SPEAR-GEAR',
  'H091-COIN-SHELL-SPEAR-GEAR',
  'H092-COIN-SHELL-SPEAR-GEAR',
  'H093-COIN-SHELL-SPEAR-GEAR',
  'H094-COIN-SHELL-SPEAR-GEAR',
  'H095-COIN-SHELL-SPEAR-GEAR',
  'H096-COIN-SHELL-SPEAR-GEAR',
  'H097-COIN-SHELL-SPEAR-GEAR',
  'H098-COIN-SHELL-SPEAR-GEAR',
  'H099-COIN-SHELL-SPEAR-GEAR',
  'H100-COIN-SHELL-SPEAR-GEAR',
  'H101-COIN-SHELL-SPEAR-GEAR',
  'H102-COIN-SHELL-SPEAR-GEAR',
  'H103-COIN-SHELL-SPEAR-GEAR',
  'H104-COIN-SHELL-SPEAR-GEAR',
  'H105-COIN-SHELL-SPEAR-GEAR',
  'H106-COIN-SHELL-SPEAR-GEAR',
  'H107-COIN-SHELL-SPEAR-GEAR',
  'H108-COIN-SHELL-SPEAR-GEAR',
  'H109-COIN-SHELL-SPEAR-GEAR',
  'H110-COIN-SHELL-SPEAR-GEAR',
  'H111-COIN-SHELL-SPEAR-GEAR',
  'H112-COIN-SHELL-SPEAR-GEAR',
  'H113-COIN-SHELL-SPEAR-GEAR',
  'H114-COIN-SHELL-SPEAR-GEAR',
  'H115-COIN-SHELL-SPEAR-GEAR',
  'H116-COIN-SHELL-SPEAR-GEAR',
  'H117-COIN-SHELL-SPEAR-GEAR',
  'H118-COIN-SHELL-SPEAR-GEAR',
  'H119-COIN-SHELL-SPEAR-GEAR',
  'H120-COIN-SHELL-SPEAR-GEAR',
  'H121-COIN-SHELL-SPEAR-GEAR',
  'H122-COIN-SHELL-SPEAR-GEAR',
  'H123-COIN-SHELL-SPEAR-GEAR',
  'H124-COIN-SHELL-SPEAR-GEAR',
  'H125-COIN-SHELL-SPEAR-GEAR',
  'H126-COIN-SHELL-SPEAR-GEAR',
  'H127-COIN-SHELL-SPEAR-GEAR',
  'H128-COIN-SHELL-SPEAR-GEAR',
  'H129-COIN-SHELL-SPEAR-GEAR',
  'H130-COIN-SHELL-SPEAR-GEAR',
  'H131-COIN-SHELL-SPEAR-GEAR',
  'H132-COIN-SHELL-SPEAR-GEAR',
  'H133-COIN-SHELL-SPEAR-GEAR',
  'H134-COIN-SHELL-SPEAR-GEAR',
  'H135-COIN-SHELL-SPEAR-GEAR',
  'H136-COIN-SHELL-SPEAR-GEAR',
  'H137-COIN-SHELL-SPEAR-GEAR',
  'H138-COIN-SHELL-SPEAR-GEAR',
  'H139-COIN-SHELL-SPEAR-GEAR',
  'H140-COIN-SHELL-SPEAR-GEAR',
  'H141-COIN-SHELL-SPEAR-GEAR',
  'H142-COIN-SHELL-SPEAR-GEAR',
  'H143-COIN-SHELL-SPEAR-GEAR',
  'H144-COIN-SHELL-SPEAR-GEAR',
  'H145-COIN-SHELL-SPEAR-GEAR',
  'H146-COIN-SHELL-SPEAR-GEAR',
  'H147-COIN-SHELL-SPEAR-GEAR',
  'H148-COIN-SHELL-SPEAR-GEAR',
  'H149-COIN-SHELL-SPEAR-GEAR',
  'H150-COIN-SHELL-SPEAR-GEAR',
  'H151-COIN-SHELL-SPEAR-GEAR',
  'H152-COIN-SHELL-SPEAR-GEAR',
  'H153-COIN-SHELL-SPEAR-GEAR',
  'H154-COIN-SHELL-SPEAR-GEAR',
  'H155-COIN-SHELL-SPEAR-GEAR',
  'H156-COIN-SHELL-SPEAR-GEAR',
  'H157-COIN-SHELL-SPEAR-GEAR',
  'H158-COIN-SHELL-SPEAR-GEAR',
  'H159-COIN-SHELL-SPEAR-GEAR',
  'H160-COIN-SHELL-SPEAR-GEAR',
  'H161-COIN-SHELL-SPEAR-GEAR',
  'H162-COIN-SHELL-SPEAR-GEAR',
  'H163-COIN-SHELL-SPEAR-GEAR',
  'H164-COIN-SHELL-SPEAR-GEAR',
  'H165-COIN-SHELL-SPEAR-GEAR',
  'H166-COIN-SHELL-SPEAR-GEAR',
  'H167-COIN-SHELL-SPEAR-GEAR',
  'H168-COIN-SHELL-SPEAR-GEAR',
  'H169-COIN-SHELL-SPEAR-GEAR',
  'H170-COIN-SHELL-SPEAR-GEAR',
  'H171-COIN-SHELL-SPEAR-GEAR',
  'H172-COIN-SHELL-SPEAR-GEAR',
  'H173-COIN-SHELL-SPEAR-GEAR',
  'H174-COIN-SHELL-SPEAR-GEAR',
  'H175-COIN-SHELL-SPEAR-GEAR',
  'H176-COIN-SHELL-SPEAR-GEAR',
  'H177-COIN-SHELL-SPEAR-GEAR',
  'H178-COIN-SHELL-SPEAR-GEAR',
  'H179-COIN-SHELL-SPEAR-GEAR',
  'H180-COIN-SHELL-SPEAR-GEAR',
  'H181-COIN-SHELL-SPEAR-GEAR',
  'H182-COIN-SHELL-SPEAR-GEAR',
  'H183-COIN-SHELL-SPEAR-GEAR',
  'H184-COIN-SHELL-SPEAR-GEAR',
  'H185-COIN-SHELL-SPEAR-GEAR',
  'H186-COIN-SHELL-SPEAR-GEAR',
  'H187-COIN-SHELL-SPEAR-GEAR',
  'H188-COIN-SHELL-SPEAR-GEAR',
  'H189-COIN-SHELL-SPEAR-GEAR',
  'H190-COIN-SHELL-SPEAR-GEAR',
  'H191-COIN-SHELL-SPEAR-GEAR',
  'H192-COIN-SHELL-SPEAR-GEAR',
  'H193-COIN-SHELL-SPEAR-GEAR',
  'H194-COIN-SHELL-SPEAR-GEAR',
  'H195-COIN-SHELL-SPEAR-GEAR',
  'H196-COIN-SHELL-SPEAR-GEAR',
  'H197-COIN-SHELL-SPEAR-GEAR',
  'H198-COIN-SHELL-SPEAR-GEAR',
  'H199-COIN-SHELL-SPEAR-GEAR',
  'H200-COIN-SHELL-SPEAR-GEAR',
  'H201-COIN-SHELL-SPEAR-GEAR',
  'H202-COIN-SHELL-SPEAR-GEAR',
  'H203-COIN-SHELL-SPEAR-GEAR',
  'H204-COIN-SHELL-SPEAR-GEAR',
  'H205-COIN-SHELL-SPEAR-GEAR',
  'H206-COIN-SHELL-SPEAR-GEAR',
  'H207-COIN-SHELL-SPEAR-GEAR',
  'H208-COIN-SHELL-SPEAR-GEAR',
  'H209-COIN-SHELL-SPEAR-GEAR',
  'H210-COIN-SHELL-SPEAR-GEAR',
  'H211-COIN-SHELL-SPEAR-GEAR',
  'H212-COIN-SHELL-SPEAR-GEAR',
  'H213-COIN-SHELL-SPEAR-GEAR',
  'H214-COIN-SHELL-SPEAR-GEAR',
  'H215-COIN-SHELL-SPEAR-GEAR',
  'H216-COIN-SHELL-SPEAR-GEAR',
  'H217-COIN-SHELL-SPEAR-GEAR',
  'H218-COIN-SHELL-SPEAR-GEAR',
  'H219-COIN-SHELL-SPEAR-GEAR',
  'H220-COIN-SHELL-SPEAR-GEAR',
  'H221-COIN-SHELL-SPEAR-GEAR',
  'H222-COIN-SHELL-SPEAR-GEAR',
  'H223-COIN-SHELL-SPEAR-GEAR',
  'H224-COIN-SHELL-SPEAR-GEAR',
  'H225-COIN-SHELL-SPEAR-GEAR',
  'H226-COIN-SHELL-SPEAR-GEAR',
  'H227-COIN-SHELL-SPEAR-GEAR',
  'H228-COIN-SHELL-SPEAR-GEAR',
  'H229-COIN-SHELL-SPEAR-GEAR',
  'H230-COIN-SHELL-SPEAR-GEAR',
  'H231-COIN-SHELL-SPEAR-GEAR',
  'H232-COIN-SHELL-SPEAR-GEAR',
  'H233-COIN-SHELL-SPEAR-GEAR',
  'H234-COIN-SHELL-SPEAR-GEAR',
  'H235-COIN-SHELL-SPEAR-GEAR',
  'H236-COIN-SHELL-SPEAR-GEAR',
  'H237-COIN-SHELL-SPEAR-GEAR',
  'H238-COIN-SHELL-SPEAR-GEAR',
  'H239-COIN-SHELL-SPEAR-GEAR',
  'H240-COIN-SHELL-SPEAR-GEAR',
  'H241-COIN-SHELL-SPEAR-GEAR',
  'H242-COIN-SHELL-SPEAR-GEAR',
  'H243-COIN-SHELL-SPEAR-GEAR',
  'H244-COIN-SHELL-SPEAR-GEAR',
  'H245-COIN-SHELL-SPEAR-GEAR',
  'H246-COIN-SHELL-SPEAR-GEAR',
  'H247-COIN-SHELL-SPEAR-GEAR',
  'H248-COIN-SHELL-SPEAR-GEAR',
  'H249-COIN-SHELL-SPEAR-GEAR',
  'H250-COIN-SHELL-SPEAR-GEAR',
  'H251-COIN-SHELL-SPEAR-GEAR',
  'H252-COIN-SHELL-SPEAR-GEAR',
  'H253-COIN-SHELL-SPEAR-GEAR',
  'H254-COIN-SHELL-SPEAR-GEAR',
  'H255-COIN-SHELL-SPEAR-GEAR',
  'H256-COIN-SHELL-SPEAR-GEAR',
  'H257-COIN-SHELL-SPEAR-GEAR',
  'H258-COIN-SHELL-SPEAR-GEAR',
  'H259-COIN-SHELL-SPEAR-GEAR',
] as const;

const MOTION_BLUR_SEEDS = [
  { x: 40, y: 80, l: 120, o: 0.04 },
  { x: 63, y: 99, l: 160, o: 0.07 },
  { x: 86, y: 118, l: 200, o: 0.10 },
  { x: 109, y: 137, l: 240, o: 0.13 },
  { x: 132, y: 156, l: 280, o: 0.16 },
  { x: 155, y: 175, l: 320, o: 0.19 },
  { x: 178, y: 194, l: 360, o: 0.22 },
  { x: 201, y: 213, l: 400, o: 0.25 },
  { x: 224, y: 232, l: 440, o: 0.04 },
  { x: 247, y: 251, l: 120, o: 0.07 },
  { x: 270, y: 270, l: 160, o: 0.10 },
  { x: 293, y: 289, l: 200, o: 0.13 },
  { x: 316, y: 308, l: 240, o: 0.16 },
  { x: 339, y: 327, l: 280, o: 0.19 },
  { x: 362, y: 346, l: 320, o: 0.22 },
  { x: 385, y: 365, l: 360, o: 0.25 },
  { x: 408, y: 384, l: 400, o: 0.04 },
  { x: 431, y: 403, l: 440, o: 0.07 },
  { x: 454, y: 422, l: 120, o: 0.10 },
  { x: 477, y: 441, l: 160, o: 0.13 },
  { x: 500, y: 460, l: 200, o: 0.16 },
  { x: 523, y: 479, l: 240, o: 0.19 },
  { x: 546, y: 498, l: 280, o: 0.22 },
  { x: 569, y: 517, l: 320, o: 0.25 },
  { x: 592, y: 536, l: 360, o: 0.04 },
  { x: 615, y: 555, l: 400, o: 0.07 },
  { x: 638, y: 574, l: 440, o: 0.10 },
  { x: 661, y: 593, l: 120, o: 0.13 },
  { x: 684, y: 612, l: 160, o: 0.16 },
  { x: 707, y: 631, l: 200, o: 0.19 },
  { x: 730, y: 650, l: 240, o: 0.22 },
  { x: 753, y: 669, l: 280, o: 0.25 },
  { x: 776, y: 688, l: 320, o: 0.04 },
  { x: 799, y: 707, l: 360, o: 0.07 },
  { x: 822, y: 726, l: 400, o: 0.10 },
  { x: 845, y: 745, l: 440, o: 0.13 },
  { x: 868, y: 764, l: 120, o: 0.16 },
  { x: 891, y: 783, l: 160, o: 0.19 },
  { x: 914, y: 802, l: 200, o: 0.22 },
  { x: 937, y: 821, l: 240, o: 0.25 },
  { x: 960, y: 840, l: 280, o: 0.04 },
  { x: 983, y: 859, l: 320, o: 0.07 },
  { x: 1006, y: 878, l: 360, o: 0.10 },
  { x: 1029, y: 897, l: 400, o: 0.13 },
  { x: 1052, y: 916, l: 440, o: 0.16 },
  { x: 1075, y: 935, l: 120, o: 0.19 },
  { x: 1098, y: 954, l: 160, o: 0.22 },
  { x: 1121, y: 973, l: 200, o: 0.25 },
  { x: 1144, y: 992, l: 240, o: 0.04 },
  { x: 1167, y: 91, l: 280, o: 0.07 },
  { x: 1190, y: 110, l: 320, o: 0.10 },
  { x: 1213, y: 129, l: 360, o: 0.13 },
  { x: 1236, y: 148, l: 400, o: 0.16 },
  { x: 1259, y: 167, l: 440, o: 0.19 },
  { x: 1282, y: 186, l: 120, o: 0.22 },
  { x: 1305, y: 205, l: 160, o: 0.25 },
  { x: 1328, y: 224, l: 200, o: 0.04 },
  { x: 1351, y: 243, l: 240, o: 0.07 },
  { x: 1374, y: 262, l: 280, o: 0.10 },
  { x: 1397, y: 281, l: 320, o: 0.13 },
  { x: 1420, y: 300, l: 360, o: 0.16 },
  { x: 1443, y: 319, l: 400, o: 0.19 },
  { x: 1466, y: 338, l: 440, o: 0.22 },
  { x: 1489, y: 357, l: 120, o: 0.25 },
  { x: 1512, y: 376, l: 160, o: 0.04 },
  { x: 1535, y: 395, l: 200, o: 0.07 },
  { x: 1558, y: 414, l: 240, o: 0.10 },
  { x: 1581, y: 433, l: 280, o: 0.13 },
  { x: 1604, y: 452, l: 320, o: 0.16 },
  { x: 1627, y: 471, l: 360, o: 0.19 },
  { x: 1650, y: 490, l: 400, o: 0.22 },
  { x: 1673, y: 509, l: 440, o: 0.25 },
  { x: 1696, y: 528, l: 120, o: 0.04 },
  { x: 1719, y: 547, l: 160, o: 0.07 },
  { x: 1742, y: 566, l: 200, o: 0.10 },
  { x: 1765, y: 585, l: 240, o: 0.13 },
  { x: 1788, y: 604, l: 280, o: 0.16 },
  { x: 1811, y: 623, l: 320, o: 0.19 },
  { x: 1834, y: 642, l: 360, o: 0.22 },
  { x: 1857, y: 661, l: 400, o: 0.25 },
  { x: 40, y: 680, l: 440, o: 0.04 },
  { x: 63, y: 699, l: 120, o: 0.07 },
  { x: 86, y: 718, l: 160, o: 0.10 },
  { x: 109, y: 737, l: 200, o: 0.13 },
  { x: 132, y: 756, l: 240, o: 0.16 },
  { x: 155, y: 775, l: 280, o: 0.19 },
  { x: 178, y: 794, l: 320, o: 0.22 },
  { x: 201, y: 813, l: 360, o: 0.25 },
  { x: 224, y: 832, l: 400, o: 0.04 },
  { x: 247, y: 851, l: 440, o: 0.07 },
  { x: 270, y: 870, l: 120, o: 0.10 },
  { x: 293, y: 889, l: 160, o: 0.13 },
  { x: 316, y: 908, l: 200, o: 0.16 },
  { x: 339, y: 927, l: 240, o: 0.19 },
  { x: 362, y: 946, l: 280, o: 0.22 },
  { x: 385, y: 965, l: 320, o: 0.25 },
  { x: 408, y: 984, l: 360, o: 0.04 },
  { x: 431, y: 83, l: 400, o: 0.07 },
  { x: 454, y: 102, l: 440, o: 0.10 },
  { x: 477, y: 121, l: 120, o: 0.13 },
  { x: 500, y: 140, l: 160, o: 0.16 },
  { x: 523, y: 159, l: 200, o: 0.19 },
  { x: 546, y: 178, l: 240, o: 0.22 },
  { x: 569, y: 197, l: 280, o: 0.25 },
  { x: 592, y: 216, l: 320, o: 0.04 },
  { x: 615, y: 235, l: 360, o: 0.07 },
  { x: 638, y: 254, l: 400, o: 0.10 },
  { x: 661, y: 273, l: 440, o: 0.13 },
  { x: 684, y: 292, l: 120, o: 0.16 },
  { x: 707, y: 311, l: 160, o: 0.19 },
  { x: 730, y: 330, l: 200, o: 0.22 },
  { x: 753, y: 349, l: 240, o: 0.25 },
  { x: 776, y: 368, l: 280, o: 0.04 },
  { x: 799, y: 387, l: 320, o: 0.07 },
  { x: 822, y: 406, l: 360, o: 0.10 },
  { x: 845, y: 425, l: 400, o: 0.13 },
  { x: 868, y: 444, l: 440, o: 0.16 },
  { x: 891, y: 463, l: 120, o: 0.19 },
  { x: 914, y: 482, l: 160, o: 0.22 },
  { x: 937, y: 501, l: 200, o: 0.25 },
  { x: 960, y: 520, l: 240, o: 0.04 },
  { x: 983, y: 539, l: 280, o: 0.07 },
  { x: 1006, y: 558, l: 320, o: 0.10 },
  { x: 1029, y: 577, l: 360, o: 0.13 },
  { x: 1052, y: 596, l: 400, o: 0.16 },
  { x: 1075, y: 615, l: 440, o: 0.19 },
  { x: 1098, y: 634, l: 120, o: 0.22 },
  { x: 1121, y: 653, l: 160, o: 0.25 },
  { x: 1144, y: 672, l: 200, o: 0.04 },
  { x: 1167, y: 691, l: 240, o: 0.07 },
  { x: 1190, y: 710, l: 280, o: 0.10 },
  { x: 1213, y: 729, l: 320, o: 0.13 },
  { x: 1236, y: 748, l: 360, o: 0.16 },
  { x: 1259, y: 767, l: 400, o: 0.19 },
  { x: 1282, y: 786, l: 440, o: 0.22 },
  { x: 1305, y: 805, l: 120, o: 0.25 },
  { x: 1328, y: 824, l: 160, o: 0.04 },
  { x: 1351, y: 843, l: 200, o: 0.07 },
  { x: 1374, y: 862, l: 240, o: 0.10 },
  { x: 1397, y: 881, l: 280, o: 0.13 },
  { x: 1420, y: 900, l: 320, o: 0.16 },
  { x: 1443, y: 919, l: 360, o: 0.19 },
  { x: 1466, y: 938, l: 400, o: 0.22 },
  { x: 1489, y: 957, l: 440, o: 0.25 },
  { x: 1512, y: 976, l: 120, o: 0.04 },
  { x: 1535, y: 995, l: 160, o: 0.07 },
  { x: 1558, y: 94, l: 200, o: 0.10 },
  { x: 1581, y: 113, l: 240, o: 0.13 },
  { x: 1604, y: 132, l: 280, o: 0.16 },
  { x: 1627, y: 151, l: 320, o: 0.19 },
  { x: 1650, y: 170, l: 360, o: 0.22 },
  { x: 1673, y: 189, l: 400, o: 0.25 },
  { x: 1696, y: 208, l: 440, o: 0.04 },
  { x: 1719, y: 227, l: 120, o: 0.07 },
  { x: 1742, y: 246, l: 160, o: 0.10 },
  { x: 1765, y: 265, l: 200, o: 0.13 },
  { x: 1788, y: 284, l: 240, o: 0.16 },
  { x: 1811, y: 303, l: 280, o: 0.19 },
  { x: 1834, y: 322, l: 320, o: 0.22 },
  { x: 1857, y: 341, l: 360, o: 0.25 },
  { x: 40, y: 360, l: 400, o: 0.04 },
  { x: 63, y: 379, l: 440, o: 0.07 },
  { x: 86, y: 398, l: 120, o: 0.10 },
  { x: 109, y: 417, l: 160, o: 0.13 },
  { x: 132, y: 436, l: 200, o: 0.16 },
  { x: 155, y: 455, l: 240, o: 0.19 },
  { x: 178, y: 474, l: 280, o: 0.22 },
  { x: 201, y: 493, l: 320, o: 0.25 },
  { x: 224, y: 512, l: 360, o: 0.04 },
  { x: 247, y: 531, l: 400, o: 0.07 },
  { x: 270, y: 550, l: 440, o: 0.10 },
  { x: 293, y: 569, l: 120, o: 0.13 },
  { x: 316, y: 588, l: 160, o: 0.16 },
  { x: 339, y: 607, l: 200, o: 0.19 },
  { x: 362, y: 626, l: 240, o: 0.22 },
  { x: 385, y: 645, l: 280, o: 0.25 },
  { x: 408, y: 664, l: 320, o: 0.04 },
  { x: 431, y: 683, l: 360, o: 0.07 },
  { x: 454, y: 702, l: 400, o: 0.10 },
  { x: 477, y: 721, l: 440, o: 0.13 },
  { x: 500, y: 740, l: 120, o: 0.16 },
  { x: 523, y: 759, l: 160, o: 0.19 },
  { x: 546, y: 778, l: 200, o: 0.22 },
  { x: 569, y: 797, l: 240, o: 0.25 },
  { x: 592, y: 816, l: 280, o: 0.04 },
  { x: 615, y: 835, l: 320, o: 0.07 },
  { x: 638, y: 854, l: 360, o: 0.10 },
  { x: 661, y: 873, l: 400, o: 0.13 },
  { x: 684, y: 892, l: 440, o: 0.16 },
  { x: 707, y: 911, l: 120, o: 0.19 },
  { x: 730, y: 930, l: 160, o: 0.22 },
  { x: 753, y: 949, l: 200, o: 0.25 },
  { x: 776, y: 968, l: 240, o: 0.04 },
  { x: 799, y: 987, l: 280, o: 0.07 },
  { x: 822, y: 86, l: 320, o: 0.10 },
  { x: 845, y: 105, l: 360, o: 0.13 },
  { x: 868, y: 124, l: 400, o: 0.16 },
  { x: 891, y: 143, l: 440, o: 0.19 },
  { x: 914, y: 162, l: 120, o: 0.22 },
  { x: 937, y: 181, l: 160, o: 0.25 },
  { x: 960, y: 200, l: 200, o: 0.04 },
  { x: 983, y: 219, l: 240, o: 0.07 },
  { x: 1006, y: 238, l: 280, o: 0.10 },
  { x: 1029, y: 257, l: 320, o: 0.13 },
  { x: 1052, y: 276, l: 360, o: 0.16 },
  { x: 1075, y: 295, l: 400, o: 0.19 },
  { x: 1098, y: 314, l: 440, o: 0.22 },
  { x: 1121, y: 333, l: 120, o: 0.25 },
  { x: 1144, y: 352, l: 160, o: 0.04 },
  { x: 1167, y: 371, l: 200, o: 0.07 },
  { x: 1190, y: 390, l: 240, o: 0.10 },
  { x: 1213, y: 409, l: 280, o: 0.13 },
  { x: 1236, y: 428, l: 320, o: 0.16 },
  { x: 1259, y: 447, l: 360, o: 0.19 },
  { x: 1282, y: 466, l: 400, o: 0.22 },
  { x: 1305, y: 485, l: 440, o: 0.25 },
  { x: 1328, y: 504, l: 120, o: 0.04 },
  { x: 1351, y: 523, l: 160, o: 0.07 },
  { x: 1374, y: 542, l: 200, o: 0.10 },
  { x: 1397, y: 561, l: 240, o: 0.13 },
  { x: 1420, y: 580, l: 280, o: 0.16 },
  { x: 1443, y: 599, l: 320, o: 0.19 },
  { x: 1466, y: 618, l: 360, o: 0.22 },
  { x: 1489, y: 637, l: 400, o: 0.25 },
  { x: 1512, y: 656, l: 440, o: 0.04 },
  { x: 1535, y: 675, l: 120, o: 0.07 },
  { x: 1558, y: 694, l: 160, o: 0.10 },
  { x: 1581, y: 713, l: 200, o: 0.13 },
  { x: 1604, y: 732, l: 240, o: 0.16 },
  { x: 1627, y: 751, l: 280, o: 0.19 },
  { x: 1650, y: 770, l: 320, o: 0.22 },
  { x: 1673, y: 789, l: 360, o: 0.25 },
  { x: 1696, y: 808, l: 400, o: 0.04 },
  { x: 1719, y: 827, l: 440, o: 0.07 },
  { x: 1742, y: 846, l: 120, o: 0.10 },
  { x: 1765, y: 865, l: 160, o: 0.13 },
  { x: 1788, y: 884, l: 200, o: 0.16 },
  { x: 1811, y: 903, l: 240, o: 0.19 },
  { x: 1834, y: 922, l: 280, o: 0.22 },
  { x: 1857, y: 941, l: 320, o: 0.25 },
  { x: 40, y: 960, l: 360, o: 0.04 },
  { x: 63, y: 979, l: 400, o: 0.07 },
  { x: 86, y: 998, l: 440, o: 0.10 },
  { x: 109, y: 97, l: 120, o: 0.13 },
  { x: 132, y: 116, l: 160, o: 0.16 },
  { x: 155, y: 135, l: 200, o: 0.19 },
  { x: 178, y: 154, l: 240, o: 0.22 },
  { x: 201, y: 173, l: 280, o: 0.25 },
  { x: 224, y: 192, l: 320, o: 0.04 },
  { x: 247, y: 211, l: 360, o: 0.07 },
  { x: 270, y: 230, l: 400, o: 0.10 },
  { x: 293, y: 249, l: 440, o: 0.13 },
  { x: 316, y: 268, l: 120, o: 0.16 },
  { x: 339, y: 287, l: 160, o: 0.19 },
  { x: 362, y: 306, l: 200, o: 0.22 },
  { x: 385, y: 325, l: 240, o: 0.25 },
  { x: 408, y: 344, l: 280, o: 0.04 },
  { x: 431, y: 363, l: 320, o: 0.07 },
  { x: 454, y: 382, l: 360, o: 0.10 },
  { x: 477, y: 401, l: 400, o: 0.13 },
  { x: 500, y: 420, l: 440, o: 0.16 },
  { x: 523, y: 439, l: 120, o: 0.19 },
  { x: 546, y: 458, l: 160, o: 0.22 },
  { x: 569, y: 477, l: 200, o: 0.25 },
  { x: 592, y: 496, l: 240, o: 0.04 },
  { x: 615, y: 515, l: 280, o: 0.07 },
  { x: 638, y: 534, l: 320, o: 0.10 },
  { x: 661, y: 553, l: 360, o: 0.13 },
  { x: 684, y: 572, l: 400, o: 0.16 },
  { x: 707, y: 591, l: 440, o: 0.19 },
  { x: 730, y: 610, l: 120, o: 0.22 },
  { x: 753, y: 629, l: 160, o: 0.25 },
  { x: 776, y: 648, l: 200, o: 0.04 },
  { x: 799, y: 667, l: 240, o: 0.07 },
  { x: 822, y: 686, l: 280, o: 0.10 },
  { x: 845, y: 705, l: 320, o: 0.13 },
  { x: 868, y: 724, l: 360, o: 0.16 },
  { x: 891, y: 743, l: 400, o: 0.19 },
  { x: 914, y: 762, l: 440, o: 0.22 },
  { x: 937, y: 781, l: 120, o: 0.25 },
] as const;

const FLOOR_CRACKS = [
  { x1: 80, y1: 780, x2: 110, y2: 772, o: 0.10 },
  { x1: 93, y1: 798, x2: 139, y2: 794, o: 0.15 },
  { x1: 106, y1: 816, x2: 168, y2: 816, o: 0.20 },
  { x1: 119, y1: 834, x2: 197, y2: 838, o: 0.25 },
  { x1: 132, y1: 852, x2: 226, y2: 860, o: 0.30 },
  { x1: 145, y1: 870, x2: 255, y2: 862, o: 0.35 },
  { x1: 158, y1: 888, x2: 284, y2: 884, o: 0.40 },
  { x1: 171, y1: 906, x2: 201, y2: 906, o: 0.10 },
  { x1: 184, y1: 780, x2: 230, y2: 784, o: 0.15 },
  { x1: 197, y1: 798, x2: 259, y2: 806, o: 0.20 },
  { x1: 210, y1: 816, x2: 288, y2: 808, o: 0.25 },
  { x1: 223, y1: 834, x2: 317, y2: 830, o: 0.30 },
  { x1: 236, y1: 852, x2: 346, y2: 852, o: 0.35 },
  { x1: 249, y1: 870, x2: 375, y2: 874, o: 0.40 },
  { x1: 262, y1: 888, x2: 292, y2: 896, o: 0.10 },
  { x1: 275, y1: 906, x2: 321, y2: 898, o: 0.15 },
  { x1: 288, y1: 780, x2: 350, y2: 776, o: 0.20 },
  { x1: 301, y1: 798, x2: 379, y2: 798, o: 0.25 },
  { x1: 314, y1: 816, x2: 408, y2: 820, o: 0.30 },
  { x1: 327, y1: 834, x2: 437, y2: 842, o: 0.35 },
  { x1: 340, y1: 852, x2: 466, y2: 844, o: 0.40 },
  { x1: 353, y1: 870, x2: 383, y2: 866, o: 0.10 },
  { x1: 366, y1: 888, x2: 412, y2: 888, o: 0.15 },
  { x1: 379, y1: 906, x2: 441, y2: 910, o: 0.20 },
  { x1: 392, y1: 780, x2: 470, y2: 788, o: 0.25 },
  { x1: 405, y1: 798, x2: 499, y2: 790, o: 0.30 },
  { x1: 418, y1: 816, x2: 528, y2: 812, o: 0.35 },
  { x1: 431, y1: 834, x2: 557, y2: 834, o: 0.40 },
  { x1: 444, y1: 852, x2: 474, y2: 856, o: 0.10 },
  { x1: 457, y1: 870, x2: 503, y2: 878, o: 0.15 },
  { x1: 470, y1: 888, x2: 532, y2: 880, o: 0.20 },
  { x1: 483, y1: 906, x2: 561, y2: 902, o: 0.25 },
  { x1: 496, y1: 780, x2: 590, y2: 780, o: 0.30 },
  { x1: 509, y1: 798, x2: 619, y2: 802, o: 0.35 },
  { x1: 522, y1: 816, x2: 648, y2: 824, o: 0.40 },
  { x1: 535, y1: 834, x2: 565, y2: 826, o: 0.10 },
  { x1: 548, y1: 852, x2: 594, y2: 848, o: 0.15 },
  { x1: 561, y1: 870, x2: 623, y2: 870, o: 0.20 },
  { x1: 574, y1: 888, x2: 652, y2: 892, o: 0.25 },
  { x1: 587, y1: 906, x2: 681, y2: 914, o: 0.30 },
  { x1: 600, y1: 780, x2: 710, y2: 772, o: 0.35 },
  { x1: 613, y1: 798, x2: 739, y2: 794, o: 0.40 },
  { x1: 626, y1: 816, x2: 656, y2: 816, o: 0.10 },
  { x1: 639, y1: 834, x2: 685, y2: 838, o: 0.15 },
  { x1: 652, y1: 852, x2: 714, y2: 860, o: 0.20 },
  { x1: 665, y1: 870, x2: 743, y2: 862, o: 0.25 },
  { x1: 678, y1: 888, x2: 772, y2: 884, o: 0.30 },
  { x1: 691, y1: 906, x2: 801, y2: 906, o: 0.35 },
  { x1: 704, y1: 780, x2: 830, y2: 784, o: 0.40 },
  { x1: 717, y1: 798, x2: 747, y2: 806, o: 0.10 },
  { x1: 730, y1: 816, x2: 776, y2: 808, o: 0.15 },
  { x1: 743, y1: 834, x2: 805, y2: 830, o: 0.20 },
  { x1: 756, y1: 852, x2: 834, y2: 852, o: 0.25 },
  { x1: 769, y1: 870, x2: 863, y2: 874, o: 0.30 },
  { x1: 782, y1: 888, x2: 892, y2: 896, o: 0.35 },
  { x1: 795, y1: 906, x2: 921, y2: 898, o: 0.40 },
  { x1: 808, y1: 780, x2: 838, y2: 776, o: 0.10 },
  { x1: 821, y1: 798, x2: 867, y2: 798, o: 0.15 },
  { x1: 834, y1: 816, x2: 896, y2: 820, o: 0.20 },
  { x1: 847, y1: 834, x2: 925, y2: 842, o: 0.25 },
  { x1: 860, y1: 852, x2: 954, y2: 844, o: 0.30 },
  { x1: 873, y1: 870, x2: 983, y2: 866, o: 0.35 },
  { x1: 886, y1: 888, x2: 1012, y2: 888, o: 0.40 },
  { x1: 899, y1: 906, x2: 929, y2: 910, o: 0.10 },
  { x1: 912, y1: 780, x2: 958, y2: 788, o: 0.15 },
  { x1: 925, y1: 798, x2: 987, y2: 790, o: 0.20 },
  { x1: 938, y1: 816, x2: 1016, y2: 812, o: 0.25 },
  { x1: 951, y1: 834, x2: 1045, y2: 834, o: 0.30 },
  { x1: 964, y1: 852, x2: 1074, y2: 856, o: 0.35 },
  { x1: 977, y1: 870, x2: 1103, y2: 878, o: 0.40 },
  { x1: 990, y1: 888, x2: 1020, y2: 880, o: 0.10 },
  { x1: 1003, y1: 906, x2: 1049, y2: 902, o: 0.15 },
  { x1: 1016, y1: 780, x2: 1078, y2: 780, o: 0.20 },
  { x1: 1029, y1: 798, x2: 1107, y2: 802, o: 0.25 },
  { x1: 1042, y1: 816, x2: 1136, y2: 824, o: 0.30 },
  { x1: 1055, y1: 834, x2: 1165, y2: 826, o: 0.35 },
  { x1: 1068, y1: 852, x2: 1194, y2: 848, o: 0.40 },
  { x1: 1081, y1: 870, x2: 1111, y2: 870, o: 0.10 },
  { x1: 1094, y1: 888, x2: 1140, y2: 892, o: 0.15 },
  { x1: 1107, y1: 906, x2: 1169, y2: 914, o: 0.20 },
  { x1: 1120, y1: 780, x2: 1198, y2: 772, o: 0.25 },
  { x1: 1133, y1: 798, x2: 1227, y2: 794, o: 0.30 },
  { x1: 1146, y1: 816, x2: 1256, y2: 816, o: 0.35 },
  { x1: 1159, y1: 834, x2: 1285, y2: 838, o: 0.40 },
  { x1: 1172, y1: 852, x2: 1202, y2: 860, o: 0.10 },
  { x1: 1185, y1: 870, x2: 1231, y2: 862, o: 0.15 },
  { x1: 1198, y1: 888, x2: 1260, y2: 884, o: 0.20 },
  { x1: 1211, y1: 906, x2: 1289, y2: 906, o: 0.25 },
  { x1: 1224, y1: 780, x2: 1318, y2: 784, o: 0.30 },
  { x1: 1237, y1: 798, x2: 1347, y2: 806, o: 0.35 },
  { x1: 1250, y1: 816, x2: 1376, y2: 808, o: 0.40 },
  { x1: 1263, y1: 834, x2: 1293, y2: 830, o: 0.10 },
  { x1: 1276, y1: 852, x2: 1322, y2: 852, o: 0.15 },
  { x1: 1289, y1: 870, x2: 1351, y2: 874, o: 0.20 },
  { x1: 1302, y1: 888, x2: 1380, y2: 896, o: 0.25 },
  { x1: 1315, y1: 906, x2: 1409, y2: 898, o: 0.30 },
  { x1: 1328, y1: 780, x2: 1438, y2: 776, o: 0.35 },
  { x1: 1341, y1: 798, x2: 1467, y2: 798, o: 0.40 },
  { x1: 1354, y1: 816, x2: 1384, y2: 820, o: 0.10 },
  { x1: 1367, y1: 834, x2: 1413, y2: 842, o: 0.15 },
  { x1: 1380, y1: 852, x2: 1442, y2: 844, o: 0.20 },
  { x1: 1393, y1: 870, x2: 1471, y2: 866, o: 0.25 },
  { x1: 1406, y1: 888, x2: 1500, y2: 888, o: 0.30 },
  { x1: 1419, y1: 906, x2: 1529, y2: 910, o: 0.35 },
  { x1: 1432, y1: 780, x2: 1558, y2: 788, o: 0.40 },
  { x1: 1445, y1: 798, x2: 1475, y2: 790, o: 0.10 },
  { x1: 1458, y1: 816, x2: 1504, y2: 812, o: 0.15 },
  { x1: 1471, y1: 834, x2: 1533, y2: 834, o: 0.20 },
  { x1: 1484, y1: 852, x2: 1562, y2: 856, o: 0.25 },
  { x1: 1497, y1: 870, x2: 1591, y2: 878, o: 0.30 },
  { x1: 1510, y1: 888, x2: 1620, y2: 880, o: 0.35 },
  { x1: 1523, y1: 906, x2: 1649, y2: 902, o: 0.40 },
  { x1: 1536, y1: 780, x2: 1566, y2: 780, o: 0.10 },
  { x1: 1549, y1: 798, x2: 1595, y2: 802, o: 0.15 },
  { x1: 1562, y1: 816, x2: 1624, y2: 824, o: 0.20 },
  { x1: 1575, y1: 834, x2: 1653, y2: 826, o: 0.25 },
  { x1: 1588, y1: 852, x2: 1682, y2: 848, o: 0.30 },
  { x1: 1601, y1: 870, x2: 1711, y2: 870, o: 0.35 },
  { x1: 1614, y1: 888, x2: 1740, y2: 892, o: 0.40 },
  { x1: 1627, y1: 906, x2: 1657, y2: 914, o: 0.10 },
  { x1: 1640, y1: 780, x2: 1686, y2: 772, o: 0.15 },
  { x1: 1653, y1: 798, x2: 1715, y2: 794, o: 0.20 },
  { x1: 1666, y1: 816, x2: 1744, y2: 816, o: 0.25 },
  { x1: 1679, y1: 834, x2: 1773, y2: 838, o: 0.30 },
  { x1: 1692, y1: 852, x2: 1802, y2: 860, o: 0.35 },
  { x1: 1705, y1: 870, x2: 1831, y2: 862, o: 0.40 },
  { x1: 1718, y1: 888, x2: 1748, y2: 884, o: 0.10 },
  { x1: 1731, y1: 906, x2: 1777, y2: 906, o: 0.15 },
  { x1: 1744, y1: 780, x2: 1806, y2: 784, o: 0.20 },
  { x1: 1757, y1: 798, x2: 1835, y2: 806, o: 0.25 },
  { x1: 1770, y1: 816, x2: 1864, y2: 808, o: 0.30 },
  { x1: 1783, y1: 834, x2: 1893, y2: 830, o: 0.35 },
  { x1: 1796, y1: 852, x2: 1922, y2: 852, o: 0.40 },
  { x1: 1809, y1: 870, x2: 1839, y2: 874, o: 0.10 },
  { x1: 1822, y1: 888, x2: 1868, y2: 896, o: 0.15 },
  { x1: 1835, y1: 906, x2: 1897, y2: 898, o: 0.20 },
  { x1: 88, y1: 780, x2: 166, y2: 776, o: 0.25 },
  { x1: 101, y1: 798, x2: 195, y2: 798, o: 0.30 },
  { x1: 114, y1: 816, x2: 224, y2: 820, o: 0.35 },
  { x1: 127, y1: 834, x2: 253, y2: 842, o: 0.40 },
  { x1: 140, y1: 852, x2: 170, y2: 844, o: 0.10 },
  { x1: 153, y1: 870, x2: 199, y2: 866, o: 0.15 },
  { x1: 166, y1: 888, x2: 228, y2: 888, o: 0.20 },
  { x1: 179, y1: 906, x2: 257, y2: 910, o: 0.25 },
  { x1: 192, y1: 780, x2: 286, y2: 788, o: 0.30 },
  { x1: 205, y1: 798, x2: 315, y2: 790, o: 0.35 },
  { x1: 218, y1: 816, x2: 344, y2: 812, o: 0.40 },
  { x1: 231, y1: 834, x2: 261, y2: 834, o: 0.10 },
  { x1: 244, y1: 852, x2: 290, y2: 856, o: 0.15 },
  { x1: 257, y1: 870, x2: 319, y2: 878, o: 0.20 },
  { x1: 270, y1: 888, x2: 348, y2: 880, o: 0.25 },
  { x1: 283, y1: 906, x2: 377, y2: 902, o: 0.30 },
  { x1: 296, y1: 780, x2: 406, y2: 780, o: 0.35 },
  { x1: 309, y1: 798, x2: 435, y2: 802, o: 0.40 },
  { x1: 322, y1: 816, x2: 352, y2: 824, o: 0.10 },
  { x1: 335, y1: 834, x2: 381, y2: 826, o: 0.15 },
  { x1: 348, y1: 852, x2: 410, y2: 848, o: 0.20 },
  { x1: 361, y1: 870, x2: 439, y2: 870, o: 0.25 },
  { x1: 374, y1: 888, x2: 468, y2: 892, o: 0.30 },
  { x1: 387, y1: 906, x2: 497, y2: 914, o: 0.35 },
  { x1: 400, y1: 780, x2: 526, y2: 772, o: 0.40 },
  { x1: 413, y1: 798, x2: 443, y2: 794, o: 0.10 },
  { x1: 426, y1: 816, x2: 472, y2: 816, o: 0.15 },
  { x1: 439, y1: 834, x2: 501, y2: 838, o: 0.20 },
  { x1: 452, y1: 852, x2: 530, y2: 860, o: 0.25 },
  { x1: 465, y1: 870, x2: 559, y2: 862, o: 0.30 },
  { x1: 478, y1: 888, x2: 588, y2: 884, o: 0.35 },
  { x1: 491, y1: 906, x2: 617, y2: 906, o: 0.40 },
  { x1: 504, y1: 780, x2: 534, y2: 784, o: 0.10 },
  { x1: 517, y1: 798, x2: 563, y2: 806, o: 0.15 },
  { x1: 530, y1: 816, x2: 592, y2: 808, o: 0.20 },
  { x1: 543, y1: 834, x2: 621, y2: 830, o: 0.25 },
  { x1: 556, y1: 852, x2: 650, y2: 852, o: 0.30 },
  { x1: 569, y1: 870, x2: 679, y2: 874, o: 0.35 },
  { x1: 582, y1: 888, x2: 708, y2: 896, o: 0.40 },
  { x1: 595, y1: 906, x2: 625, y2: 898, o: 0.10 },
  { x1: 608, y1: 780, x2: 654, y2: 776, o: 0.15 },
  { x1: 621, y1: 798, x2: 683, y2: 798, o: 0.20 },
  { x1: 634, y1: 816, x2: 712, y2: 820, o: 0.25 },
  { x1: 647, y1: 834, x2: 741, y2: 842, o: 0.30 },
  { x1: 660, y1: 852, x2: 770, y2: 844, o: 0.35 },
  { x1: 673, y1: 870, x2: 799, y2: 866, o: 0.40 },
  { x1: 686, y1: 888, x2: 716, y2: 888, o: 0.10 },
  { x1: 699, y1: 906, x2: 745, y2: 910, o: 0.15 },
  { x1: 712, y1: 780, x2: 774, y2: 788, o: 0.20 },
  { x1: 725, y1: 798, x2: 803, y2: 790, o: 0.25 },
  { x1: 738, y1: 816, x2: 832, y2: 812, o: 0.30 },
  { x1: 751, y1: 834, x2: 861, y2: 834, o: 0.35 },
  { x1: 764, y1: 852, x2: 890, y2: 856, o: 0.40 },
  { x1: 777, y1: 870, x2: 807, y2: 878, o: 0.10 },
  { x1: 790, y1: 888, x2: 836, y2: 880, o: 0.15 },
  { x1: 803, y1: 906, x2: 865, y2: 902, o: 0.20 },
  { x1: 816, y1: 780, x2: 894, y2: 780, o: 0.25 },
  { x1: 829, y1: 798, x2: 923, y2: 802, o: 0.30 },
  { x1: 842, y1: 816, x2: 952, y2: 824, o: 0.35 },
  { x1: 855, y1: 834, x2: 981, y2: 826, o: 0.40 },
  { x1: 868, y1: 852, x2: 898, y2: 848, o: 0.10 },
  { x1: 881, y1: 870, x2: 927, y2: 870, o: 0.15 },
  { x1: 894, y1: 888, x2: 956, y2: 892, o: 0.20 },
  { x1: 907, y1: 906, x2: 985, y2: 914, o: 0.25 },
  { x1: 920, y1: 780, x2: 1014, y2: 772, o: 0.30 },
  { x1: 933, y1: 798, x2: 1043, y2: 794, o: 0.35 },
  { x1: 946, y1: 816, x2: 1072, y2: 816, o: 0.40 },
  { x1: 959, y1: 834, x2: 989, y2: 838, o: 0.10 },
  { x1: 972, y1: 852, x2: 1018, y2: 860, o: 0.15 },
  { x1: 985, y1: 870, x2: 1047, y2: 862, o: 0.20 },
  { x1: 998, y1: 888, x2: 1076, y2: 884, o: 0.25 },
  { x1: 1011, y1: 906, x2: 1105, y2: 906, o: 0.30 },
  { x1: 1024, y1: 780, x2: 1134, y2: 784, o: 0.35 },
  { x1: 1037, y1: 798, x2: 1163, y2: 806, o: 0.40 },
  { x1: 1050, y1: 816, x2: 1080, y2: 808, o: 0.10 },
  { x1: 1063, y1: 834, x2: 1109, y2: 830, o: 0.15 },
  { x1: 1076, y1: 852, x2: 1138, y2: 852, o: 0.20 },
  { x1: 1089, y1: 870, x2: 1167, y2: 874, o: 0.25 },
  { x1: 1102, y1: 888, x2: 1196, y2: 896, o: 0.30 },
  { x1: 1115, y1: 906, x2: 1225, y2: 898, o: 0.35 },
  { x1: 1128, y1: 780, x2: 1254, y2: 776, o: 0.40 },
  { x1: 1141, y1: 798, x2: 1171, y2: 798, o: 0.10 },
  { x1: 1154, y1: 816, x2: 1200, y2: 820, o: 0.15 },
  { x1: 1167, y1: 834, x2: 1229, y2: 842, o: 0.20 },
  { x1: 1180, y1: 852, x2: 1258, y2: 844, o: 0.25 },
  { x1: 1193, y1: 870, x2: 1287, y2: 866, o: 0.30 },
  { x1: 1206, y1: 888, x2: 1316, y2: 888, o: 0.35 },
  { x1: 1219, y1: 906, x2: 1345, y2: 910, o: 0.40 },
  { x1: 1232, y1: 780, x2: 1262, y2: 788, o: 0.10 },
  { x1: 1245, y1: 798, x2: 1291, y2: 790, o: 0.15 },
  { x1: 1258, y1: 816, x2: 1320, y2: 812, o: 0.20 },
  { x1: 1271, y1: 834, x2: 1349, y2: 834, o: 0.25 },
  { x1: 1284, y1: 852, x2: 1378, y2: 856, o: 0.30 },
  { x1: 1297, y1: 870, x2: 1407, y2: 878, o: 0.35 },
  { x1: 1310, y1: 888, x2: 1436, y2: 880, o: 0.40 },
  { x1: 1323, y1: 906, x2: 1353, y2: 902, o: 0.10 },
  { x1: 1336, y1: 780, x2: 1382, y2: 780, o: 0.15 },
  { x1: 1349, y1: 798, x2: 1411, y2: 802, o: 0.20 },
  { x1: 1362, y1: 816, x2: 1440, y2: 824, o: 0.25 },
  { x1: 1375, y1: 834, x2: 1469, y2: 826, o: 0.30 },
  { x1: 1388, y1: 852, x2: 1498, y2: 848, o: 0.35 },
  { x1: 1401, y1: 870, x2: 1527, y2: 870, o: 0.40 },
  { x1: 1414, y1: 888, x2: 1444, y2: 892, o: 0.10 },
  { x1: 1427, y1: 906, x2: 1473, y2: 914, o: 0.15 },
  { x1: 1440, y1: 780, x2: 1502, y2: 772, o: 0.20 },
  { x1: 1453, y1: 798, x2: 1531, y2: 794, o: 0.25 },
  { x1: 1466, y1: 816, x2: 1560, y2: 816, o: 0.30 },
  { x1: 1479, y1: 834, x2: 1589, y2: 838, o: 0.35 },
  { x1: 1492, y1: 852, x2: 1618, y2: 860, o: 0.40 },
  { x1: 1505, y1: 870, x2: 1535, y2: 862, o: 0.10 },
  { x1: 1518, y1: 888, x2: 1564, y2: 884, o: 0.15 },
  { x1: 1531, y1: 906, x2: 1593, y2: 906, o: 0.20 },
  { x1: 1544, y1: 780, x2: 1622, y2: 784, o: 0.25 },
  { x1: 1557, y1: 798, x2: 1651, y2: 806, o: 0.30 },
  { x1: 1570, y1: 816, x2: 1680, y2: 808, o: 0.35 },
  { x1: 1583, y1: 834, x2: 1709, y2: 830, o: 0.40 },
  { x1: 1596, y1: 852, x2: 1626, y2: 852, o: 0.10 },
  { x1: 1609, y1: 870, x2: 1655, y2: 874, o: 0.15 },
  { x1: 1622, y1: 888, x2: 1684, y2: 896, o: 0.20 },
  { x1: 1635, y1: 906, x2: 1713, y2: 898, o: 0.25 },
  { x1: 1648, y1: 780, x2: 1742, y2: 776, o: 0.30 },
  { x1: 1661, y1: 798, x2: 1771, y2: 798, o: 0.35 },
  { x1: 1674, y1: 816, x2: 1800, y2: 820, o: 0.40 },
  { x1: 1687, y1: 834, x2: 1717, y2: 842, o: 0.10 },
] as const;

const createVortexParticles = (): VortexParticle[] => {
  const rand = seededRandom(35000);
  const colors = ['#f5c06a', '#9dcf90', '#b6c4e8', '#d8a7a7', '#d2c18f'];
  const types: VortexType[] = ['coin', 'spear', 'shell', 'gear'];
  return new Array(1300).fill(null).map((_, id) => ({
    id,
    angle: rand() * Math.PI * 2,
    radius: 30 + rand() * 620,
    size: 1 + rand() * 9,
    depth: rand(),
    type: types[Math.floor(rand() * types.length)],
    hue: colors[Math.floor(rand() * colors.length)],
    phase: rand() * Math.PI * 2,
  }));
};

const TinyArtifact: React.FC<{ type: VortexType; size: number; color: string }> = ({ type, size, color }) => {
  if (type === 'coin') {
    return (
      <g>
        <circle cx={0} cy={0} r={size} fill={color} opacity={0.85} />
        <circle cx={0} cy={0} r={size * 0.62} fill="none" stroke="#2a2a2a" strokeWidth={0.4} opacity={0.5} />
      </g>
    );
  }

  if (type === 'spear') {
    return (
      <g>
        <rect x={-size * 0.2} y={-size * 1.3} width={size * 0.4} height={size * 2.4} fill="#8d7a62" opacity={0.8} />
        <path d={`M 0 ${-size * 1.9} L ${size * 0.6} ${-size * 1.2} L ${-size * 0.6} ${-size * 1.2} Z`} fill={color} opacity={0.9} />
      </g>
    );
  }

  if (type === 'shell') {
    return (
      <g>
        <ellipse cx={0} cy={0} rx={size * 0.95} ry={size * 0.72} fill={color} opacity={0.85} />
        <path d={`M ${-size * 0.8} 0 Q 0 ${-size * 0.4} ${size * 0.8} 0`} fill="none" stroke="#3f3f3f" strokeWidth={0.3} opacity={0.5} />
      </g>
    );
  }

  return (
    <g>
      {new Array(8).fill(null).map((_, tooth) => {
        const a = (Math.PI * 2 * tooth) / 8;
        return (
          <rect
            key={tooth}
            x={Math.cos(a) * size * 0.9 - size * 0.18}
            y={Math.sin(a) * size * 0.9 - size * 0.18}
            width={size * 0.36}
            height={size * 0.36}
            fill={color}
            opacity={0.88}
            transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * size * 0.9} ${Math.sin(a) * size * 0.9})`}
          />
        );
      })}
      <circle cx={0} cy={0} r={size * 0.62} fill={color} opacity={0.9} />
      <circle cx={0} cy={0} r={size * 0.28} fill="#2a2a2a" opacity={0.4} />
    </g>
  );
};

const HistoryVortex: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = useMemo(createVortexParticles, []);

  return (
    <g>
      {particles.map((p) => {
        const spin = frame * 0.018 + p.angle;
        const spiralRadius = p.radius * (0.15 + ((frame % 240) / 240) * 0.85);
        const x = 960 + Math.cos(spin + p.phase) * spiralRadius;
        const y = 520 + Math.sin(spin * 1.1 + p.phase) * spiralRadius * 0.64;
        const zScale = 0.45 + p.depth + Math.sin(frame / 40 + p.phase) * 0.08;
        const blurFade = clamp(1.15 - p.radius / 720, 0.2, 1);
        return (
          <g
            key={p.id}
            transform={`translate(${x}, ${y}) rotate(${spin * 57.2958}) scale(${zScale})`}
            opacity={0.2 + blurFade * 0.7}
          >
            <TinyArtifact type={p.type} size={p.size} color={p.hue} />
          </g>
        );
      })}
    </g>
  );
};

const WoodGrainCrumble: React.FC<{ x: number; y: number; width: number; height: number; seed: number }> = ({ x, y, width, height, seed }) => {
  const frame = useCurrentFrame();
  const planks = useMemo(() => {
    const rand = seededRandom(seed);
    return new Array(220).fill(null).map((_, i) => ({
      id: i,
      px: x + rand() * width,
      py: y + rand() * height,
      w: 14 + rand() * 80,
      h: 6 + rand() * 26,
      driftX: (rand() - 0.5) * 140,
      driftY: -(20 + rand() * 100),
      threshold: rand(),
      o: 0.08 + rand() * 0.24,
    }));
  }, [height, seed, width, x, y]);

  const progress = clamp((frame - 780) / 420, 0, 1);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#674331" />
      {planks.map((p) => {
        const crumble = progress > p.threshold ? (progress - p.threshold) / (1 - p.threshold + 0.0001) : 0;
        const dx = p.driftX * crumble;
        const dy = p.driftY * crumble;
        const rot = crumble * 40;
        return (
          <rect
            key={p.id}
            x={p.px + dx}
            y={p.py + dy}
            width={p.w}
            height={p.h}
            fill="#3f281d"
            opacity={p.o * (1 - crumble * 0.75)}
            transform={`rotate(${rot} ${p.px + dx + p.w / 2} ${p.py + dy + p.h / 2})`}
          />
        );
      })}
    </g>
  );
};

const BrickWallCrumble: React.FC<{ x: number; y: number; width: number; height: number }> = ({ x, y, width, height }) => {
  const frame = useCurrentFrame();
  const rows = Math.ceil(height / 26);
  const cols = Math.ceil(width / 62);
  const progress = clamp((frame - 770) / 430, 0, 1);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#5a4437" opacity={0.85} />
      {new Array(rows).fill(null).map((_, row) => (
        <g key={row}>
          {new Array(cols).fill(null).map((__, col) => {
            const offset = row % 2 === 0 ? 0 : 31;
            const bx = x + col * 62 - offset;
            const by = y + row * 26;
            const idx = row * cols + col;
            const local = clamp(progress - idx * 0.0012, 0, 1);
            const dx = Math.sin(idx * 1.7) * 80 * local;
            const dy = -120 * local;
            const o = 0.4 - local * 0.34;
            return (
              <rect
                key={`${row}-${col}`}
                x={bx + dx}
                y={by + dy}
                width={60}
                height={24}
                fill={idx % 3 === 0 ? '#6d5141' : idx % 3 === 1 ? '#7a5b49' : '#624838'}
                stroke="#4b372c"
                strokeWidth={1}
                opacity={o}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
};

const ProceduralGrass: React.FC = () => {
  const frame = useCurrentFrame();
  const blades = useMemo(() => {
    const rand = seededRandom(7711);
    return new Array(420).fill(null).map((_, i) => ({
      id: i,
      x: 40 + (i * 7) % 1860 + rand() * 6,
      h: 20 + rand() * 62,
      bend: (rand() - 0.5) * 18,
      o: 0.25 + rand() * 0.48,
      delay: rand(),
    }));
  }, []);

  const emergence = clamp((frame - 880) / 260, 0, 1);

  return (
    <g>
      {blades.map((b) => {
        const local = clamp((emergence - b.delay * 0.5) * 2, 0, 1);
        const sway = Math.sin(frame / 20 + b.id * 0.2) * b.bend;
        const yBase = 900 - local * 90;
        return (
          <path
            key={b.id}
            d={`M ${b.x} ${yBase} Q ${b.x + sway * 0.5} ${yBase - b.h * 0.45 * local} ${b.x + sway} ${yBase - b.h * local}`}
            fill="none"
            stroke={b.id % 2 === 0 ? '#6e9f53' : '#82b864'}
            strokeWidth={1 + (b.id % 3) * 0.4}
            opacity={b.o * local}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

const LightTunnel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(24).fill(null).map((_, i) => {
        const pulse = interpolate(Math.sin(frame / 16 + i * 0.7), [-1, 1], [0.06, 0.22]);
        const r = 80 + i * 38 + Math.sin(frame / 20 + i) * 12;
        return (
          <circle
            key={i}
            cx={960}
            cy={500}
            r={r}
            fill="none"
            stroke="#ffd9a2"
            strokeWidth={16 - i * 0.45}
            opacity={pulse}
          />
        );
      })}
    </g>
  );
};

const MotionBlurStreaks: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {MOTION_BLUR_SEEDS.map((s, idx) => {
        const flash = (Math.sin(frame / 6 + idx * 0.33) + 1) / 2;
        const dx = Math.cos(idx) * 40;
        const dy = Math.sin(idx * 0.6) * 26;
        return (
          <line
            key={idx}
            x1={s.x - dx}
            y1={s.y - dy}
            x2={s.x + s.l + dx}
            y2={s.y + dy}
            stroke="#fff1d2"
            strokeWidth={0.8 + (idx % 4) * 0.5}
            opacity={s.o * flash}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

const TitleGlyphParticles = [
  { x: 120, y: 120, r: 1, o: 0.18 },
  { x: 127, y: 131, r: 2, o: 0.27 },
  { x: 134, y: 142, r: 3, o: 0.36 },
  { x: 141, y: 153, r: 4, o: 0.45 },
  { x: 148, y: 164, r: 1, o: 0.54 },
  { x: 155, y: 175, r: 2, o: 0.63 },
  { x: 162, y: 186, r: 3, o: 0.18 },
  { x: 169, y: 197, r: 4, o: 0.27 },
  { x: 176, y: 208, r: 1, o: 0.36 },
  { x: 183, y: 219, r: 2, o: 0.45 },
  { x: 190, y: 230, r: 3, o: 0.54 },
  { x: 197, y: 241, r: 4, o: 0.63 },
  { x: 204, y: 252, r: 1, o: 0.18 },
  { x: 211, y: 263, r: 2, o: 0.27 },
  { x: 218, y: 274, r: 3, o: 0.36 },
  { x: 225, y: 285, r: 4, o: 0.45 },
  { x: 232, y: 296, r: 1, o: 0.54 },
  { x: 239, y: 307, r: 2, o: 0.63 },
  { x: 246, y: 318, r: 3, o: 0.18 },
  { x: 253, y: 329, r: 4, o: 0.27 },
  { x: 260, y: 340, r: 1, o: 0.36 },
  { x: 267, y: 351, r: 2, o: 0.45 },
  { x: 274, y: 362, r: 3, o: 0.54 },
  { x: 281, y: 373, r: 4, o: 0.63 },
  { x: 288, y: 124, r: 1, o: 0.18 },
  { x: 295, y: 135, r: 2, o: 0.27 },
  { x: 302, y: 146, r: 3, o: 0.36 },
  { x: 309, y: 157, r: 4, o: 0.45 },
  { x: 316, y: 168, r: 1, o: 0.54 },
  { x: 323, y: 179, r: 2, o: 0.63 },
  { x: 330, y: 190, r: 3, o: 0.18 },
  { x: 337, y: 201, r: 4, o: 0.27 },
  { x: 344, y: 212, r: 1, o: 0.36 },
  { x: 351, y: 223, r: 2, o: 0.45 },
  { x: 358, y: 234, r: 3, o: 0.54 },
  { x: 365, y: 245, r: 4, o: 0.63 },
  { x: 372, y: 256, r: 1, o: 0.18 },
  { x: 379, y: 267, r: 2, o: 0.27 },
  { x: 386, y: 278, r: 3, o: 0.36 },
  { x: 393, y: 289, r: 4, o: 0.45 },
  { x: 400, y: 300, r: 1, o: 0.54 },
  { x: 407, y: 311, r: 2, o: 0.63 },
  { x: 414, y: 322, r: 3, o: 0.18 },
  { x: 421, y: 333, r: 4, o: 0.27 },
  { x: 428, y: 344, r: 1, o: 0.36 },
  { x: 435, y: 355, r: 2, o: 0.45 },
  { x: 442, y: 366, r: 3, o: 0.54 },
  { x: 449, y: 377, r: 4, o: 0.63 },
  { x: 456, y: 128, r: 1, o: 0.18 },
  { x: 463, y: 139, r: 2, o: 0.27 },
  { x: 470, y: 150, r: 3, o: 0.36 },
  { x: 477, y: 161, r: 4, o: 0.45 },
  { x: 484, y: 172, r: 1, o: 0.54 },
  { x: 491, y: 183, r: 2, o: 0.63 },
  { x: 498, y: 194, r: 3, o: 0.18 },
  { x: 505, y: 205, r: 4, o: 0.27 },
  { x: 512, y: 216, r: 1, o: 0.36 },
  { x: 519, y: 227, r: 2, o: 0.45 },
  { x: 526, y: 238, r: 3, o: 0.54 },
  { x: 533, y: 249, r: 4, o: 0.63 },
  { x: 540, y: 260, r: 1, o: 0.18 },
  { x: 547, y: 271, r: 2, o: 0.27 },
  { x: 554, y: 282, r: 3, o: 0.36 },
  { x: 561, y: 293, r: 4, o: 0.45 },
  { x: 568, y: 304, r: 1, o: 0.54 },
  { x: 575, y: 315, r: 2, o: 0.63 },
  { x: 582, y: 326, r: 3, o: 0.18 },
  { x: 589, y: 337, r: 4, o: 0.27 },
  { x: 596, y: 348, r: 1, o: 0.36 },
  { x: 603, y: 359, r: 2, o: 0.45 },
  { x: 610, y: 370, r: 3, o: 0.54 },
  { x: 617, y: 121, r: 4, o: 0.63 },
  { x: 624, y: 132, r: 1, o: 0.18 },
  { x: 631, y: 143, r: 2, o: 0.27 },
  { x: 638, y: 154, r: 3, o: 0.36 },
  { x: 645, y: 165, r: 4, o: 0.45 },
  { x: 652, y: 176, r: 1, o: 0.54 },
  { x: 659, y: 187, r: 2, o: 0.63 },
  { x: 666, y: 198, r: 3, o: 0.18 },
  { x: 673, y: 209, r: 4, o: 0.27 },
  { x: 680, y: 220, r: 1, o: 0.36 },
  { x: 687, y: 231, r: 2, o: 0.45 },
  { x: 694, y: 242, r: 3, o: 0.54 },
  { x: 701, y: 253, r: 4, o: 0.63 },
  { x: 708, y: 264, r: 1, o: 0.18 },
  { x: 715, y: 275, r: 2, o: 0.27 },
  { x: 722, y: 286, r: 3, o: 0.36 },
  { x: 729, y: 297, r: 4, o: 0.45 },
  { x: 736, y: 308, r: 1, o: 0.54 },
  { x: 743, y: 319, r: 2, o: 0.63 },
  { x: 750, y: 330, r: 3, o: 0.18 },
  { x: 757, y: 341, r: 4, o: 0.27 },
  { x: 764, y: 352, r: 1, o: 0.36 },
  { x: 771, y: 363, r: 2, o: 0.45 },
  { x: 778, y: 374, r: 3, o: 0.54 },
  { x: 785, y: 125, r: 4, o: 0.63 },
  { x: 792, y: 136, r: 1, o: 0.18 },
  { x: 799, y: 147, r: 2, o: 0.27 },
  { x: 806, y: 158, r: 3, o: 0.36 },
  { x: 813, y: 169, r: 4, o: 0.45 },
  { x: 820, y: 180, r: 1, o: 0.54 },
  { x: 827, y: 191, r: 2, o: 0.63 },
  { x: 834, y: 202, r: 3, o: 0.18 },
  { x: 841, y: 213, r: 4, o: 0.27 },
  { x: 848, y: 224, r: 1, o: 0.36 },
  { x: 855, y: 235, r: 2, o: 0.45 },
  { x: 862, y: 246, r: 3, o: 0.54 },
  { x: 869, y: 257, r: 4, o: 0.63 },
  { x: 876, y: 268, r: 1, o: 0.18 },
  { x: 883, y: 279, r: 2, o: 0.27 },
  { x: 890, y: 290, r: 3, o: 0.36 },
  { x: 897, y: 301, r: 4, o: 0.45 },
  { x: 904, y: 312, r: 1, o: 0.54 },
  { x: 911, y: 323, r: 2, o: 0.63 },
  { x: 918, y: 334, r: 3, o: 0.18 },
  { x: 925, y: 345, r: 4, o: 0.27 },
  { x: 932, y: 356, r: 1, o: 0.36 },
  { x: 939, y: 367, r: 2, o: 0.45 },
  { x: 946, y: 378, r: 3, o: 0.54 },
  { x: 953, y: 129, r: 4, o: 0.63 },
  { x: 960, y: 140, r: 1, o: 0.18 },
  { x: 967, y: 151, r: 2, o: 0.27 },
  { x: 974, y: 162, r: 3, o: 0.36 },
  { x: 981, y: 173, r: 4, o: 0.45 },
  { x: 988, y: 184, r: 1, o: 0.54 },
  { x: 995, y: 195, r: 2, o: 0.63 },
  { x: 1002, y: 206, r: 3, o: 0.18 },
  { x: 1009, y: 217, r: 4, o: 0.27 },
  { x: 1016, y: 228, r: 1, o: 0.36 },
  { x: 1023, y: 239, r: 2, o: 0.45 },
  { x: 1030, y: 250, r: 3, o: 0.54 },
  { x: 1037, y: 261, r: 4, o: 0.63 },
  { x: 1044, y: 272, r: 1, o: 0.18 },
  { x: 1051, y: 283, r: 2, o: 0.27 },
  { x: 1058, y: 294, r: 3, o: 0.36 },
  { x: 1065, y: 305, r: 4, o: 0.45 },
  { x: 1072, y: 316, r: 1, o: 0.54 },
  { x: 1079, y: 327, r: 2, o: 0.63 },
  { x: 1086, y: 338, r: 3, o: 0.18 },
  { x: 1093, y: 349, r: 4, o: 0.27 },
  { x: 1100, y: 360, r: 1, o: 0.36 },
  { x: 1107, y: 371, r: 2, o: 0.45 },
  { x: 1114, y: 122, r: 3, o: 0.54 },
  { x: 1121, y: 133, r: 4, o: 0.63 },
  { x: 1128, y: 144, r: 1, o: 0.18 },
  { x: 1135, y: 155, r: 2, o: 0.27 },
  { x: 1142, y: 166, r: 3, o: 0.36 },
  { x: 1149, y: 177, r: 4, o: 0.45 },
  { x: 1156, y: 188, r: 1, o: 0.54 },
  { x: 1163, y: 199, r: 2, o: 0.63 },
  { x: 1170, y: 210, r: 3, o: 0.18 },
  { x: 1177, y: 221, r: 4, o: 0.27 },
  { x: 1184, y: 232, r: 1, o: 0.36 },
  { x: 1191, y: 243, r: 2, o: 0.45 },
  { x: 1198, y: 254, r: 3, o: 0.54 },
  { x: 1205, y: 265, r: 4, o: 0.63 },
  { x: 1212, y: 276, r: 1, o: 0.18 },
  { x: 1219, y: 287, r: 2, o: 0.27 },
  { x: 1226, y: 298, r: 3, o: 0.36 },
  { x: 1233, y: 309, r: 4, o: 0.45 },
  { x: 1240, y: 320, r: 1, o: 0.54 },
  { x: 1247, y: 331, r: 2, o: 0.63 },
  { x: 1254, y: 342, r: 3, o: 0.18 },
  { x: 1261, y: 353, r: 4, o: 0.27 },
  { x: 1268, y: 364, r: 1, o: 0.36 },
  { x: 1275, y: 375, r: 2, o: 0.45 },
  { x: 1282, y: 126, r: 3, o: 0.54 },
  { x: 1289, y: 137, r: 4, o: 0.63 },
  { x: 1296, y: 148, r: 1, o: 0.18 },
  { x: 1303, y: 159, r: 2, o: 0.27 },
  { x: 1310, y: 170, r: 3, o: 0.36 },
  { x: 1317, y: 181, r: 4, o: 0.45 },
  { x: 1324, y: 192, r: 1, o: 0.54 },
  { x: 1331, y: 203, r: 2, o: 0.63 },
  { x: 1338, y: 214, r: 3, o: 0.18 },
  { x: 1345, y: 225, r: 4, o: 0.27 },
  { x: 1352, y: 236, r: 1, o: 0.36 },
  { x: 1359, y: 247, r: 2, o: 0.45 },
  { x: 1366, y: 258, r: 3, o: 0.54 },
  { x: 1373, y: 269, r: 4, o: 0.63 },
  { x: 1380, y: 280, r: 1, o: 0.18 },
  { x: 1387, y: 291, r: 2, o: 0.27 },
  { x: 1394, y: 302, r: 3, o: 0.36 },
  { x: 1401, y: 313, r: 4, o: 0.45 },
  { x: 1408, y: 324, r: 1, o: 0.54 },
  { x: 1415, y: 335, r: 2, o: 0.63 },
  { x: 1422, y: 346, r: 3, o: 0.18 },
  { x: 1429, y: 357, r: 4, o: 0.27 },
  { x: 1436, y: 368, r: 1, o: 0.36 },
  { x: 1443, y: 379, r: 2, o: 0.45 },
  { x: 1450, y: 130, r: 3, o: 0.54 },
  { x: 1457, y: 141, r: 4, o: 0.63 },
  { x: 1464, y: 152, r: 1, o: 0.18 },
  { x: 1471, y: 163, r: 2, o: 0.27 },
  { x: 1478, y: 174, r: 3, o: 0.36 },
  { x: 1485, y: 185, r: 4, o: 0.45 },
  { x: 1492, y: 196, r: 1, o: 0.54 },
  { x: 1499, y: 207, r: 2, o: 0.63 },
  { x: 1506, y: 218, r: 3, o: 0.18 },
  { x: 1513, y: 229, r: 4, o: 0.27 },
  { x: 1520, y: 240, r: 1, o: 0.36 },
  { x: 1527, y: 251, r: 2, o: 0.45 },
  { x: 1534, y: 262, r: 3, o: 0.54 },
  { x: 1541, y: 273, r: 4, o: 0.63 },
  { x: 1548, y: 284, r: 1, o: 0.18 },
  { x: 1555, y: 295, r: 2, o: 0.27 },
  { x: 1562, y: 306, r: 3, o: 0.36 },
  { x: 1569, y: 317, r: 4, o: 0.45 },
  { x: 1576, y: 328, r: 1, o: 0.54 },
  { x: 1583, y: 339, r: 2, o: 0.63 },
  { x: 1590, y: 350, r: 3, o: 0.18 },
  { x: 1597, y: 361, r: 4, o: 0.27 },
  { x: 1604, y: 372, r: 1, o: 0.36 },
  { x: 1611, y: 123, r: 2, o: 0.45 },
  { x: 1618, y: 134, r: 3, o: 0.54 },
  { x: 1625, y: 145, r: 4, o: 0.63 },
  { x: 1632, y: 156, r: 1, o: 0.18 },
  { x: 1639, y: 167, r: 2, o: 0.27 },
  { x: 1646, y: 178, r: 3, o: 0.36 },
  { x: 1653, y: 189, r: 4, o: 0.45 },
  { x: 1660, y: 200, r: 1, o: 0.54 },
  { x: 1667, y: 211, r: 2, o: 0.63 },
  { x: 1674, y: 222, r: 3, o: 0.18 },
  { x: 1681, y: 233, r: 4, o: 0.27 },
  { x: 1688, y: 244, r: 1, o: 0.36 },
  { x: 1695, y: 255, r: 2, o: 0.45 },
  { x: 1702, y: 266, r: 3, o: 0.54 },
  { x: 1709, y: 277, r: 4, o: 0.63 },
  { x: 1716, y: 288, r: 1, o: 0.18 },
  { x: 1723, y: 299, r: 2, o: 0.27 },
  { x: 1730, y: 310, r: 3, o: 0.36 },
  { x: 1737, y: 321, r: 4, o: 0.45 },
  { x: 1744, y: 332, r: 1, o: 0.54 },
  { x: 1751, y: 343, r: 2, o: 0.63 },
  { x: 1758, y: 354, r: 3, o: 0.18 },
  { x: 1765, y: 365, r: 4, o: 0.27 },
  { x: 1772, y: 376, r: 1, o: 0.36 },
  { x: 1779, y: 127, r: 2, o: 0.45 },
  { x: 1786, y: 138, r: 3, o: 0.54 },
  { x: 1793, y: 149, r: 4, o: 0.63 },
  { x: 120, y: 160, r: 1, o: 0.18 },
  { x: 127, y: 171, r: 2, o: 0.27 },
  { x: 134, y: 182, r: 3, o: 0.36 },
  { x: 141, y: 193, r: 4, o: 0.45 },
  { x: 148, y: 204, r: 1, o: 0.54 },
  { x: 155, y: 215, r: 2, o: 0.63 },
  { x: 162, y: 226, r: 3, o: 0.18 },
  { x: 169, y: 237, r: 4, o: 0.27 },
  { x: 176, y: 248, r: 1, o: 0.36 },
  { x: 183, y: 259, r: 2, o: 0.45 },
  { x: 190, y: 270, r: 3, o: 0.54 },
  { x: 197, y: 281, r: 4, o: 0.63 },
  { x: 204, y: 292, r: 1, o: 0.18 },
  { x: 211, y: 303, r: 2, o: 0.27 },
  { x: 218, y: 314, r: 3, o: 0.36 },
  { x: 225, y: 325, r: 4, o: 0.45 },
  { x: 232, y: 336, r: 1, o: 0.54 },
  { x: 239, y: 347, r: 2, o: 0.63 },
  { x: 246, y: 358, r: 3, o: 0.18 },
  { x: 253, y: 369, r: 4, o: 0.27 },
  { x: 260, y: 120, r: 1, o: 0.36 },
  { x: 267, y: 131, r: 2, o: 0.45 },
  { x: 274, y: 142, r: 3, o: 0.54 },
  { x: 281, y: 153, r: 4, o: 0.63 },
  { x: 288, y: 164, r: 1, o: 0.18 },
  { x: 295, y: 175, r: 2, o: 0.27 },
  { x: 302, y: 186, r: 3, o: 0.36 },
  { x: 309, y: 197, r: 4, o: 0.45 },
  { x: 316, y: 208, r: 1, o: 0.54 },
  { x: 323, y: 219, r: 2, o: 0.63 },
  { x: 330, y: 230, r: 3, o: 0.18 },
  { x: 337, y: 241, r: 4, o: 0.27 },
  { x: 344, y: 252, r: 1, o: 0.36 },
  { x: 351, y: 263, r: 2, o: 0.45 },
  { x: 358, y: 274, r: 3, o: 0.54 },
  { x: 365, y: 285, r: 4, o: 0.63 },
  { x: 372, y: 296, r: 1, o: 0.18 },
  { x: 379, y: 307, r: 2, o: 0.27 },
  { x: 386, y: 318, r: 3, o: 0.36 },
  { x: 393, y: 329, r: 4, o: 0.45 },
  { x: 400, y: 340, r: 1, o: 0.54 },
  { x: 407, y: 351, r: 2, o: 0.63 },
  { x: 414, y: 362, r: 3, o: 0.18 },
  { x: 421, y: 373, r: 4, o: 0.27 },
  { x: 428, y: 124, r: 1, o: 0.36 },
  { x: 435, y: 135, r: 2, o: 0.45 },
  { x: 442, y: 146, r: 3, o: 0.54 },
  { x: 449, y: 157, r: 4, o: 0.63 },
  { x: 456, y: 168, r: 1, o: 0.18 },
  { x: 463, y: 179, r: 2, o: 0.27 },
  { x: 470, y: 190, r: 3, o: 0.36 },
  { x: 477, y: 201, r: 4, o: 0.45 },
  { x: 484, y: 212, r: 1, o: 0.54 },
  { x: 491, y: 223, r: 2, o: 0.63 },
  { x: 498, y: 234, r: 3, o: 0.18 },
  { x: 505, y: 245, r: 4, o: 0.27 },
  { x: 512, y: 256, r: 1, o: 0.36 },
  { x: 519, y: 267, r: 2, o: 0.45 },
  { x: 526, y: 278, r: 3, o: 0.54 },
  { x: 533, y: 289, r: 4, o: 0.63 },
  { x: 540, y: 300, r: 1, o: 0.18 },
  { x: 547, y: 311, r: 2, o: 0.27 },
  { x: 554, y: 322, r: 3, o: 0.36 },
  { x: 561, y: 333, r: 4, o: 0.45 },
  { x: 568, y: 344, r: 1, o: 0.54 },
  { x: 575, y: 355, r: 2, o: 0.63 },
  { x: 582, y: 366, r: 3, o: 0.18 },
  { x: 589, y: 377, r: 4, o: 0.27 },
  { x: 596, y: 128, r: 1, o: 0.36 },
  { x: 603, y: 139, r: 2, o: 0.45 },
  { x: 610, y: 150, r: 3, o: 0.54 },
  { x: 617, y: 161, r: 4, o: 0.63 },
  { x: 624, y: 172, r: 1, o: 0.18 },
  { x: 631, y: 183, r: 2, o: 0.27 },
  { x: 638, y: 194, r: 3, o: 0.36 },
  { x: 645, y: 205, r: 4, o: 0.45 },
  { x: 652, y: 216, r: 1, o: 0.54 },
  { x: 659, y: 227, r: 2, o: 0.63 },
  { x: 666, y: 238, r: 3, o: 0.18 },
  { x: 673, y: 249, r: 4, o: 0.27 },
  { x: 680, y: 260, r: 1, o: 0.36 },
  { x: 687, y: 271, r: 2, o: 0.45 },
  { x: 694, y: 282, r: 3, o: 0.54 },
  { x: 701, y: 293, r: 4, o: 0.63 },
  { x: 708, y: 304, r: 1, o: 0.18 },
  { x: 715, y: 315, r: 2, o: 0.27 },
  { x: 722, y: 326, r: 3, o: 0.36 },
  { x: 729, y: 337, r: 4, o: 0.45 },
  { x: 736, y: 348, r: 1, o: 0.54 },
  { x: 743, y: 359, r: 2, o: 0.63 },
  { x: 750, y: 370, r: 3, o: 0.18 },
  { x: 757, y: 121, r: 4, o: 0.27 },
  { x: 764, y: 132, r: 1, o: 0.36 },
  { x: 771, y: 143, r: 2, o: 0.45 },
  { x: 778, y: 154, r: 3, o: 0.54 },
  { x: 785, y: 165, r: 4, o: 0.63 },
  { x: 792, y: 176, r: 1, o: 0.18 },
  { x: 799, y: 187, r: 2, o: 0.27 },
  { x: 806, y: 198, r: 3, o: 0.36 },
  { x: 813, y: 209, r: 4, o: 0.45 },
  { x: 820, y: 220, r: 1, o: 0.54 },
  { x: 827, y: 231, r: 2, o: 0.63 },
  { x: 834, y: 242, r: 3, o: 0.18 },
  { x: 841, y: 253, r: 4, o: 0.27 },
  { x: 848, y: 264, r: 1, o: 0.36 },
  { x: 855, y: 275, r: 2, o: 0.45 },
  { x: 862, y: 286, r: 3, o: 0.54 },
  { x: 869, y: 297, r: 4, o: 0.63 },
  { x: 876, y: 308, r: 1, o: 0.18 },
  { x: 883, y: 319, r: 2, o: 0.27 },
  { x: 890, y: 330, r: 3, o: 0.36 },
  { x: 897, y: 341, r: 4, o: 0.45 },
  { x: 904, y: 352, r: 1, o: 0.54 },
  { x: 911, y: 363, r: 2, o: 0.63 },
  { x: 918, y: 374, r: 3, o: 0.18 },
  { x: 925, y: 125, r: 4, o: 0.27 },
  { x: 932, y: 136, r: 1, o: 0.36 },
  { x: 939, y: 147, r: 2, o: 0.45 },
  { x: 946, y: 158, r: 3, o: 0.54 },
  { x: 953, y: 169, r: 4, o: 0.63 },
  { x: 960, y: 180, r: 1, o: 0.18 },
  { x: 967, y: 191, r: 2, o: 0.27 },
  { x: 974, y: 202, r: 3, o: 0.36 },
  { x: 981, y: 213, r: 4, o: 0.45 },
  { x: 988, y: 224, r: 1, o: 0.54 },
  { x: 995, y: 235, r: 2, o: 0.63 },
  { x: 1002, y: 246, r: 3, o: 0.18 },
  { x: 1009, y: 257, r: 4, o: 0.27 },
  { x: 1016, y: 268, r: 1, o: 0.36 },
  { x: 1023, y: 279, r: 2, o: 0.45 },
  { x: 1030, y: 290, r: 3, o: 0.54 },
  { x: 1037, y: 301, r: 4, o: 0.63 },
  { x: 1044, y: 312, r: 1, o: 0.18 },
  { x: 1051, y: 323, r: 2, o: 0.27 },
  { x: 1058, y: 334, r: 3, o: 0.36 },
  { x: 1065, y: 345, r: 4, o: 0.45 },
  { x: 1072, y: 356, r: 1, o: 0.54 },
  { x: 1079, y: 367, r: 2, o: 0.63 },
  { x: 1086, y: 378, r: 3, o: 0.18 },
  { x: 1093, y: 129, r: 4, o: 0.27 },
  { x: 1100, y: 140, r: 1, o: 0.36 },
  { x: 1107, y: 151, r: 2, o: 0.45 },
  { x: 1114, y: 162, r: 3, o: 0.54 },
  { x: 1121, y: 173, r: 4, o: 0.63 },
  { x: 1128, y: 184, r: 1, o: 0.18 },
  { x: 1135, y: 195, r: 2, o: 0.27 },
  { x: 1142, y: 206, r: 3, o: 0.36 },
  { x: 1149, y: 217, r: 4, o: 0.45 },
  { x: 1156, y: 228, r: 1, o: 0.54 },
  { x: 1163, y: 239, r: 2, o: 0.63 },
  { x: 1170, y: 250, r: 3, o: 0.18 },
  { x: 1177, y: 261, r: 4, o: 0.27 },
  { x: 1184, y: 272, r: 1, o: 0.36 },
  { x: 1191, y: 283, r: 2, o: 0.45 },
  { x: 1198, y: 294, r: 3, o: 0.54 },
  { x: 1205, y: 305, r: 4, o: 0.63 },
  { x: 1212, y: 316, r: 1, o: 0.18 },
  { x: 1219, y: 327, r: 2, o: 0.27 },
  { x: 1226, y: 338, r: 3, o: 0.36 },
  { x: 1233, y: 349, r: 4, o: 0.45 },
  { x: 1240, y: 360, r: 1, o: 0.54 },
  { x: 1247, y: 371, r: 2, o: 0.63 },
  { x: 1254, y: 122, r: 3, o: 0.18 },
  { x: 1261, y: 133, r: 4, o: 0.27 },
  { x: 1268, y: 144, r: 1, o: 0.36 },
  { x: 1275, y: 155, r: 2, o: 0.45 },
  { x: 1282, y: 166, r: 3, o: 0.54 },
  { x: 1289, y: 177, r: 4, o: 0.63 },
  { x: 1296, y: 188, r: 1, o: 0.18 },
  { x: 1303, y: 199, r: 2, o: 0.27 },
  { x: 1310, y: 210, r: 3, o: 0.36 },
  { x: 1317, y: 221, r: 4, o: 0.45 },
  { x: 1324, y: 232, r: 1, o: 0.54 },
  { x: 1331, y: 243, r: 2, o: 0.63 },
  { x: 1338, y: 254, r: 3, o: 0.18 },
  { x: 1345, y: 265, r: 4, o: 0.27 },
  { x: 1352, y: 276, r: 1, o: 0.36 },
  { x: 1359, y: 287, r: 2, o: 0.45 },
  { x: 1366, y: 298, r: 3, o: 0.54 },
  { x: 1373, y: 309, r: 4, o: 0.63 },
  { x: 1380, y: 320, r: 1, o: 0.18 },
  { x: 1387, y: 331, r: 2, o: 0.27 },
  { x: 1394, y: 342, r: 3, o: 0.36 },
  { x: 1401, y: 353, r: 4, o: 0.45 },
  { x: 1408, y: 364, r: 1, o: 0.54 },
  { x: 1415, y: 375, r: 2, o: 0.63 },
  { x: 1422, y: 126, r: 3, o: 0.18 },
  { x: 1429, y: 137, r: 4, o: 0.27 },
  { x: 1436, y: 148, r: 1, o: 0.36 },
  { x: 1443, y: 159, r: 2, o: 0.45 },
  { x: 1450, y: 170, r: 3, o: 0.54 },
  { x: 1457, y: 181, r: 4, o: 0.63 },
  { x: 1464, y: 192, r: 1, o: 0.18 },
  { x: 1471, y: 203, r: 2, o: 0.27 },
  { x: 1478, y: 214, r: 3, o: 0.36 },
  { x: 1485, y: 225, r: 4, o: 0.45 },
  { x: 1492, y: 236, r: 1, o: 0.54 },
  { x: 1499, y: 247, r: 2, o: 0.63 },
  { x: 1506, y: 258, r: 3, o: 0.18 },
  { x: 1513, y: 269, r: 4, o: 0.27 },
  { x: 1520, y: 280, r: 1, o: 0.36 },
  { x: 1527, y: 291, r: 2, o: 0.45 },
  { x: 1534, y: 302, r: 3, o: 0.54 },
  { x: 1541, y: 313, r: 4, o: 0.63 },
  { x: 1548, y: 324, r: 1, o: 0.18 },
  { x: 1555, y: 335, r: 2, o: 0.27 },
  { x: 1562, y: 346, r: 3, o: 0.36 },
  { x: 1569, y: 357, r: 4, o: 0.45 },
  { x: 1576, y: 368, r: 1, o: 0.54 },
  { x: 1583, y: 379, r: 2, o: 0.63 },
  { x: 1590, y: 130, r: 3, o: 0.18 },
  { x: 1597, y: 141, r: 4, o: 0.27 },
  { x: 1604, y: 152, r: 1, o: 0.36 },
  { x: 1611, y: 163, r: 2, o: 0.45 },
  { x: 1618, y: 174, r: 3, o: 0.54 },
  { x: 1625, y: 185, r: 4, o: 0.63 },
  { x: 1632, y: 196, r: 1, o: 0.18 },
  { x: 1639, y: 207, r: 2, o: 0.27 },
  { x: 1646, y: 218, r: 3, o: 0.36 },
  { x: 1653, y: 229, r: 4, o: 0.45 },
  { x: 1660, y: 240, r: 1, o: 0.54 },
  { x: 1667, y: 251, r: 2, o: 0.63 },
  { x: 1674, y: 262, r: 3, o: 0.18 },
  { x: 1681, y: 273, r: 4, o: 0.27 },
  { x: 1688, y: 284, r: 1, o: 0.36 },
  { x: 1695, y: 295, r: 2, o: 0.45 },
  { x: 1702, y: 306, r: 3, o: 0.54 },
  { x: 1709, y: 317, r: 4, o: 0.63 },
  { x: 1716, y: 328, r: 1, o: 0.18 },
  { x: 1723, y: 339, r: 2, o: 0.27 },
  { x: 1730, y: 350, r: 3, o: 0.36 },
  { x: 1737, y: 361, r: 4, o: 0.45 },
  { x: 1744, y: 372, r: 1, o: 0.54 },
  { x: 1751, y: 123, r: 2, o: 0.63 },
  { x: 1758, y: 134, r: 3, o: 0.18 },
  { x: 1765, y: 145, r: 4, o: 0.27 },
  { x: 1772, y: 156, r: 1, o: 0.36 },
  { x: 1779, y: 167, r: 2, o: 0.45 },
  { x: 1786, y: 178, r: 3, o: 0.54 },
  { x: 1793, y: 189, r: 4, o: 0.63 },
  { x: 120, y: 200, r: 1, o: 0.18 },
  { x: 127, y: 211, r: 2, o: 0.27 },
  { x: 134, y: 222, r: 3, o: 0.36 },
  { x: 141, y: 233, r: 4, o: 0.45 },
  { x: 148, y: 244, r: 1, o: 0.54 },
  { x: 155, y: 255, r: 2, o: 0.63 },
  { x: 162, y: 266, r: 3, o: 0.18 },
  { x: 169, y: 277, r: 4, o: 0.27 },
  { x: 176, y: 288, r: 1, o: 0.36 },
  { x: 183, y: 299, r: 2, o: 0.45 },
  { x: 190, y: 310, r: 3, o: 0.54 },
  { x: 197, y: 321, r: 4, o: 0.63 },
  { x: 204, y: 332, r: 1, o: 0.18 },
  { x: 211, y: 343, r: 2, o: 0.27 },
  { x: 218, y: 354, r: 3, o: 0.36 },
  { x: 225, y: 365, r: 4, o: 0.45 },
  { x: 232, y: 376, r: 1, o: 0.54 },
  { x: 239, y: 127, r: 2, o: 0.63 },
  { x: 246, y: 138, r: 3, o: 0.18 },
  { x: 253, y: 149, r: 4, o: 0.27 },
  { x: 260, y: 160, r: 1, o: 0.36 },
  { x: 267, y: 171, r: 2, o: 0.45 },
  { x: 274, y: 182, r: 3, o: 0.54 },
  { x: 281, y: 193, r: 4, o: 0.63 },
  { x: 288, y: 204, r: 1, o: 0.18 },
  { x: 295, y: 215, r: 2, o: 0.27 },
  { x: 302, y: 226, r: 3, o: 0.36 },
  { x: 309, y: 237, r: 4, o: 0.45 },
  { x: 316, y: 248, r: 1, o: 0.54 },
  { x: 323, y: 259, r: 2, o: 0.63 },
  { x: 330, y: 270, r: 3, o: 0.18 },
  { x: 337, y: 281, r: 4, o: 0.27 },
  { x: 344, y: 292, r: 1, o: 0.36 },
  { x: 351, y: 303, r: 2, o: 0.45 },
  { x: 358, y: 314, r: 3, o: 0.54 },
  { x: 365, y: 325, r: 4, o: 0.63 },
  { x: 372, y: 336, r: 1, o: 0.18 },
  { x: 379, y: 347, r: 2, o: 0.27 },
  { x: 386, y: 358, r: 3, o: 0.36 },
  { x: 393, y: 369, r: 4, o: 0.45 },
] as const;

const ProceduralTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const wobble = interpolate(Math.sin(frame / 7), [-1, 1], [-1.6, 1.6]);

  const segments = useMemo(() => {
    const rand = seededRandom(5511);
    return new Array(900).fill(null).map((_, i) => ({
      id: i,
      x1: 260 + rand() * 1380,
      y1: 120 + rand() * 210,
      x2: 260 + rand() * 1380,
      y2: 120 + rand() * 210,
      w: 0.3 + rand() * 1.2,
      o: 0.14 + rand() * 0.35,
    }));
  }, []);

  return (
    <g transform={`translate(0, ${wobble})`}>
      {/* 5000 */}
      <g>
        <path d="M 300 290 L 300 135 L 450 135" fill="none" stroke="#ffe2a9" strokeWidth={18} strokeLinecap="round" />
        <path d="M 520 140 L 660 140 L 660 286 L 520 286 Z" fill="none" stroke="#ffe2a9" strokeWidth={18} />
        <path d="M 740 140 L 880 140 L 880 286 L 740 286 Z" fill="none" stroke="#ffe2a9" strokeWidth={18} />
        <path d="M 960 140 L 1100 140 L 1100 286 L 960 286 Z" fill="none" stroke="#ffe2a9" strokeWidth={18} />
      </g>
      {/* YEARS */}
      <g>
        <path d="M 1180 140 L 1240 210 L 1300 140 M1240 210 L1240 290" fill="none" stroke="#ffd48c" strokeWidth={14} strokeLinecap="round" />
        <path d="M 1340 290 L 1340 140 L 1430 140 Q 1480 140 1480 176 Q 1480 210 1430 214 L 1340 214 M 1420 214 L 1495 290" fill="none" stroke="#ffd48c" strokeWidth={14} strokeLinecap="round" />
        <path d="M 1530 290 L 1530 140 L 1650 140 M1530 214 L1620 214 M1530 290 L1650 290" fill="none" stroke="#ffd48c" strokeWidth={14} strokeLinecap="round" />
        <path d="M 1690 275 Q 1730 295 1770 275 Q 1810 255 1770 235 Q 1730 215 1770 195 Q 1810 175 1765 150 Q 1720 130 1688 152" fill="none" stroke="#ffd48c" strokeWidth={14} strokeLinecap="round" />
      </g>

      {segments.map((seg) => (
        <line
          key={seg.id}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke="#fff3cf"
          strokeWidth={seg.w}
          opacity={seg.o * (0.8 + Math.sin(frame / 10 + seg.id) * 0.2)}
        />
      ))}

      {TitleGlyphParticles.map((p, idx) => (
        <circle
          key={idx}
          cx={p.x + Math.sin(frame / 20 + idx) * 1.8}
          cy={p.y + Math.cos(frame / 21 + idx) * 1.8}
          r={p.r}
          fill={idx % 3 === 0 ? '#f9d99f' : idx % 3 === 1 ? '#b7d39a' : '#b7c8f0'}
          opacity={p.o}
        />
      ))}

      {SYMBOL_PATHS.map((s, idx) => (
        <text
          key={idx}
          x={260 + (idx % 26) * 52}
          y={332 + Math.floor(idx / 26) * 9}
          fontSize={4}
          fill="#f5dca8"
          opacity={0.24}
          fontFamily="monospace"
        >
          {s}
        </text>
      ))}
    </g>
  );
};

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pub = Palette.Pub;
  const progress = clamp((frame - 750) / 450, 0, 1);
  const zoom = interpolate(progress, [0, 1], [1, 1.06]);
  const shake = interpolate(Math.sin(frame / 12), [-1, 1], [-6, 6]) * progress;
  const professorTalkPulse = spring({ frame: Math.max(0, frame - 750), fps, config: { damping: 18, stiffness: 120 } });

  return (
    <SceneShell title="Scene 03 · Time Vortex" act="Pub">
      <AbsoluteFill style={{ transform: `translate(${shake}px, 0px) scale(${zoom})`, transformOrigin: '50% 50%' }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <radialGradient id="vortex-bg" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#2d2736" />
              <stop offset="50%" stopColor="#3c2e25" />
              <stop offset="100%" stopColor="#1f1a17" />
            </radialGradient>
            <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7e563a" />
              <stop offset="100%" stopColor="#3b261b" />
            </linearGradient>
          </defs>

          <rect x={0} y={0} width={1920} height={1080} fill={pub.background} />
          <rect x={0} y={0} width={1920} height={1080} fill="url(#vortex-bg)" opacity={0.78} />

          <BrickWallCrumble x={120} y={120} width={1680} height={260} />
          <WoodGrainCrumble x={120} y={300} width={1680} height={450} seed={63} />

          <LightTunnel />
          <HistoryVortex />
          <MotionBlurStreaks />

          <rect x={0} y={760} width={1920} height={320} fill="url(#floor-grad)" />
          {FLOOR_CRACKS.map((c, idx) => (
            <line
              key={idx}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2 + Math.sin(frame / 18 + idx) * 6}
              y2={c.y2}
              stroke="#2f1e16"
              strokeWidth={1 + (idx % 3) * 0.5}
              opacity={c.o}
            />
          ))}
          <ProceduralGrass />

          <g transform={`translate(900, 380) scale(${1.35 + professorTalkPulse * 0.04})`}>
            <ProfessorPint talking={true} scale={1.4} />
          </g>

          <ProceduralTitle />

          <rect x={0} y={0} width={1920} height={1080} fill="#fff2cc" opacity={0.08 + progress * 0.08} />
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
};
