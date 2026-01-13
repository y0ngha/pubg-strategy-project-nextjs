import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

export interface CreateStrategyShareRequestDto {
    actorId: string;
    strategyId: string;
    targetUserId: string;
    permission: string;
}

export const CreateStrategyShareRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    targetUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
    permission: z.enum(StrategySharePermission),
});
