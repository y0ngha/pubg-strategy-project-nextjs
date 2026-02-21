import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { DeleteTagCommand } from '@domain/strategy/commands/tag/delete-tag.command';

describe('DeleteTagCommand', () => {
    it('태그 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const tagId = TagId.generate();

        //when
        const command = DeleteTagCommand.create(strategyId, tagId);

        // then
        expect(command).toBeInstanceOf(DeleteTagCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.tagId).toEqual(tagId);
    });
});
