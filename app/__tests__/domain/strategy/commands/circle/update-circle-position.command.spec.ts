import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { UpdateCirclePositionCommand } from '@domain/strategy/commands/circle/update-circle-position.command';

describe('UpdateCirclePositionCommand', () => {
    it('자기장 포지션 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const circleId = CircleId.generate();
        const centerPosition = Position.create(10, 10);

        //when
        const command = UpdateCirclePositionCommand.create(
            strategyId,
            circleId,
            centerPosition
        );

        // then
        expect(command).toBeInstanceOf(UpdateCirclePositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.circleId).toEqual(circleId);
        expect(command.centerPosition).toEqual(centerPosition);
    });
});
