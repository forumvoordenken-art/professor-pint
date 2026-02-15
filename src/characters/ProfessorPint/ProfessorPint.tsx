import React from 'react';
import {PROFESSOR_PINT_SPEC} from './spec';

type ProfessorPintProps = {
  scale?: number;
  x?: number;
  y?: number;
  style?: React.CSSProperties;
};

export const ProfessorPint: React.FC<ProfessorPintProps> = ({
  scale = 1,
  x = 0,
  y = 0,
  style,
}) => {
  const {colors, strokeWidth, viewBox} = PROFESSOR_PINT_SPEC;

  return (
    <svg
      width={viewBox.width * scale}
      height={viewBox.height * scale}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      style={{position: 'absolute', left: x, top: y, ...style}}
    >
      <g stroke={colors.glasses} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <g id="legs">
          <path d="M 238 560 L 222 812 Q 220 830 240 835 L 320 835 Q 338 832 338 814 L 340 560 Z" fill={colors.pants} />
          <path d="M 338 560 L 332 812 Q 332 830 350 835 L 432 835 Q 450 832 452 812 L 468 560 Z" fill={colors.pants} />
          <path d="M 338 560 L 338 835 Q 330 816 324 790 Q 318 740 320 692 Q 322 634 330 585 Z" fill="#2C3640" stroke="none" />
        </g>

        <g id="shoes">
          <path d="M 206 836 Q 234 820 322 836 Q 358 842 360 860 Q 362 878 336 884 L 228 884 Q 194 882 194 860 Q 194 844 206 836 Z" fill={colors.shoes} />
          <path d="M 338 836 Q 364 818 452 834 Q 490 842 494 860 Q 498 880 470 884 L 364 886 Q 334 884 334 862 Q 334 844 338 836 Z" fill={colors.shoes} />
          <ellipse cx={280} cy={860} rx={44} ry={14} fill="#3D4752" stroke="none" />
          <ellipse cx={420} cy={860} rx={42} ry={12} fill="#3D4752" stroke="none" />
        </g>

        <g id="torso">
          <path d="M 206 292 Q 300 258 398 292 L 432 560 Q 420 584 392 590 L 218 590 Q 192 582 186 558 Z" fill={colors.jacketBase} />
        </g>

        <g id="shirt">
          <path d="M 258 302 L 300 360 L 342 302 Q 340 286 322 280 L 278 280 Q 260 286 258 302 Z" fill={colors.shirt} />
          <path d="M 246 304 L 300 366 L 282 400 L 236 356 Z" fill={colors.shirt} />
          <path d="M 354 304 L 300 366 L 318 400 L 364 356 Z" fill={colors.shirt} />
        </g>

        <g id="vest">
          <path d="M 242 350 Q 300 332 358 350 L 374 566 Q 330 584 272 580 Q 242 578 224 568 Z" fill={colors.vest} />
          <path d="M 250 536 Q 304 548 364 534 L 356 560 Q 302 570 246 560 Z" fill="#8E6F33" stroke="none" />
        </g>

        <g id="tie">
          <path d="M 286 352 L 314 352 L 324 416 L 300 450 L 276 416 Z" fill={colors.tie} />
          <path d="M 280 332 L 320 332 L 306 354 L 294 354 Z" fill="#63160F" stroke="none" />
        </g>

        <g id="jacket">
          <path d="M 204 292 Q 196 324 204 360 Q 216 418 226 478 Q 238 536 228 588 Q 206 584 188 560 L 170 344 Q 174 310 204 292 Z" fill={colors.jacketBase} />
          <path d="M 396 292 Q 406 324 396 362 Q 384 420 372 478 Q 360 536 370 588 Q 402 584 420 560 L 434 344 Q 428 310 396 292 Z" fill={colors.jacketBase} />
          <path d="M 192 360 Q 220 340 252 356 L 278 452 L 248 556 Q 224 550 206 534 Q 182 512 174 486 Q 166 458 170 420 Q 172 386 192 360 Z" fill={colors.jacketShade} />
          <path d="M 406 358 Q 378 340 346 356 L 322 452 L 350 556 Q 374 550 392 534 Q 416 512 424 486 Q 432 458 430 420 Q 426 388 406 358 Z" fill={colors.jacketShade} />

          <g id="jacket-pattern" stroke={colors.jacketPattern} strokeWidth={4} opacity={0.25}>
            <line x1={208} y1={308} x2={228} y2={580} />
            <line x1={238} y1={302} x2={258} y2={586} />
            <line x1={268} y1={298} x2={286} y2={590} />
            <line x1={300} y1={296} x2={300} y2={592} />
            <line x1={332} y1={298} x2={314} y2={590} />
            <line x1={362} y1={302} x2={342} y2={586} />
            <line x1={392} y1={308} x2={372} y2={580} />
            <line x1={420} y1={314} x2={398} y2={568} />

            <line x1={190} y1={340} x2={424} y2={318} />
            <line x1={186} y1={382} x2={428} y2={360} />
            <line x1={182} y1={426} x2={432} y2={404} />
            <line x1={178} y1={468} x2={430} y2={450} />
            <line x1={182} y1={510} x2={424} y2={498} />
            <line x1={190} y1={552} x2={414} y2={544} />
          </g>
        </g>

        <g id="leftArm">
          <path d="M 170 370 Q 150 410 154 462 Q 158 510 188 546 Q 214 578 254 596 L 262 562 Q 240 546 226 522 Q 214 502 212 472 Q 210 430 228 392 Z" fill={colors.jacketBase} />
          <path d="M 258 552 Q 244 574 238 596 Q 236 612 250 620 Q 272 628 294 618 Q 310 610 306 594 Q 300 574 286 554 Z" fill={colors.skinBase} />
          <path d="M 250 620 Q 276 630 304 616 Q 288 606 284 592 Q 274 602 256 602 Z" fill={colors.skinShade} stroke="none" />
        </g>

        <g id="rightArm">
          <path d="M 396 368 Q 436 386 460 424 Q 476 450 476 486 Q 476 522 454 554 Q 438 578 416 590 L 394 560 Q 420 538 426 510 Q 434 478 420 446 Q 408 416 384 394 Z" fill={colors.jacketBase} />
          <path d="M 428 466 Q 444 454 464 460 Q 482 468 484 486 Q 486 508 470 520 Q 452 532 434 522 Q 418 514 416 496 Q 414 480 428 466 Z" fill={colors.skinBase} />
          <path d="M 442 510 Q 454 516 468 510 Q 474 504 476 496 Q 464 500 454 494 Q 446 490 442 480 Q 436 490 442 510 Z" fill={colors.skinShade} stroke="none" />
        </g>

        <g id="pint">
          <path d="M 484 430 L 548 430 Q 562 432 562 446 L 562 554 Q 560 570 548 572 L 486 572 Q 470 570 468 554 L 468 446 Q 470 432 484 430 Z" fill={colors.mugGlass} />
          <path d="M 486 468 L 544 468 L 544 554 L 486 554 Z" fill={colors.beer} stroke="none" />
          <path d="M 486 468 Q 500 500 530 502 Q 542 500 544 488 L 544 554 L 486 554 Z" fill="#BE7400" stroke="none" />
          <path d="M 484 430 Q 500 414 520 418 Q 538 404 554 420 Q 572 420 574 438 Q 586 450 578 468 Q 572 482 552 484 L 498 484 Q 478 482 474 466 Q 468 448 484 430 Z" fill={colors.beerFoam} />
          <circle cx={516} cy={502} r={8} fill="#F6B734" stroke="none" />
          <circle cx={534} cy={522} r={6} fill="#F6B734" stroke="none" />
          <circle cx={504} cy={534} r={5} fill="#F6B734" stroke="none" />
          <path d="M 562 446 Q 590 446 590 474 L 590 528 Q 590 556 562 556" fill="none" stroke={colors.mugOutline} />
          <path d="M 548 430 L 548 572" stroke={colors.mugOutline} />
        </g>

        <g id="head">
          <path d="M 202 96 Q 300 36 398 96 Q 442 126 442 188 Q 444 248 398 288 Q 358 320 300 320 Q 242 320 202 288 Q 156 250 158 188 Q 158 126 202 96 Z" fill={colors.skinBase} />
          <path d="M 300 236 Q 320 250 348 244 Q 336 266 304 268 Q 272 268 262 246 Q 280 246 300 236 Z" fill={colors.skinShade} stroke="none" />
          <path d="M 166 186 Q 144 188 136 208 Q 130 228 142 248 Q 152 262 172 258 Z" fill={colors.skinBase} />
          <path d="M 434 186 Q 456 188 464 208 Q 470 228 458 248 Q 448 262 428 258 Z" fill={colors.skinBase} />
          <path d="M 150 220 Q 160 206 172 220" fill="none" stroke={colors.skinShade} />
          <path d="M 450 220 Q 440 206 428 220" fill="none" stroke={colors.skinShade} />
        </g>

        <g id="hair">
          <path d="M 190 106 Q 166 126 162 154 Q 160 182 172 202 Q 182 220 204 226 Q 212 200 204 178 Q 196 154 206 132 Q 214 116 190 106 Z" fill={colors.hairGray} />
          <path d="M 410 106 Q 434 126 438 154 Q 440 182 428 202 Q 418 220 396 226 Q 388 200 396 178 Q 404 154 394 132 Q 386 116 410 106 Z" fill={colors.hairGray} />
          <path d="M 208 198 Q 200 214 208 230" fill="none" stroke="#756E68" />
          <path d="M 392 198 Q 400 214 392 230" fill="none" stroke="#756E68" />
        </g>

        <g id="eyebrows">
          <path d="M 246 170 Q 266 156 290 168" fill="none" stroke={colors.hairGray} />
          <path d="M 354 170 Q 334 156 310 168" fill="none" stroke={colors.hairGray} />
        </g>

        <g id="glasses">
          <circle cx={264} cy={208} r={34} fill="none" />
          <circle cx={336} cy={208} r={34} fill="none" />
          <line x1={298} y1={208} x2={302} y2={208} />
          <line x1={230} y1={198} x2={186} y2={192} />
          <line x1={370} y1={198} x2={414} y2={192} />
        </g>

        <g id="eyes">
          <circle cx={264} cy={208} r={10} fill={colors.glasses} stroke="none" />
          <circle cx={336} cy={208} r={10} fill={colors.glasses} stroke="none" />
        </g>

        <g id="mouth">
          <path d="M 254 256 Q 300 286 346 256" fill="#FFFFFF" stroke="none" />
          <path d="M 250 250 Q 300 294 350 250" fill="none" stroke={colors.skinShade} />
          <path d="M 270 264 Q 300 280 330 264" fill="none" stroke="#8A3C2A" strokeWidth={4} />
          <path d="M 280 296 Q 300 302 320 296" fill="none" stroke={colors.skinShade} />
        </g>
      </g>
    </svg>
  );
};
