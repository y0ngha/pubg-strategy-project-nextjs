import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';

export class UpdateTeamPlayerPositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly teamPlayerId: TeamPlayerId,
        public readonly position: Position
    ) {}

    static create(
        strategyId: StrategyId,
        teamPlayerId: TeamPlayerId,
        position: Position
    ) {
        return new UpdateTeamPlayerPositionCommand(
            strategyId,
            teamPlayerId,
            position
        );
    }
}
