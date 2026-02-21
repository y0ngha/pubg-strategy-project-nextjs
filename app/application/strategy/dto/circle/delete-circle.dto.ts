import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

export interface DeleteCircleRequestDto {
    strategyId: string;
    circleId: string;
}

export const DeleteCircleRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    circleId: z.string().transform(value => {
        return CircleId.create(value);
    }),
});
