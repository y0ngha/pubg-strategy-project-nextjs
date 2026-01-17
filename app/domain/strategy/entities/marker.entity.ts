import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { Position } from '@domain/strategy/value-objects/position';

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

    updatePosition(newPosition: Position) {
        if (this._isDeleted) {
            this.restore(newPosition);
            return;
        }

        if (this._position.equals(newPosition)) {
            this.delete();
            return;
        }

        this.changePosition(newPosition);
    }

    delete() {
        if (this._isDeleted) return;

        this._isDeleted = true;
    }

    private restore(position: Position) {
        this._isDeleted = false;
        this.changePosition(position);
    }

    private changePosition(position: Position) {
        this._position = position;
        this._updatedAt = new Date();
    }
}
