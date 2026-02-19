import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export interface CreateChildCommentRequestDto {
    strategyId: string;
    parentCommentId: string;
    content: string;
}

export const CreateChildCommentRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    parentCommentId: z.string().transform(value => {
        return CommentId.create(value);
    }),
    content: z.string().transform(value => {
        return CommentContent.create(value);
    }),
});
