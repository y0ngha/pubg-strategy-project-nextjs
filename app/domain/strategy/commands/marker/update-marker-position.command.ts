import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TeamPlayerId } from '@domain/strategy/value-objects/team-player-id';
import { Position } from '@domain/strategy/value-objects/position';

export class UpdateMarkerPositionCommand {
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
        return new UpdateMarkerPositionCommand(
            strategyId,
            teamPlayerId,
            position
        );
    }
}
