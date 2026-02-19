import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';

export class CreateTeamPlayerCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly position: Position
    ) {}

    static create(strategyId: StrategyId, position: Position) {
        return new CreateTeamPlayerCommand(strategyId, position);
    }
}
