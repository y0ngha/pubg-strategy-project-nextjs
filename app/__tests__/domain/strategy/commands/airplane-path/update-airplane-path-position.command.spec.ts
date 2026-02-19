import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';

describe('UpdateAirplanePathPositionCommand', () => {
    it('Position이 서로 겹치지 않으면, 비행기 동선 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const airplanePathId = AirplanePathId.generate();
        const startPosition = Position.create(10, 10);
        const endPosition = Position.create(10, 50);

        //when
        const command = UpdateAirplanePathPositionCommand.create(
            strategyId,
            airplanePathId,
            startPosition,
            endPosition
        );

        // then
        expect(command).toBeInstanceOf(UpdateAirplanePathPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.airplanePathId).toEqual(airplanePathId);
        expect(command.startPosition).toEqual(startPosition);
        expect(command.endPosition).toEqual(endPosition);
    });

    it('Position이 서로 겹치면, 에러를 던진다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const airplanePathId = AirplanePathId.generate();
        const startPosition = Position.create(10, 10);
        const endPosition = Position.create(10, 10);

        // when & then
        expect(() =>
            UpdateAirplanePathPositionCommand.create(
                strategyId,
                airplanePathId,
                startPosition,
                endPosition
            )
        ).toThrow(AirplanePathCreateDuplicatePositionException);
    });
});
