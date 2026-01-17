import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { DeletedCircleException } from '@domain/strategy/exceptions/strategy.exceptions';
import { Position } from '@domain/strategy/value-objects/position';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

export class Circle {
    private constructor(
        public readonly id: CircleId,
        private _centerPosition: Position,
        private _phase: CirclePhase,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get centerPosition(): Position {
        return this._centerPosition;
    }

    get phase(): CirclePhase {
        return this._phase;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    static create(centerPosition: Position, phase: CirclePhase) {
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
        phase: CirclePhase,
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

    updateCenterPosition(position: Position): boolean {
        this.ensureNotDeleted();

        if (this._centerPosition.equals(position)) return false;

        this._centerPosition = position;
        this._updatedAt = new Date();

        return true;
    }

    updatePhase(phase: CirclePhase): boolean {
        this.ensureNotDeleted();

        if (this._phase.equals(phase)) return false;

        this._phase = phase;
        this._updatedAt = new Date();

        return true;
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
}
