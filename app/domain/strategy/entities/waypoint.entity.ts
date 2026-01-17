import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { Position } from '@domain/strategy/value-objects/position';
import {
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class Waypoint {
    private static readonly MAX_POSITIONS: number = 6;

    private constructor(
        public readonly id: WaypointId,
        private readonly _positions: Position[],
        private _isDeleted: boolean,
        public readonly createdAt: Date
    ) {
        this.validatePositions(_positions);
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
}
