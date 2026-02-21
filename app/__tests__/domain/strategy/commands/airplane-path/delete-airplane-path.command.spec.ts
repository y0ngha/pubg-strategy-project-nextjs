import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { AirplanePathId } from '@domain/strategy/value-objects/airplane-path-id';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';

describe('DeleteAirplanePathCommand', () => {
    it('비행기 동선 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const airplanePathId = AirplanePathId.generate();

        //when
        const command = DeleteAirplanePathCommand.create(
            strategyId,
            airplanePathId
        );

        // then
        expect(command).toBeInstanceOf(DeleteAirplanePathCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.airplanePathId).toEqual(airplanePathId);
    });
});
