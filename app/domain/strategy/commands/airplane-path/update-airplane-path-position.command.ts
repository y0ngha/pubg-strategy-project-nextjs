import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { Position } from '../../value-objects/position';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';

export class UpdateAirplanePathPositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly airplanePathId: AirplanePathId,
        public readonly startPosition: Position,
        public readonly endPosition: Position
    ) {}

    static create(
        strategyId: StrategyId,
        airplanePathId: AirplanePathId,
        startPosition: Position,
        endPosition: Position
    ) {
        this.ensureDifferentForStartPositionToEndPosition(
            startPosition,
            endPosition
        );

        return new UpdateAirplanePathPositionCommand(
            strategyId,
            airplanePathId,
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
