import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { Position } from '@domain/strategy/value-objects/position';

export class UpdateEnemyTeamPositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly enemyTeamId: EnemyTeamId,
        public readonly position: Position
    ) {}

    static create(
        strategyId: StrategyId,
        enemyTeamId: EnemyTeamId,
        position: Position
    ) {
        return new UpdateEnemyTeamPositionCommand(
            strategyId,
            enemyTeamId,
            position
        );
    }
}
