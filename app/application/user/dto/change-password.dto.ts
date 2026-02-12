import { Password } from '@/domain/user/value-objects/password';
import { z } from 'zod';

export interface ChangePasswordRequestDto {
    currentPassword: string;
    newPassword: string;
}

export const ChangePasswordRequestSchema = z.object({
    currentPassword: z.string().transform(value => {
        return Password.create(value);
    }),
    newPassword: z.string().transform(value => {
        return Password.create(value);
    }),
});

export type ChangePasswordRequestObject = z.infer<
    typeof ChangePasswordRequestSchema
>;
