import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export class CreateChildCommentCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly parentCommentId: CommentId,
        public readonly content: CommentContent
    ) {}

    static create(
        strategyId: StrategyId,
        parentCommentId: CommentId,
        content: CommentContent
    ) {
        return new CreateChildCommentCommand(
            strategyId,
            parentCommentId,
            content
        );
    }
}
