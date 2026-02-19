import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { UpdateTagContentCommand } from '@domain/strategy/commands/tag/update-tag-content.command';

describe('UpdateTagContentCommand', () => {
    it('태그 내용 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const tagId = TagId.generate();
        const content = TagContent.create('TEST');

        //when
        const command = UpdateTagContentCommand.create(
            strategyId,
            tagId,
            content
        );

        // then
        expect(command).toBeInstanceOf(UpdateTagContentCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.tagId).toEqual(tagId);
        expect(command.content).toEqual(content);
    });
});
