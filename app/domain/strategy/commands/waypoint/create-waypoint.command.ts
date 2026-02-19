import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { WaypointPositions } from '@domain/strategy/value-objects/waypoint-positions';

export class CreateWaypointCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly positions: WaypointPositions
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        positions: WaypointPositions
    ) {
        return new CreateWaypointCommand(strategyId, teamPlayerId, positions);
    }
}
