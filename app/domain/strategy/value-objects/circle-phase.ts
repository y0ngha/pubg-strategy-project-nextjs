import { InvalidCirclePhaseException } from '@domain/strategy/exceptions/strategy.exceptions';
import { CircleColor } from '@domain/strategy/enums/circle-color.enum';
import {
    CIRCLE_COLOR_MAP,
    CIRCLE_MAX_PHASE,
    CIRCLE_MIN_PHASE,
    CIRCLE_RADIUS_MAP,
} from '@domain/strategy/constants/circle-phase.constants';

export class CirclePhase {
    constructor(public readonly value: number) {}

    get radius(): number {
        return CIRCLE_RADIUS_MAP[this.value];
    }

    get color(): CircleColor {
        return CIRCLE_COLOR_MAP[this.value];
    }

    static create(value: number) {
        CirclePhase.ensureValidPhase(value);

        return new CirclePhase(value);
    }

    static reconstruct(value: number) {
        return new CirclePhase(value);
    }

    private static ensureValidPhase(phase: number) {
        if (phase > CIRCLE_MAX_PHASE) {
            throw new InvalidCirclePhaseException();
        }

        if (phase < CIRCLE_MIN_PHASE) {
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
