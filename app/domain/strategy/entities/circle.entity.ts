import { CircleId } from '@domain/strategy/value-objects/circle-id';
import {
    DeletedCircleException,
    InvalidCirclePhaseException,
    SamePositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';
import { CircleColor } from '@domain/strategy/enums/circle-color.enum';
import { Position } from '@domain/strategy/value-objects/position';

export class Circle {
    private static readonly MAX_PHASE_NUMBER = 8;
    private static readonly MIN_PHASE_NUMBER = 1;

    private constructor(
        public readonly id: CircleId,
        private _centerPosition: Position,
        private _phase: number,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {
        this.validatePhase(_phase);
    }

    get centerPosition(): Position {
        return this._centerPosition;
    }

    get phase(): number {
        return this._phase;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get radius(): number {
        const radiusMap: Record<number, number> = {
            1: 1997.05,
            2: 1198.25,
            3: 659.05,
            4: 362.45,
            5: 181.25,
            6: 90.6,
            7: 45.3,
            8: 22.6,
        };

        return radiusMap[this._phase];
    }

    get color(): CircleColor {
        const colorMap: Record<number, CircleColor> = {
            1: CircleColor.PHASE_1,
            2: CircleColor.PHASE_2,
            3: CircleColor.PHASE_3,
            4: CircleColor.PHASE_4,
            5: CircleColor.PHASE_5,
            6: CircleColor.PHASE_6,
            7: CircleColor.PHASE_7,
            8: CircleColor.PHASE_8,
        };

        return colorMap[this._phase];
    }

    static create(centerPosition: Position, phase: number) {
        return new Circle(
            CircleId.generate(),
            centerPosition,
            phase,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: CircleId,
        centerPosition: Position,
        phase: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new Circle(
            id,
            centerPosition,
            phase,
            false,
            createdAt,
            updatedAt
        );
    }

    updateCenterPosition(position: Position) {
        this.ensureNotDeleted();
        this.ensureDiffrentCenterPosition(position);

        this._centerPosition = position;
        this._updatedAt = new Date();
    }

    updatePhase(phase: number) {
        this.ensureNotDeleted();
        this.validatePhase(phase);

        this._phase = phase;
        this._updatedAt = new Date();
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedCircleException();
        }
    }
    private ensurePhaseLessThan8(phase: number) {
        if (phase > Circle.MAX_PHASE_NUMBER) {
            throw new InvalidCirclePhaseException();
        }
    }

    private ensurePhaseGreaterThanZero(phase: number) {
        if (phase < Circle.MIN_PHASE_NUMBER) {
            throw new InvalidCirclePhaseException();
        }
    }

    private validatePhase(phase: number) {
        this.ensurePhaseLessThan8(phase);
        this.ensurePhaseGreaterThanZero(phase);
    }

    private ensureDiffrentCenterPosition(centerPosition: Position) {
        if (this._centerPosition.equals(centerPosition)) {
            throw new SamePositionException();
        }
    }
}
