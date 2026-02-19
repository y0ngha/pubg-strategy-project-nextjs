import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CreateParentCommentCommand } from '@domain/strategy/commands/comment/create-parent-comment.command';

describe('CreateParentCommentCommand', () => {
    it('부모 댓글 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const position = Position.create(10, 10);
        const content = CommentContent.create('TEST');

        //when
        const command = CreateParentCommentCommand.create(
            strategyId,
            position,
            content
        );

        // then
        expect(command).toBeInstanceOf(CreateParentCommentCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.position).toEqual(position);
        expect(command.content).toEqual(content);
    });
});
