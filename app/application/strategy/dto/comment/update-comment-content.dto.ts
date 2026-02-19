import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';

export interface UpdateCommentContentRequestDto {
    strategyId: string;
    commentId: string;
    content: string;
}

export const UpdateCommentContentRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    commentId: z.string().transform(value => {
        return CommentId.create(value);
    }),
    content: z.string().transform(value => {
        return CommentContent.create(value);
    }),
});
