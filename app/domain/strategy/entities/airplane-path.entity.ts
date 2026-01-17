import { Position } from '@domain/strategy/value-objects/position';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import {
    AirplanePathCreateDuplicatePositionException,
    DeletedAirplanePathException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class AirplanePath {
    private constructor(
        public readonly id: AirplanePathId,
        private _startPosition: Position,
        private _endPosition: Position,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get startPosition(): Position {
        return this._startPosition;
    }

    get endPosition(): Position {
        return this._endPosition;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    static create(startPosition: Position, endPosition: Position) {
        AirplanePath.ensureDifferentForStartPositionToEndPosition(
            startPosition,
            endPosition
        );

        return new AirplanePath(
            AirplanePathId.generate(),
            startPosition,
            endPosition,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: AirplanePathId,
        startPosition: Position,
        endPosition: Position,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new AirplanePath(
            id,
            startPosition,
            endPosition,
            false,
            createdAt,
            updatedAt
        );
    }

    private static ensureDifferentForStartPositionToEndPosition(
        startPosition: Position,
        endPosition: Position
    ) {
        if (startPosition.equals(endPosition)) {
            throw new AirplanePathCreateDuplicatePositionException();
        }
    }

    updateStartPosition(position: Position): boolean {
        this.ensureNotDeleted();

        if (this._startPosition.equals(position)) return false;

        this._startPosition = position;
        this._updatedAt = new Date();

        return true;
    }

    updateEndPosition(position: Position): boolean {
        this.ensureNotDeleted();

        if (this._endPosition.equals(position)) return false;

        this._endPosition = position;
        this._updatedAt = new Date();

        return true;
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedAirplanePathException();
        }
    }
}
