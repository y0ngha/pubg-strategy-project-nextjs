import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

export class DeleteStrategyShareCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly strategyShareId: StrategyShareId
    ) {}

    static create(strategyId: StrategyId, strategyShareId: StrategyShareId) {
        return new DeleteStrategyShareCommand(strategyId, strategyShareId);
    }
}
