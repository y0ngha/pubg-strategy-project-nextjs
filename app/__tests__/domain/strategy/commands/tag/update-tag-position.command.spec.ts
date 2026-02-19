import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { Position } from '@domain/strategy/value-objects/position';
import { UpdateTagPositionCommand } from '@domain/strategy/commands/tag/update-tag-position.command';

describe('UpdateTagPositionCommand', () => {
    it('태그 위치 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const tagId = TagId.generate();
        const position = Position.create(10, 10);

        //when
        const command = UpdateTagPositionCommand.create(
            strategyId,
            tagId,
            position
        );

        // then
        expect(command).toBeInstanceOf(UpdateTagPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.tagId).toEqual(tagId);
        expect(command.position).toEqual(position);
    });
});
