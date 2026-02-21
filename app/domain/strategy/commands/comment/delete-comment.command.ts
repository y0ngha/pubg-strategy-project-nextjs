import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export class DeleteCommentCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly commentId: CommentId
    ) {}

    static create(strategyId: StrategyId, commentId: CommentId) {
        return new DeleteCommentCommand(strategyId, commentId);
    }
}
