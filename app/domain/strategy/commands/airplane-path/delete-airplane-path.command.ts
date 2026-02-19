import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';

export class DeleteAirplanePathCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly airplanePathId: AirplanePathId
    ) {}

    static create(strategyId: StrategyId, airplanePathId: AirplanePathId) {
        return new DeleteAirplanePathCommand(strategyId, airplanePathId);
    }
}
