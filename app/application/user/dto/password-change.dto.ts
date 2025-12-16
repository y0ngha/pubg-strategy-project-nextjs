import { UserId } from '@/domain/shared/value-objects/user-id';
import { Password } from '@/domain/user/value-objects/password';
import { z } from 'zod';

export const PasswordChangeRequestSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
    currentPassword: z.string().transform(value => {
        return Password.create(value);
    }),
    newPassword: z.string().transform(value => {
        return Password.create(value);
    }),
});

export type PasswordChangeRequestObject = z.infer<
    typeof PasswordChangeRequestSchema
>;
