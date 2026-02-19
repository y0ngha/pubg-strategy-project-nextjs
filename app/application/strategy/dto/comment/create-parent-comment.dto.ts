import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Position } from '@domain/strategy/value-objects/position';
import { CommentContent } from '@domain/strategy/value-objects/comment-content';
import { Position as PositionInterface } from '@/application/strategy/types/position';

export interface CreateParentCommentRequestDto {
    strategyId: string;
    position: PositionInterface;
    content: string;
}

export const CreateParentCommentRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
    content: z.string().transform(value => {
        return CommentContent.create(value);
    }),
});
