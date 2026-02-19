import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export class UpdateCommentContentCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly commentId: CommentId,
        public readonly content: CommentContent
    ) {}

    static create(
        strategyId: StrategyId,
        commentId: CommentId,
        content: CommentContent
    ) {
        return new UpdateCommentContentCommand(strategyId, commentId, content);
    }
}
