import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { DeleteCommentCommand } from '@domain/strategy/commands/comment/delete-comment.command';

describe('DeleteCommentCommand', () => {
    it('댓글 삭제 Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const commentId = CommentId.generate();

        //when
        const command = DeleteCommentCommand.create(strategyId, commentId);

        // then
        expect(command).toBeInstanceOf(DeleteCommentCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.commentId).toEqual(commentId);
    });
});
