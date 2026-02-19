import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

export class UpdateStrategyTitleCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly title: StrategyTitle
    ) {}

    static create(strategyId: StrategyId, title: StrategyTitle) {
        return new UpdateStrategyTitleCommand(strategyId, title);
    }
}
