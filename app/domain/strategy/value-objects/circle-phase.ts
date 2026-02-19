import { InvalidCirclePhaseException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    CIRCLE_MAX_PHASE,
    CIRCLE_MIN_PHASE,
} from '@domain/strategy/constants/circle-phase.constants';

export class CirclePhase {
    constructor(public readonly value: number) {}

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
