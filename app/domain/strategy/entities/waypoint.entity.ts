import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { Position } from '@domain/strategy/value-objects/position';
import {
    DeletedWaypointException,
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class Waypoint {
    private static readonly MAX_POSITIONS: number = 6;

    private constructor(
        public readonly id: WaypointId,
        private _positions: Position[],
        private _isDeleted: boolean,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get positions(): Position[] {
        return [...this._positions];
    }

    get isDeleted(): boolean {
        return this._isDeleted;
    }

    static create(positions: Position[]) {
        Waypoint.ensureValidPositions(positions);

        return new Waypoint(
            WaypointId.generate(),
            [...positions],
            false,
            new Date(),
            new Date()
        );
    }

    private static ensureValidPositions(positions: Position[]): void {
        if (Waypoint.isExceedingMaxLimit(positions)) {
            throw new WaypointPositionLimitExceededException();
        }

        if (Waypoint.hasDuplicatePosition(positions)) {
            throw new WaypointCreateDuplicatePositionException();
        }
    }

    private static isExceedingMaxLimit(positions: Position[]): boolean {
        return positions.length > Waypoint.MAX_POSITIONS;
    }

    private static hasDuplicatePosition(positions: Position[]): boolean {
        const keys = positions.map(pos => `${pos.x},${pos.y}`);
        return new Set(keys).size !== positions.length;
    }

    delete() {
        this.ensureNotDeleted();

        this._isDeleted = true;
    }

    updatePositions(positions: Position[]): boolean {
        this.ensureNotDeleted();

        if (this._positions.length !== positions.length) {
            this._positions = positions;
            this._updatedAt = new Date();
            return true;
        }

        const isSame = this._positions.every((position, index) =>
            position.equals(positions[index])
        );

        if (isSame) return false;

        this._positions = positions;
        this._updatedAt = new Date();
        return true;
    }

    private ensureNotDeleted() {
        if (this._isDeleted) {
            throw new DeletedWaypointException();
        }
    }
}
