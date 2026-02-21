import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';
import { CirclePhase } from '@domain/strategy/value-objects/circle-phase';
import { UpdateCirclePhaseCommand } from '@domain/strategy/commands/circle/update-circle-phase.command';

describe('UpdateCirclePhaseCommand', () => {
    it('자기장 페이즈 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const circleId = CircleId.generate();
        const phase = CirclePhase.create(1);

        //when
        const command = UpdateCirclePhaseCommand.create(
            strategyId,
            circleId,
            phase
        );

        // then
        expect(command).toBeInstanceOf(UpdateCirclePhaseCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.circleId).toEqual(circleId);
        expect(command.phase).toEqual(phase);
    });
});
