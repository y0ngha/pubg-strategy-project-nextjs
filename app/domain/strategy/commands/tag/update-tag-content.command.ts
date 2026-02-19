import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

export class UpdateTagContentCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly tagId: TagId,
        public readonly content: TagContent
    ) {}

    static create(strategyId: StrategyId, tagId: TagId, content: TagContent) {
        return new UpdateTagContentCommand(strategyId, tagId, content);
    }
}
