import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';
import { AirplanePathCreateDuplicatePositionException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('CreateAirplanePathCommand', () => {
    it('Position이 서로 겹치지 않으면, 비행기 동선 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const startPosition = Position.create(10, 10);
        const endPosition = Position.create(10, 50);

        //when
        const command = CreateAirplanePathCommand.create(
            strategyId,
            startPosition,
            endPosition
        );

        // then
        expect(command).toBeInstanceOf(CreateAirplanePathCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.startPosition).toEqual(startPosition);
        expect(command.endPosition).toEqual(endPosition);
    });

    it('Position이 서로 겹치면, 에러를 던진다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const startPosition = Position.create(10, 10);
        const endPosition = Position.create(10, 10);

        // when & then
        expect(() =>
            CreateAirplanePathCommand.create(
                strategyId,
                startPosition,
                endPosition
            )
        ).toThrow(AirplanePathCreateDuplicatePositionException);
    });
});
