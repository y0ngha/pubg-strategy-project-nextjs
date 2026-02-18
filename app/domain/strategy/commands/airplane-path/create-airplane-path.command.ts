import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';
import { Position } from '../../value-objects/position';

export class CreateAirplanePathCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly startPosition: Position,
        public readonly endPosition: Position
    ) {}

    static create(
        strategyId: StrategyId,
        startPosition: Position,
        endPosition: Position
    ) {
        this.ensureDifferentForStartPositionToEndPosition(
            startPosition,
            endPosition
        );

        return new CreateAirplanePathCommand(
            strategyId,
            startPosition,
            endPosition
        );
    }

    private static ensureDifferentForStartPositionToEndPosition(
        startPosition: Position,
        endPosition: Position
    ) {
        if (startPosition.equals(endPosition)) {
            throw new AirplanePathCreateDuplicatePositionException();
        }
    }
}
