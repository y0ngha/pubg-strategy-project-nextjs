import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Position } from '@domain/strategy/value-objects/position';
import { WAYPOINT_MAX_POSITIONS } from '@domain/strategy/constants/waypoint.constants';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import {
    WaypointCreateDuplicatePositionException,
    WaypointPositionLimitExceededException,
} from '@domain/strategy/exceptions/strategy.exceptions';

export class UpdateWaypointPositionsCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly waypointId: WaypointId,
        public readonly positions: Position[]
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        waypointId: WaypointId,
        positions: Position[]
    ) {
        this.ensureLessThanWaypointPositionLimitCount(positions);
        this.ensureNotDuplicatePosition(positions);

        return new UpdateWaypointPositionsCommand(
            strategyId,
            teamPlayerId,
            waypointId,
            positions
        );
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
}
