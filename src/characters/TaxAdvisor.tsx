import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// TaxAdvisor: Dutch belastingadviseur — neat, formal-casual, glasses, organized
// Used in tax/government/belasting scenes

interface TaxAdvisorProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#F0D0B5',
  skinShadow: '#D8B89A',
  outline: '#1A1A1A',
  blazer: '#2A4A6A',
  blazerDark: '#1A3A5A',
  shirt: '#FFFFFF',
  shirtShadow: '#E8E8E8',
  hair: '#3A2A1A',
  hairDark: '#2A1A0A',
  hairShine: '#5A4A3A',
  glasses: '#2A2A2A',
  glassLens: 'rgba(200,220,240,0.18)',
  scarf: '#FF6600', // Dutch orange
  scarfDark: '#CC5500',
  eyeWhite: '#FFFFFF',
  iris: '#3A5A3A',
  pupil: '#1A1A1A',
  mouth: '#7A2020',
  tongue: '#BB5555',
  blush: '#FFBBBB',
  shine: 'rgba(255,255,255,0.45)',
  shoe: '#2A2A2A',
  clipboard: '#F5E8C8',
  clipboardClip: '#888888',
};

const SW = 3.5;

export const TaxAdvisor: React.FC<TaxAdvisorProps> = ({
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
        <TaxLegs />
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <TaxBody />
        </g>
        <TaxLeftArm gestureRotation={talkGesture} />
        <TaxRightArm />
        <g transform={`translate(0, -105) rotate(${emo.headTilt})`}>
          <TaxHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const TaxLegs: React.FC = () => (
  <g>
    <path d="M-15,68 L-18,135 L-6,135 Z" fill="#3A3A4A" stroke={COL.outline} strokeWidth={SW} />
    <path d="M15,68 L18,135 L6,135 Z" fill="#3A3A4A" stroke={COL.outline} strokeWidth={SW} />
    <ellipse cx={-15} cy={137} rx={14} ry={5.5} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={15} cy={137} rx={14} ry={5.5} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
  </g>
);

const TaxBody: React.FC = () => (
  <g>
    {/* Blazer */}
    <path
      d="M-40,-45 Q-40,-52 -28,-52 L28,-52 Q40,-52 40,-45 L40,58 Q40,70 0,73 Q-40,70 -40,58 Z"
      fill={COL.blazer} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Blazer inner shadow */}
    <path d="M-36,-30 L-36,55" stroke={COL.blazerDark} strokeWidth={2} opacity={0.3} />
    <path d="M36,-30 L36,55" stroke={COL.blazerDark} strokeWidth={2} opacity={0.3} />

    {/* Shirt visible */}
    <path d="M-10,-50 L0,10 L10,-50" fill={COL.shirt} stroke={COL.outline} strokeWidth={1.5} />

    {/* Blazer buttons */}
    <circle cx={-6} cy={5} r={3} fill={COL.blazerDark} stroke={COL.outline} strokeWidth={1} />
    <circle cx={-6} cy={22} r={3} fill={COL.blazerDark} stroke={COL.outline} strokeWidth={1} />

    {/* Lapels */}
    <path d="M-10,-50 L-22,-50 L-28,5" fill="none" stroke={COL.blazerDark} strokeWidth={2} />
    <path d="M10,-50 L22,-50 L28,5" fill="none" stroke={COL.blazerDark} strokeWidth={2} />

    {/* Orange scarf/pocket square (Dutch touch) */}
    <path d="M26,-32 L30,-24 L34,-32" fill={COL.scarf} stroke={COL.outline} strokeWidth={1} />

    {/* Neck */}
    <rect x={-10} y={-52} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const TaxLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-42, -26) rotate(${-8 + gestureRotation * 0.7}, 0, 0)`}>
    <line x1={0} y1={0} x2={-15} y2={35} stroke={COL.blazer} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-15} y2={35} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-15, 35)">
      <line x1={0} y1={0} x2={-5} y2={26} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-7} cy={30} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Clipboard */}
      <g transform="translate(-22, 10) rotate(-10)">
        <rect x={0} y={0} width={24} height={32} rx={2} fill={COL.clipboard} stroke={COL.outline} strokeWidth={1.5} />
        <rect x={6} y={-3} width={12} height={6} rx={2} fill={COL.clipboardClip} stroke={COL.outline} strokeWidth={1} />
        {/* Lines on clipboard */}
        <line x1={4} y1={10} x2={20} y2={10} stroke="#CCC" strokeWidth={1} />
        <line x1={4} y1={15} x2={20} y2={15} stroke="#CCC" strokeWidth={1} />
        <line x1={4} y1={20} x2={16} y2={20} stroke="#CCC" strokeWidth={1} />
        {/* Checkmarks */}
        <path d="M2,10 L3,11 L5,8" fill="none" stroke="#2D5016" strokeWidth={1} />
        <path d="M2,15 L3,16 L5,13" fill="none" stroke="#2D5016" strokeWidth={1} />
      </g>
    </g>
  </g>
);

const TaxRightArm: React.FC = () => (
  <g transform="translate(42, -26)">
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.blazer} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 35)">
      <line x1={0} y1={0} x2={4} y2={26} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={6} cy={30} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

interface TaxHeadProps {
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

const TaxHead: React.FC<TaxHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Hair back */}
    <path
      d="M-42,5 Q-48,-8 -44,-26 Q-38,-44 0,-48 Q38,-44 44,-26 Q48,-8 42,5
         L38,10 Q20,14 0,14 Q-20,14 -38,10 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />

    {/* Face */}
    <ellipse cx={0} cy={2} rx={44} ry={46} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Hair front - neat, professional */}
    <path
      d="M-36,-26 Q-30,-42 0,-46 Q30,-42 36,-26
         L34,-20 Q26,-36 0,-38 Q-26,-36 -34,-20 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2}
    />
    <path d="M-10,-40 Q0,-46 10,-40" fill="none" stroke={COL.hairShine} strokeWidth={1.2} opacity={0.3} />

    {/* Round glasses */}
    <circle cx={-16} cy={0} r={13} fill={COL.glassLens} stroke={COL.glasses} strokeWidth={2.5} />
    <circle cx={16} cy={0} r={13} fill={COL.glassLens} stroke={COL.glasses} strokeWidth={2.5} />
    <path d="M-3,0 Q0,-3 3,0" fill="none" stroke={COL.glasses} strokeWidth={2.5} />
    <line x1={-29} y1={-2} x2={-44} y2={-5} stroke={COL.glasses} strokeWidth={2} />
    <line x1={29} y1={-2} x2={44} y2={-5} stroke={COL.glasses} strokeWidth={2} />

    {/* Eyes */}
    <g transform={`translate(-16, ${0 + emo.eyeOffsetY})`}>
      <TaxEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(16, ${0 + emo.eyeOffsetY})`}>
      <TaxEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows */}
    <g transform={`translate(-16, ${-15 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.hair} />
    </g>
    <g transform={`translate(16, ${-15 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.hair} />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={28} cy={14} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,8 Q0,15 3,8" fill="none" stroke={COL.outline} strokeWidth={2} strokeLinecap="round" />

    {/* Friendly smile lines */}
    <path d="M-30,12 Q-28,18 -24,14" fill="none" stroke={COL.skinShadow} strokeWidth={1} opacity={0.3} />
    <path d="M30,12 Q28,18 24,14" fill="none" stroke={COL.skinShadow} strokeWidth={1} opacity={0.3} />

    {/* Mouth */}
    <TaxMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface TaxEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const TaxEye: React.FC<TaxEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={8} ry={6} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={3.8 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.2} fill="white" opacity={0.8} />
  </g>
);

interface TaxMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const TaxMouth: React.FC<TaxMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 6, 10][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 11 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 26)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.48}
        fill={COL.mouth} stroke={COL.outline} strokeWidth={2.5} />
      {openAmount > 6 && (
        <ellipse cx={1} cy={openAmount * 0.22} rx={hw * 0.45} ry={openAmount * 0.18} fill={COL.tongue} />
      )}
      {openAmount > 3 && (
        <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.5} fill="white" rx={1} />
      )}
    </g>
  );
};

export default TaxAdvisor;
