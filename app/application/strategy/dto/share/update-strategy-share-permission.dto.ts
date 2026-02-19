import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

export interface UpdateStrategySharePermissionRequestDto {
    strategyId: string;
    strategyShareId: string;
    permission: string;
}

export const UpdateStrategySharePermissionRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    strategyShareId: z.string().transform(value => {
        return StrategyShareId.create(value);
    }),
    permission: z.enum(StrategySharePermission),
});
