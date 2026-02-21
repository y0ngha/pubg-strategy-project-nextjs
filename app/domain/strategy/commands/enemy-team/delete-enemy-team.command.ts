import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';

export class DeleteEnemyTeamCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly enemyTeamId: EnemyTeamId
    ) {}

    static create(strategyId: StrategyId, enemyTeamId: EnemyTeamId) {
        return new DeleteEnemyTeamCommand(strategyId, enemyTeamId);
    }
}
