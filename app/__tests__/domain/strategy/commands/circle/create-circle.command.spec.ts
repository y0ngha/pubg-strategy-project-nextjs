import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateCircleCommand } from '@domain/strategy/commands/circle/create-circle.command';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';

describe('CreateCircleCommand', () => {
    it('자기장 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const phase = CirclePhase.create(1);
        const centerPosition = Position.create(10, 10);

        //when
        const command = CreateCircleCommand.create(
            strategyId,
            phase,
            centerPosition
        );

        // then
        expect(command).toBeInstanceOf(CreateCircleCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.phase).toEqual(phase);
        expect(command.centerPosition).toEqual(centerPosition);
    });
});
