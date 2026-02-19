import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';

export class DeleteTeamPlayerCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId
    ) {}

    static create(strategyId: StrategyId, teamPlayerId: TeamPlayerId) {
        return new DeleteTeamPlayerCommand(strategyId, teamPlayerId);
    }
}
