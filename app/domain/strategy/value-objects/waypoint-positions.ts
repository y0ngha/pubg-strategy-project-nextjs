import { Position } from '@domain/strategy/value-objects/position';
import { WAYPOINT_MAX_POSITIONS } from '@domain/strategy/constants/waypoint.constants';
import {
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class WaypointPositions {
    private constructor(public readonly values: Position[]) {}

    static create(positions: Position[]): WaypointPositions {
        this.ensureLessThanWaypointPositionLimitCount(positions);
        this.ensureNotDuplicatePosition(positions);
        return new WaypointPositions(positions);
    }

    static reconstruct(positions: Position[]): WaypointPositions {
        return new WaypointPositions(positions);
    }

    private static ensureLessThanWaypointPositionLimitCount(
        positions: Position[]
    ) {
        if (positions.length > WAYPOINT_MAX_POSITIONS) {
            throw new WaypointPositionLimitExceededException();
        }
    }

    private static ensureNotDuplicatePosition(positions: Position[]) {
        const keys = positions.map(pos => `${pos.x},${pos.y}`);
        if (new Set(keys).size !== positions.length) {
            throw new WaypointCreateDuplicatePositionException();
        }
    }

    equals(waypointPositions: WaypointPositions) {
        if (!(waypointPositions instanceof WaypointPositions)) {
            return false;
        }

        const positions = waypointPositions.values;
        const myPositions = this.values;

        if (positions.length !== myPositions.length) {
            return false;
        }

        for (let i = 0; i < positions.length; i++) {
            if (!positions[i].equals(myPositions[i])) {
                return false;
            }
        }

        return true;
    }

    toJSON() {
        return this.values.map(position => {
            return {
                x: position.x,
                y: position.y,
            };
        });
    }
}
