import { z } from 'zod';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';
import { TagContent } from '@domain/strategy/value-objects/tag-content';

export interface UpdateTagContentRequestDto {
    strategyId: string;
    tagId: string;
    content: string;
}

export const UpdateTagContentRequestSchema = z.object({
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    tagId: z.string().transform(value => {
        return TagId.create(value);
    }),
    content: z.string().transform(value => {
        return TagContent.create(value);
    }),
});
