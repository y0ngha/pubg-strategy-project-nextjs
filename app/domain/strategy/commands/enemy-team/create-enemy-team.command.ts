import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamLabel } from '@domain/strategy/value-objects/team-label';

export class CreateEnemyTeamCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamLabel: TeamLabel,
        public readonly position: Position
    ) {}

    static create(
        strategyId: StrategyId,
        teamLabel: TeamLabel,
        position: Position
    ) {
        return new CreateEnemyTeamCommand(strategyId, teamLabel, position);
    }
}
