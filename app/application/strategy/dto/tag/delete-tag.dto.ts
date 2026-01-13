import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { TagId } from '@domain/strategy/value-objects/tag-id';

export interface DeleteTagRequestDto {
    actorId: string;
    strategyId: string;
    tagId: string;
}

export const DeleteTagRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    tagId: z.string().transform(value => {
        return TagId.create(value);
    }),
});
