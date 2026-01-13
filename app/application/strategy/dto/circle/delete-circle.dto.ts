import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { CircleId } from '@domain/strategy/value-objects/circle-id';

export interface DeleteCircleRequestDto {
    actorId: string;
    strategyId: string;
    circleId: string;
}

export const DeleteCircleRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    circleId: z.string().transform(value => {
        return CircleId.create(value);
    }),
});
