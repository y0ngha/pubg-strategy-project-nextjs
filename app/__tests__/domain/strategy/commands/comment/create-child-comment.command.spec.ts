import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CreateChildCommentCommand } from '@domain/strategy/commands/comment/create-child-comment.command';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

describe('CreateChildCommentCommand', () => {
    it('자식 댓글 생성 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const parentCommentId = CommentId.generate();
        const content = CommentContent.create('TEST');

        //when
        const command = CreateChildCommentCommand.create(
            strategyId,
            parentCommentId,
            content
        );

        // then
        expect(command).toBeInstanceOf(CreateChildCommentCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.parentCommentId).toEqual(parentCommentId);
        expect(command.content).toEqual(content);
    });
});
