import { MarkerId } from '@domain/strategy/value-objects/marker-id';
import { Position } from '@domain/strategy/value-objects/position';

export class Marker {
    private constructor(
        public readonly id: MarkerId,
        private _position: Position,
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date,
        private _deletedAt: Date | null
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

    get deletedAt(): Date | null {
        return this._deletedAt;
    }

    static create(position: Position) {
        return new Marker(
            MarkerId.generate(),
            position,
            false,
            new Date(),
            new Date(),
            null
        );
    }

    update(position: Position) {
        if (!this.isDeleted) {
            if (this.position.equals(position)) {
                this.delete();
                return;
            }
        } else {
            this._isDeleted = false;
            this._deletedAt = null;
        }

        this._position = position;
        this._updatedAt = new Date();
    }

    delete() {
        if (this.isDeleted) return;

        this._isDeleted = true;
        this._deletedAt = new Date();
    }
}
