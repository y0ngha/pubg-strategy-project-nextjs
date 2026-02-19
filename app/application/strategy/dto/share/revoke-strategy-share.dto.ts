import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

export interface RevokeStrategyShareRequestDto {
    strategyId: string;
    strategyShareId: string;
}

export const RevokeStrategyShareRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    strategyShareId: z.string().transform(value => {
        return StrategyShareId.create(value);
    }),
});
