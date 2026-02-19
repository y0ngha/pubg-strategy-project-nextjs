import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { EnemyTeamId } from '@domain/strategy/value-objects/enemy-team-id';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

export class UpdateEnemyTeamLabelCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly enemyTeamId: EnemyTeamId,
        public readonly teamLabel: TeamLabel
    ) {}

    static create(
        strategyId: StrategyId,
        enemyTeamId: EnemyTeamId,
        teamLabel: TeamLabel
    ) {
        return new UpdateEnemyTeamLabelCommand(
            strategyId,
            enemyTeamId,
            teamLabel
        );
    }
}
