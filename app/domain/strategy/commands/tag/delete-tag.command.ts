import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';

export class DeleteTagCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly tagId: TagId
    ) {}

    static create(strategyId: StrategyId, tagId: TagId) {
        return new DeleteTagCommand(strategyId, tagId);
    }
}
