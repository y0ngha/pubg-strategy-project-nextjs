import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';
import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';

export class UpdateWaypointPositionsCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly waypointId: WaypointId,
        public readonly positions: WaypointPositions
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        waypointId: WaypointId,
        positions: WaypointPositions
    ) {
        return new UpdateWaypointPositionsCommand(
            strategyId,
            teamPlayerId,
            waypointId,
            positions
        );
    }
}
