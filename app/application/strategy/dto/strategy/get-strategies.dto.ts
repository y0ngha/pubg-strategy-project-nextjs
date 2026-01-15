import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';

export interface GetStrategiesRequestDto {
    actorId: string;
}

export const GetStrategiesRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
