import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CreateTagCommand } from '@domain/strategy/commands/tag/create-tag.command';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

describe('CreateTagCommand', () => {
    it('태그 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const position = Position.create(10, 10);
        const content = TagContent.create('TEST');

        //when
        const command = CreateTagCommand.create(strategyId, position, content);

        // then
        expect(command).toBeInstanceOf(CreateTagCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.position).toEqual(position);
        expect(command.content).toEqual(content);
    });
});
