import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export class DeleteStrategyCommand {
    private constructor(public readonly strategyId: StrategyId) {}

    static create(strategyId: StrategyId) {
        return new DeleteStrategyCommand(strategyId);
    }
}
