import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export interface DeleteStrategyRequestDto {
    strategyId: string;
}

export const DeleteStrategyRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
});
