import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export const WithdrawalRequestSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export type WithdrawalRequestObject = z.infer<typeof WithdrawalRequestSchema>;
