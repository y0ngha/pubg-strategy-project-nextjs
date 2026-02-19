import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export interface DeleteCommentRequestDto {
    strategyId: string;
    commentId: string;
}

export const DeleteCommentRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    commentId: z.string().transform(value => {
        return CommentId.create(value);
    }),
});
