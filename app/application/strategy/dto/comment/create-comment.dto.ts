import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { CommentId } from '@domain/strategy/value-objects/comment-id';

export interface CreateCommentRequestDto {
    actorId: string;
    strategyId: string;
    content: string;
    parentCommentId?: string;
    position?: { x: number; y: number };
}

export const CreateCommentRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    content: z.string(),
    parentCommentId: z
        .string()
        .transform(value => {
            return CommentId.create(value);
        })
        .optional(),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        })
        .optional(),
});
