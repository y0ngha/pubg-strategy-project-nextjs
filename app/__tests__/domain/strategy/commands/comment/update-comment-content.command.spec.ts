import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { UpdateCommentContentCommand } from '@domain/strategy/commands/comment/update-comment-content.command';

describe('UpdateCommentContentCommand', () => {
    it('댓글 내용 수정 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const commentId = CommentId.generate();
        const content = CommentContent.create('TEST');

        //when
        const command = UpdateCommentContentCommand.create(
            strategyId,
            commentId,
            content
        );

        // then
        expect(command).toBeInstanceOf(UpdateCommentContentCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.commentId).toEqual(commentId);
        expect(command.content).toEqual(content);
    });
});
