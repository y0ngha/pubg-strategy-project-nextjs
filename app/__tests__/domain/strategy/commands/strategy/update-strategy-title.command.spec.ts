import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UpdateStrategyTitleCommand } from '@domain/strategy/commands/strategy/update-strategy-title.command';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

describe('UpdateStrategyTitleCommand', () => {
    it('전략 제목 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const title = StrategyTitle.create('Test');

        //when
        const command = UpdateStrategyTitleCommand.create(strategyId, title);

        // then
        expect(command).toBeInstanceOf(UpdateStrategyTitleCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.title).toEqual(title);
    });
});
