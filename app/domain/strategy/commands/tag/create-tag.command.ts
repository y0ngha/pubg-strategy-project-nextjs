import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

export class CreateTagCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly position: Position,
        public readonly content: TagContent
    ) {}

    static create(
        strategyId: StrategyId,
        position: Position,
        content: TagContent
    ) {
        return new CreateTagCommand(strategyId, position, content);
    }
}
