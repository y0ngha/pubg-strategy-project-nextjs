import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

export class UpdateCirclePhaseCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly circleId: CircleId,
        public readonly phase: CirclePhase
    ) {}

    static create(strategyId: StrategyId, circleId: CircleId, phase: CirclePhase) {
        return new UpdateCirclePhaseCommand(strategyId, circleId, phase);
    }
}
