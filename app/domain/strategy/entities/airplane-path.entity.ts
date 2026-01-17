import { Position } from '@domain/strategy/value-objects/position';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';

export class AirplanePath {
    private constructor(
        public readonly id: AirplanePathId,
        public readonly startPosition: Position,
        public readonly endPosition: Position,
        private _isDeleted: boolean,
        public readonly createdAt: Date
    ) {
        this.ensureDifferentForStartPositionToEndPosition(
            startPosition,
            endPosition
        );
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    static create(startPosition: Position, endPosition: Position) {
        return new AirplanePath(
            AirplanePathId.generate(),
            startPosition,
            endPosition,
            false,
            new Date()
        );
    }

    delete() {
        if (this._isDeleted) return;
        this._isDeleted = true;
    }

    private ensureDifferentForStartPositionToEndPosition(
        startPosition: Position,
        endPosition: Position
    ) {
        if (startPosition.equals(endPosition)) {
            throw new AirplanePathCreateDuplicatePositionException();
        }
    }
}
