import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

export class DeleteCircleCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly circleId: CircleId
    ) {}

    static create(strategyId: StrategyId, circleId: CircleId) {
        return new DeleteCircleCommand(strategyId, circleId);
    }
}
