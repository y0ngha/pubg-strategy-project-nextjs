import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { CommentId } from '@domain/strategy/value-objects/comment-id';
import { Position as PositionInterface } from '@/application/strategy/types/position';

export interface UpdateCommentPositionRequestDto {
    strategyId: string;
    commentId: string;
    position: PositionInterface;
    isParent: boolean;
}

export const UpdateCommentPositionRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    commentId: z.string().transform(value => {
        return CommentId.create(value);
    }),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
    isParent: z.boolean(),
});
