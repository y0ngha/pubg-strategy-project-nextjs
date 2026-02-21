import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

export interface UpdateStrategyRequestDto {
    strategyId: string;
    title: string;
}

export const UpdateStrategyRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    title: z.string().transform(value => {
        return StrategyTitle.create(value);
    }),
});
