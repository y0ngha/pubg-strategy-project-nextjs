import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export const LogoutRequestSchema = z.object({
    userId: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export type LogoutRequestObject = z.infer<typeof LogoutRequestSchema>;
