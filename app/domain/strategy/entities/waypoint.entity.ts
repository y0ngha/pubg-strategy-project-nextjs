import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { Position } from '@domain/strategy/value-objects/position';
import {
    WaypointCreateDuplicatePositionException,
    WaypointCreateTooManyPositionException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class Waypoint {
    private constructor(
        public readonly id: WaypointId,
        private _positions: Position[],
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date,
        private _deletedAt: Date | null
    ) {
        this.validatePositions(_positions);
    }

    get positions(): Position[] {
        return this._positions;
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deletedAt(): Date | null {
        return this._deletedAt;
    }

    static create(positions: Position[]) {
        return new Waypoint(
            WaypointId.generate(),
            positions,
            false,
            new Date(),
            new Date(),
            null
        );
    }

    private validatePositions(positions: Position[]): void {
        if (this.isExceedingMaxLimit(positions)) {
            throw new WaypointCreateTooManyPositionException();
        }

        if (this.hasDuplicatePosition(positions)) {
            throw new WaypointCreateDuplicatePositionException();
        }
    }

    private isExceedingMaxLimit(positions: Position[]): boolean {
        return positions.length > 6;
    }

    private hasDuplicatePosition(positions: Position[]): boolean {
        const keys = positions.map(pos => `${pos.x},${pos.y}`);
        return new Set(keys).size !== positions.length;
    }
}
