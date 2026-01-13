import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export interface RevokeStrategyShareRequestDto {
    actorId: string;
    strategyId: string;
    targetUserId: string;
}

export const RevokeStrategyShareRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    targetUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
