import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';

export interface DeleteTagRequestDto {
    strategyId: string;
    tagId: string;
}

export const DeleteTagRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    tagId: z.string().transform(value => {
        return TagId.create(value);
    }),
});
