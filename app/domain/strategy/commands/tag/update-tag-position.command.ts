import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { Position } from '@domain/strategy/value-objects/position';

export class UpdateTagPositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly tagId: TagId,
        public readonly position: Position
    ) {}

    static create(strategyId: StrategyId, tagId: TagId, position: Position) {
        return new UpdateTagPositionCommand(strategyId, tagId, position);
    }
}
