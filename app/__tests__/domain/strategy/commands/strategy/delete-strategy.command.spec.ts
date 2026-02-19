import { DeleteStrategyCommand } from '@domain/strategy/commands/strategy/delete-strategy.command';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

describe('DeleteStrategyCommand', () => {
    it('전략 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();

        //when
        const command = DeleteStrategyCommand.create(strategyId);

        // then
        expect(command).toBeInstanceOf(DeleteStrategyCommand);
        expect(command.strategyId).toEqual(strategyId);
    });
});
