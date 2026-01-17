import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { Position } from '@domain/strategy/value-objects/position';
import { DeletedMarkerException } from '@domain/strategy/exceptions/strategy.exceptions';

export class Marker {
    private constructor(
        public readonly id: MarkerId,
        private _position: Position,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get position(): Position {
        return this._position;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    static create(position: Position) {
        return new Marker(
            MarkerId.generate(),
            position,
            false,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: MarkerId,
        position: Position,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new Marker(id, position, false, createdAt, updatedAt);
    }

    updatePosition(newPosition: Position): boolean {
        this.ensureNotDeleted();

        if (this._position.equals(newPosition)) return false;

        this._position = newPosition;
        this._updatedAt = new Date();

        return true;
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedMarkerException();
        }
    }
}
