import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { DeleteCircleCommand } from '@domain/strategy/commands/circle/delete-circle.command';

describe('DeleteCircleCommand', () => {
    it('자기장 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const circleId = CircleId.generate();

        //when
        const command = DeleteCircleCommand.create(strategyId, circleId);

        // then
        expect(command).toBeInstanceOf(DeleteCircleCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.circleId).toEqual(circleId);
    });
});
