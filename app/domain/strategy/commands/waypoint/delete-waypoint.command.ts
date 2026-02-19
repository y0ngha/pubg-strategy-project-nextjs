import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { WaypointId } from '@domain/strategy/value-objects/waypoint-id';

export class DeleteWaypointCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly waypointId: WaypointId
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        waypointId: WaypointId
    ) {
        return new DeleteWaypointCommand(strategyId, teamPlayerId, waypointId);
    }
}
