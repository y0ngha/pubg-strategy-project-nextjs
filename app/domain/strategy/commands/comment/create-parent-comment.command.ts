import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '../../value-objects/position';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

export class CreateParentCommentCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly position: Position,
        public readonly content: CommentContent
    ) {}

    static create(
        strategyId: StrategyId,
        position: Position,
        content: CommentContent
    ) {
        return new CreateParentCommentCommand(strategyId, position, content);
    }
}
