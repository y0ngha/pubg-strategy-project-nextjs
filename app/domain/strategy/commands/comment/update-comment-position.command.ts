import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { Position } from '@domain/strategy/value-objects/position';
import { ChildCommentException } from '@domain/strategy/exceptions/strategy.exceptions';

export class UpdateCommentPositionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly commentId: CommentId,
        public readonly position: Position
    ) {}

    static create(
        strategyId: StrategyId,
        commentId: CommentId,
        position: Position,
        isParent: boolean
    ) {
        this.ensureParentComment(isParent);

        return new UpdateCommentPositionCommand(
            strategyId,
            commentId,
            position
        );
    }

    private static ensureParentComment(isParent: boolean) {
        if (!isParent) {
            throw new ChildCommentException();
        }
    }
}
