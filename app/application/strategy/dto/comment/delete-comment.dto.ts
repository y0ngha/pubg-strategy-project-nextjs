import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export interface DeleteCommentRequestDto {
    actorId: string;
    commentId: string;
    strategyId: string;
}

export const DeleteCommentRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    commentId: z.string().transform(value => {
        return CommentId.create(value);
    }),
});
