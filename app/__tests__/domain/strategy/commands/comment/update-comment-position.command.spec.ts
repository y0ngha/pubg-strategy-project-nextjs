import { Position } from '@domain/strategy/value-objects/position';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UpdateCommentPositionCommand } from '@domain/strategy/commands/comment/update-comment-position.command';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { ChildCommentException } from '@domain/strategy/exceptions/strategy.exceptions';

describe('UpdateCommentPositionCommand', () => {
    it('부모 댓글이라면, Command가 생성된다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const commentId = CommentId.generate();
        const position = Position.create(10, 10);
        const isParent = true;

        //when
        const command = UpdateCommentPositionCommand.create(
            strategyId,
            commentId,
            position,
            isParent
        );

        // then
        expect(command).toBeInstanceOf(UpdateCommentPositionCommand);
        expect(command.strategyId).toEqual(strategyId);
        expect(command.commentId).toEqual(commentId);
        expect(command.position).toEqual(position);
    });

    it('부모 댓글이아니라면, 에러를 던진다.', () => {
        // given
        const strategyId = StrategyId.generate();
        const commentId = CommentId.generate();
        const position = Position.create(10, 10);
        const isParent = false;

        //when & then

        expect(() =>
            UpdateCommentPositionCommand.create(
                strategyId,
                commentId,
                position,
                isParent
            )
        ).toThrow(ChildCommentException);
    });
});
