import { CircleColor } from '@domain/strategy/enums/circle-color.enum';

export const CIRCLE_MAX_PHASE = 8;
export const CIRCLE_MIN_PHASE = 1;

export const CIRCLE_COLOR_MAP: Record<number, CircleColor> = {
    1: CircleColor.PHASE_1,
    2: CircleColor.PHASE_2,
    3: CircleColor.PHASE_3,
    4: CircleColor.PHASE_4,
    5: CircleColor.PHASE_5,
    6: CircleColor.PHASE_6,
    7: CircleColor.PHASE_7,
    8: CircleColor.PHASE_8,
} as const;

export const CIRCLE_RADIUS_MAP: Record<number, number> = {
    1: 1997.05,
    2: 1198.25,
    3: 659.05,
    4: 362.45,
    5: 181.25,
    6: 90.6,
    7: 45.3,
    8: 22.6,
} as const;
