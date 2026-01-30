import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';
import { Position as PositionInterface } from '@/application/strategy/types/position';
import { Position } from '@domain/strategy/value-objects/position';

export interface CreateTagRequestDto {
    actorId: string;
    strategyId: string;
    content: string;
    position: PositionInterface;
}

export const CreateTagRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    content: z.string().transform(value => {
        return TagContent.create(value);
    }),
    position: z
        .object({
            x: z.number(),
            y: z.number(),
        })
        .transform(({ x, y }) => {
            return Position.create(x, y);
        }),
});
