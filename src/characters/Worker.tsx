import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// Worker: ancient Egyptian pyramid builder — muscular, bare-chested, headband, mallet
// Used in scenes about pyramid construction

interface WorkerProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#B07840',
  skinShadow: '#8B5E30',
  outline: '#1A1A1A',
  hair: '#2A1A0A',
  hairDark: '#1A0E05',
  loincloth: '#F0E8D8',
  loinclothShadow: '#D8D0C0',
  headband: '#F0E8D8',
  headbandStripe: '#CC3333',
  rope: '#A08050',
  ropeDark: '#806838',
  mallet: '#8B6B4A',
  malletHead: '#6B5030',
  malletBand: '#A08050',
  sandal: '#8B6B4A',
  sandalStrap: '#6B5030',
  eyeWhite: '#FFFFFF',
  iris: '#3A2510',
  pupil: '#1A1A1A',
  mouth: '#6B2020',
  tongue: '#AA4444',
  blush: '#C08060',
  shine: 'rgba(255,255,255,0.4)',
};

const SW = 3.5;

export const Worker: React.FC<WorkerProps> = ({
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
      viewBox="-130 -200 260 400"
      width={260 * scale}
      height={400 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        {/* Legs */}
        <WorkerLegs />

        {/* Body */}
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <WorkerBody />
        </g>

        {/* Left arm with mallet (gesture arm) */}
        <WorkerLeftArm gestureRotation={talkGesture} />

        {/* Right arm with rope */}
        <WorkerRightArm />

        {/* Head */}
        <g transform={`translate(0, -105) rotate(${emo.headTilt})`}>
          <WorkerHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ==== SUB-COMPONENTS ====

const WorkerLegs: React.FC = () => (
  <g>
    {/* Muscular legs - bare below loincloth */}
    <path
      d="M-20,70 L-24,130 L-10,130 L-8,75 Z"
      fill={COL.skin} stroke={COL.outline} strokeWidth={SW}
    />
    <path
      d="M20,70 L24,130 L10,130 L8,75 Z"
      fill={COL.skin} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Muscle definition lines */}
    <line x1={-17} y1={85} x2={-16} y2={110} stroke={COL.skinShadow} strokeWidth={1.2} opacity={0.3} />
    <line x1={17} y1={85} x2={16} y2={110} stroke={COL.skinShadow} strokeWidth={1.2} opacity={0.3} />
    {/* Knee lines */}
    <path d="M-19,105 Q-16,108 -13,105" fill="none" stroke={COL.skinShadow} strokeWidth={1} opacity={0.3} />
    <path d="M19,105 Q16,108 13,105" fill="none" stroke={COL.skinShadow} strokeWidth={1} opacity={0.3} />
    {/* Sandals */}
    <ellipse cx={-20} cy={133} rx={16} ry={6} fill={COL.sandal} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={20} cy={133} rx={16} ry={6} fill={COL.sandal} stroke={COL.outline} strokeWidth={2} />
    {/* Sandal straps */}
    <line x1={-20} y1={128} x2={-14} y2={133} stroke={COL.sandalStrap} strokeWidth={1.5} />
    <line x1={-20} y1={128} x2={-26} y2={133} stroke={COL.sandalStrap} strokeWidth={1.5} />
    <line x1={20} y1={128} x2={14} y2={133} stroke={COL.sandalStrap} strokeWidth={1.5} />
    <line x1={20} y1={128} x2={26} y2={133} stroke={COL.sandalStrap} strokeWidth={1.5} />
  </g>
);

const WorkerBody: React.FC = () => (
  <g>
    {/* Bare torso - wider/more muscular */}
    <path
      d="M-48,-38 Q-48,-45 -34,-45 L34,-45 Q48,-45 48,-38 L46,45 Q46,75 0,78 Q-46,75 -46,45 Z"
      fill={COL.skin} stroke={COL.outline} strokeWidth={SW}
    />

    {/* Pectoral muscles */}
    <path d="M-30,-28 Q-18,-20 -6,-28" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} opacity={0.35} />
    <path d="M30,-28 Q18,-20 6,-28" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} opacity={0.35} />

    {/* Center chest line */}
    <line x1={0} y1={-30} x2={0} y2={10} stroke={COL.skinShadow} strokeWidth={1} opacity={0.25} />

    {/* Abdominal lines */}
    <line x1={-8} y1={10} x2={-8} y2={45} stroke={COL.skinShadow} strokeWidth={1} opacity={0.2} />
    <line x1={8} y1={10} x2={8} y2={45} stroke={COL.skinShadow} strokeWidth={1} opacity={0.2} />
    <path d="M-12,20 Q0,22 12,20" fill="none" stroke={COL.skinShadow} strokeWidth={0.8} opacity={0.15} />
    <path d="M-12,32 Q0,34 12,32" fill="none" stroke={COL.skinShadow} strokeWidth={0.8} opacity={0.15} />

    {/* Loincloth / shendyt */}
    <path
      d="M-38,48 L-42,80 Q-40,85 0,88 Q40,85 42,80 L38,48 Z"
      fill={COL.loincloth} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Loincloth fold lines */}
    <line x1={-10} y1={52} x2={-14} y2={82} stroke={COL.loinclothShadow} strokeWidth={1.5} opacity={0.4} />
    <line x1={10} y1={52} x2={14} y2={82} stroke={COL.loinclothShadow} strokeWidth={1.5} opacity={0.4} />
    <line x1={0} y1={50} x2={0} y2={84} stroke={COL.loinclothShadow} strokeWidth={1} opacity={0.3} />
    {/* Loincloth belt/waist tie */}
    <rect x={-40} y={46} width={80} height={8} rx={3} fill={COL.loincloth} stroke={COL.outline} strokeWidth={2} />
    <path d="M-5,50 L-8,64 L0,60 L8,64 L5,50" fill={COL.loincloth} stroke={COL.outline} strokeWidth={1.5} />

    {/* Rope coiled over right shoulder diagonally across chest */}
    <path
      d="M32,-36 Q28,-30 20,-18 Q10,-4 6,10 Q2,22 -4,34"
      fill="none" stroke={COL.rope} strokeWidth={6} strokeLinecap="round" opacity={0.9}
    />
    <path
      d="M34,-34 Q30,-28 22,-16 Q12,-2 8,12 Q4,24 -2,36"
      fill="none" stroke={COL.ropeDark} strokeWidth={2} strokeLinecap="round" opacity={0.3}
    />
    {/* Rope texture marks */}
    <path d="M28,-28 L24,-24" fill="none" stroke={COL.ropeDark} strokeWidth={1} opacity={0.4} />
    <path d="M18,-12 L14,-8" fill="none" stroke={COL.ropeDark} strokeWidth={1} opacity={0.4} />
    <path d="M10,4 L6,8" fill="none" stroke={COL.ropeDark} strokeWidth={1} opacity={0.4} />

    {/* Neck - thicker/muscular */}
    <rect x={-12} y={-50} width={24} height={12} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const WorkerLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-48, -20) rotate(${-10 + gestureRotation}, 0, 0)`}>
    {/* Upper arm - muscular bare skin */}
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.skin} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.12} />
    {/* Bicep line */}
    <line x1={-4} y1={8} x2={-8} y2={22} stroke={COL.skinShadow} strokeWidth={1.2} opacity={0.3} />
    <g transform="translate(-16, 36)">
      {/* Forearm */}
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.outline} strokeWidth={11} strokeLinecap="round" opacity={0.12} />
      {/* Hand gripping mallet */}
      <circle cx={-8} cy={32} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Wooden mallet */}
      <line x1={-8} y1={24} x2={-8} y2={-8} stroke={COL.mallet} strokeWidth={4} strokeLinecap="round" />
      {/* Mallet head */}
      <rect x={-20} y={-18} width={24} height={14} rx={3} fill={COL.malletHead} stroke={COL.outline} strokeWidth={2} />
      {/* Mallet band */}
      <rect x={-18} y={-14} width={20} height={3} rx={1} fill={COL.malletBand} opacity={0.5} />
    </g>
  </g>
);

const WorkerRightArm: React.FC = () => (
  <g transform="translate(48, -20)">
    {/* Upper arm */}
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.skin} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.12} />
    {/* Bicep line */}
    <line x1={4} y1={8} x2={8} y2={22} stroke={COL.skinShadow} strokeWidth={1.2} opacity={0.3} />
    <g transform="translate(14, 36)">
      {/* Forearm */}
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.skin} strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.outline} strokeWidth={11} strokeLinecap="round" opacity={0.12} />
      {/* Hand */}
      <circle cx={6} cy={32} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Rope end dangling from hand */}
      <path d="M6,28 Q10,40 6,50 Q2,58 8,64" fill="none" stroke={COL.rope} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M8,28 Q12,42 8,52 Q4,60 10,66" fill="none" stroke={COL.ropeDark} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
    </g>
  </g>
);

interface WorkerHeadProps {
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

const WorkerHead: React.FC<WorkerHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Short black hair (back) */}
    <path
      d="M-38,0 Q-44,-10 -40,-25 Q-36,-38 -28,-42 Q-18,-48 0,-50 Q18,-48 28,-42 Q36,-38 40,-25 Q44,-10 38,0
         L36,5 Q18,8 0,8 Q-18,8 -36,5 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />

    {/* Head - squarish jaw, strong build */}
    <ellipse cx={0} cy={4} rx={42} ry={46} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Hair front - short cropped */}
    <path
      d="M-28,-32 Q-22,-46 -10,-48 Q0,-50 10,-48 Q22,-46 28,-32
         L24,-34 Q14,-44 0,-44 Q-14,-44 -24,-34 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2}
    />
    {/* Hair texture */}
    <path d="M-12,-44 Q-6,-48 0,-44" fill="none" stroke={COL.hairDark} strokeWidth={1.2} opacity={0.4} />
    <path d="M4,-44 Q10,-48 16,-42" fill="none" stroke={COL.hairDark} strokeWidth={1.2} opacity={0.4} />

    {/* Headband */}
    <path
      d="M-40,-18 Q-42,-22 -38,-26 Q-20,-36 0,-38 Q20,-36 38,-26 Q42,-22 40,-18
         Q20,-28 0,-30 Q-20,-28 -40,-18 Z"
      fill={COL.headband} stroke={COL.outline} strokeWidth={2}
    />
    {/* Red stripe on headband */}
    <path
      d="M-39,-20 Q-20,-30 0,-32 Q20,-30 39,-20
         Q20,-28 0,-30 Q-20,-28 -39,-20 Z"
      fill={COL.headbandStripe} opacity={0.8}
    />

    {/* Ears */}
    <ellipse cx={-40} cy={8} rx={7} ry={11} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />
    <ellipse cx={40} cy={8} rx={7} ry={11} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />
    <path d="M-40,3 Q-37,8 -40,13" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} />
    <path d="M40,3 Q37,8 40,13" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} />

    {/* Eyes */}
    <g transform={`translate(-15, ${2 + emo.eyeOffsetY})`}>
      <WorkerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(15, ${2 + emo.eyeOffsetY})`}>
      <WorkerEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows - thick, strong */}
    <g transform={`translate(-15, ${-12 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-10} y={0} width={20} height={4.5} rx={2} fill={COL.hair} />
    </g>
    <g transform={`translate(15, ${-12 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-10} y={0} width={20} height={4.5} rx={2} fill={COL.hair} />
    </g>

    {/* Blush */}
    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-24} cy={18} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={24} cy={18} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose - broader, stronger */}
    <path d="M-4,10 Q0,20 4,10" fill="none" stroke={COL.outline} strokeWidth={2.2} strokeLinecap="round" />
    <circle cx={-3} cy={14} r={2.5} fill={COL.skinShadow} opacity={0.15} />
    <circle cx={3} cy={14} r={2.5} fill={COL.skinShadow} opacity={0.15} />

    {/* Slight stubble/jaw shadow */}
    <path d="M-28,30 Q0,48 28,30" fill="none" stroke={COL.skinShadow} strokeWidth={1} opacity={0.15} />

    {/* Mouth */}
    <WorkerMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface WorkerEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const WorkerEye: React.FC<WorkerEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={9} ry={7} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.8} />
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.3 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.3} fill="white" opacity={0.8} />
  </g>
);

interface WorkerMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const WorkerMouth: React.FC<WorkerMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 7, 11][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 12 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},28 Q0,${28 + curve} ${hw},28`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 28)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5 + Math.abs(curve) * 0.2}
        fill={COL.mouth} stroke={COL.outline} strokeWidth={2.5} />
      {openAmount > 6 && (
        <ellipse cx={2} cy={openAmount * 0.25} rx={hw * 0.5} ry={openAmount * 0.2} fill={COL.tongue} />
      )}
      {openAmount > 3 && (
        <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.5} fill="white" rx={1} />
      )}
    </g>
  );
};

export default Worker;
