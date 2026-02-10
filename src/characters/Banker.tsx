import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// Banker: formal pinstripe suit, silver hair, stern but trustworthy
// Used in bank/savings/mortgage scenes

interface BankerProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#F0D0B0',
  skinShadow: '#D8B898',
  outline: '#1A1A1A',
  suit: '#2A2A3A',
  suitDark: '#1A1A2A',
  suitPinstripe: 'rgba(255,255,255,0.08)',
  vest: '#3A3A4A',
  shirt: '#F0F0FF',
  tie: '#1E3A8A',
  tieDark: '#142A6A',
  tieStripe: '#2A5AAA',
  hair: '#C0C0C0',
  hairDark: '#A0A0A0',
  hairShine: '#E0E0E0',
  glasses: '#4A4A4A',
  glassLens: 'rgba(200,220,240,0.15)',
  eyeWhite: '#FFFFFF',
  iris: '#4A6060',
  pupil: '#1A1A1A',
  mouth: '#6B2020',
  tongue: '#AA4444',
  blush: '#FFBBBB',
  shine: 'rgba(255,255,255,0.45)',
  shoe: '#2A1A0A',
};

const SW = 3.5;

export const Banker: React.FC<BankerProps> = ({
  emotion = 'neutral',
  previousEmotion = 'neutral',
  emotionTransitionProgress = 1,
  talking = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const idle = getIdleState(frame);
  const mouthShape = getMouthShape(frame, talking);
  const talkBounce = getTalkingBounce(frame, talking);
  const talkGesture = getTalkingGesture(frame, talking);

  const emo = useMemo(
    () => interpolateEmotions(previousEmotion, emotion, emotionTransitionProgress),
    [previousEmotion, emotion, emotionTransitionProgress],
  );

  const bodyY = idle.breathing.y + talkBounce;

  return (
    <svg
      viewBox="-130 -210 260 400"
      width={260 * scale}
      height={400 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        <BankerLegs />
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <BankerBody />
        </g>
        <BankerLeftArm gestureRotation={talkGesture} />
        <BankerRightArm />
        <g transform={`translate(0, -108) rotate(${emo.headTilt})`}>
          <BankerHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const BankerLegs: React.FC = () => (
  <g>
    <path d="M-16,68 L-19,135 L-7,135 Z" fill={COL.suit} stroke={COL.outline} strokeWidth={SW} />
    <path d="M16,68 L19,135 L7,135 Z" fill={COL.suit} stroke={COL.outline} strokeWidth={SW} />
    <ellipse cx={-16} cy={137} rx={14} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={16} cy={137} rx={14} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
  </g>
);

const BankerBody: React.FC = () => (
  <g>
    {/* Suit - conservative cut */}
    <path
      d="M-42,-45 Q-42,-52 -30,-52 L30,-52 Q42,-52 42,-45 L42,60 Q42,72 0,75 Q-42,72 -42,60 Z"
      fill={COL.suit} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Pinstripes */}
    {[-18, -8, 2, 12, 22].map((x, i) => (
      <line key={`bp-${i}`} x1={x} y1={-42} x2={x + 1} y2={68} stroke={COL.suitPinstripe} strokeWidth={0.8} />
    ))}

    {/* Vest underneath */}
    <path d="M-22,-48 L-22,40 L22,40 L22,-48" fill={COL.vest} stroke={COL.outline} strokeWidth={1.5} />
    {/* Vest buttons */}
    <circle cx={0} cy={-10} r={2.5} fill={COL.hairDark} stroke={COL.outline} strokeWidth={1} />
    <circle cx={0} cy={8} r={2.5} fill={COL.hairDark} stroke={COL.outline} strokeWidth={1} />
    <circle cx={0} cy={26} r={2.5} fill={COL.hairDark} stroke={COL.outline} strokeWidth={1} />

    {/* Shirt collar */}
    <path d="M-14,-50 Q0,-42 14,-50" fill={COL.shirt} stroke={COL.outline} strokeWidth={1.5} />

    {/* Tie - conservative stripe */}
    <path d="M-4,-48 L0,35 L4,-48" fill={COL.tie} stroke={COL.outline} strokeWidth={1.5} />
    {[0, 8, 16, 24].map((y, i) => (
      <line key={`ts-${i}`} x1={-3} y1={-40 + y} x2={3} y2={-38 + y} stroke={COL.tieStripe} strokeWidth={1} />
    ))}

    {/* Neck */}
    <rect x={-10} y={-52} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const BankerLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-44, -26) rotate(${-8 + gestureRotation * 0.6}, 0, 0)`}>
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.suit} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-16, 36)">
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-8} cy={32} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

const BankerRightArm: React.FC = () => (
  <g transform="translate(44, -26)">
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.suit} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 36)">
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={6} cy={32} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

interface BankerHeadProps {
  emo: {
    eyeScaleY: number; eyeOffsetY: number; pupilScale: number;
    browLeftY: number; browRightY: number; browLeftRotation: number; browRightRotation: number;
    mouthCurve: number; mouthWidth: number; mouthOpen: number;
    blushOpacity: number; headTilt: number;
  };
  blink: number;
  pupil: { x: number; y: number };
  mouthShape: MouthShape;
  talking: boolean;
}

const BankerHead: React.FC<BankerHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Silver hair back */}
    <path
      d="M-42,5 Q-48,-10 -44,-28 Q-38,-45 0,-50 Q38,-45 44,-28 Q48,-10 42,5
         L38,10 Q20,14 0,14 Q-20,14 -38,10 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />

    {/* Face */}
    <ellipse cx={0} cy={2} rx={44} ry={46} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Hair front - neat side part */}
    <path
      d="M-36,-28 Q-32,-44 -10,-48 Q10,-48 30,-44 Q40,-38 38,-28
         L35,-24 Q28,-38 10,-40 Q-10,-42 -32,-30 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2}
    />
    {/* Part line */}
    <path d="M-20,-40 Q-18,-30 -22,-22" fill="none" stroke={COL.hairDark} strokeWidth={1.5} />
    <path d="M-5,-42 Q0,-35 5,-42" fill="none" stroke={COL.hairShine} strokeWidth={1} opacity={0.4} />

    {/* Half-frame glasses (reading glasses style) */}
    <rect x={-28} y={-8} width={22} height={14} rx={3} fill={COL.glassLens} stroke={COL.glasses} strokeWidth={2} />
    <rect x={6} y={-8} width={22} height={14} rx={3} fill={COL.glassLens} stroke={COL.glasses} strokeWidth={2} />
    <path d="M-6,0 Q0,-4 6,0" fill="none" stroke={COL.glasses} strokeWidth={2} />
    <line x1={-28} y1={-2} x2={-44} y2={-6} stroke={COL.glasses} strokeWidth={1.5} />
    <line x1={28} y1={-2} x2={44} y2={-6} stroke={COL.glasses} strokeWidth={1.5} />

    {/* Eyes */}
    <g transform={`translate(-17, ${0 + emo.eyeOffsetY})`}>
      <BankerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(17, ${0 + emo.eyeOffsetY})`}>
      <BankerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows */}
    <g transform={`translate(-17, ${-15 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.hairDark} />
    </g>
    <g transform={`translate(17, ${-15 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.hairDark} />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={28} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,8 Q0,16 3,8" fill="none" stroke={COL.outline} strokeWidth={2.2} strokeLinecap="round" />

    {/* Mouth */}
    <BankerMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface BankerEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const BankerEye: React.FC<BankerEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={8} ry={6} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={3.8 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.2} fill="white" opacity={0.8} />
  </g>
);

interface BankerMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const BankerMouth: React.FC<BankerMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 5, 9][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 11 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},28 Q0,${28 + curve} ${hw},28`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 28)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.45}
        fill={COL.mouth} stroke={COL.outline} strokeWidth={2.5} />
      {openAmount > 6 && (
        <ellipse cx={1} cy={openAmount * 0.2} rx={hw * 0.4} ry={openAmount * 0.15} fill={COL.tongue} />
      )}
      {openAmount > 3 && (
        <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.5} fill="white" rx={1} />
      )}
    </g>
  );
};

export default Banker;
