import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { MarkerId } from '@domain/strategy/value-objects/marker-id';

export class DeleteMarkerCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly markerId: MarkerId
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        markerId: MarkerId
    ) {
        return new DeleteMarkerCommand(strategyId, teamPlayerId, markerId);
    }
}
