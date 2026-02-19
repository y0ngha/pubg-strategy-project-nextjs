import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import { DeleteStrategyShareCommand } from '@domain/strategy/commands/strategy-share/delete-strategy-share.command';

describe('DeleteStrategyShareCommand', () => {
    it('전략 공유 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const strategyShareId = StrategyShareId.generate();

        //when
        const command = DeleteStrategyShareCommand.create(
            strategyId,
            strategyShareId
        );

        // then
        expect(command).toBeInstanceOf(DeleteStrategyShareCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.strategyShareId).toEqual(strategyShareId);
    });
});
