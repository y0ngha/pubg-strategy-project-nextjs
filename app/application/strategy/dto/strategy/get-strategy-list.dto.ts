import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';

export interface GetStrategyListRequestDto {
    actorId: string;
}

export const GetStrategyListRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
