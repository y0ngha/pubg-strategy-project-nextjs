import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { Position } from '@domain/strategy/value-objects/position';
import { Position as PositionInterface } from '@/application/strategy/types/position';

export interface UpdateTagPositionRequestDto {
    strategyId: string;
    tagId: string;
    position: PositionInterface;
}

export const UpdateTagPositionRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    tagId: z.string().transform(value => {
        return TagId.create(value);
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
