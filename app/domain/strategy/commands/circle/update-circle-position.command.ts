import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { Position } from '@domain/strategy/value-objects/position';

export class UpdateCirclePositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly circleId: CircleId,
        public readonly centerPosition: Position
    ) {}

    static create(
        strategyId: StrategyId,
        circleId: CircleId,
        centerPosition: Position
    ) {
        return new UpdateCirclePositionCommand(
            strategyId,
            circleId,
            centerPosition
        );
    }
}
