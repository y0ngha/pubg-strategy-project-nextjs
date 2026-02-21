import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

export class CreateCircleCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly phase: CirclePhase,
        public readonly centerPosition: Position
    ) {}

    static create(
        strategyId: StrategyId,
        phase: CirclePhase,
        centerPosition: Position
    ) {
        return new CreateCircleCommand(strategyId, phase, centerPosition);
    }
}
