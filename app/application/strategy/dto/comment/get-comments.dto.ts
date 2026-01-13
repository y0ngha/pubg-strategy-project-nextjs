import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export interface GetCommentsRequestDto {
    strategyId: string;
}

export const GetCommentsRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
});
