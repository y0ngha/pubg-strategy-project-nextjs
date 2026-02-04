import { InvalidCirclePhaseException } from '@domain/strategy/exceptions/strategy.exceptions';
import { CircleColor } from '@domain/strategy/enums/circle-color.enum';

export class CirclePhase {
    private static readonly MAX_PHASE_NUMBER = 8;
    private static readonly MIN_PHASE_NUMBER = 1;

    private static readonly COLOR_MAP: Record<number, CircleColor> = {
        1: CircleColor.PHASE_1,
        2: CircleColor.PHASE_2,
        3: CircleColor.PHASE_3,
        4: CircleColor.PHASE_4,
        5: CircleColor.PHASE_5,
        6: CircleColor.PHASE_6,
        7: CircleColor.PHASE_7,
        8: CircleColor.PHASE_8,
    };
    private static readonly RADIUS_MAP: Record<number, number> = {
        1: 1997.05,
        2: 1198.25,
        3: 659.05,
        4: 362.45,
        5: 181.25,
        6: 90.6,
        7: 45.3,
        8: 22.6,
    };

    constructor(public readonly value: number) {}

    get radius(): number {
        return CirclePhase.RADIUS_MAP[this.value];
    }

    get color(): CircleColor {
        return CirclePhase.COLOR_MAP[this.value];
    }

    static create(value: number) {
        CirclePhase.ensureValidPhase(value);

        return new CirclePhase(value);
    }

    static reconstruct(value: number) {
        return new CirclePhase(value);
    }

    private static ensureValidPhase(phase: number) {
        if (phase > CirclePhase.MAX_PHASE_NUMBER) {
            throw new InvalidCirclePhaseException();
        }

        if (phase < CirclePhase.MIN_PHASE_NUMBER) {
            throw new InvalidCirclePhaseException();
        }
    }

    equals(circlePhase: CirclePhase) {
        if (!(circlePhase instanceof CirclePhase)) {
            return false;
        }

        return this.value === circlePhase.value;
    }

    toNumber() {
        return this.value;
    }

    toJSON() {
        return this.value;
    }
}
