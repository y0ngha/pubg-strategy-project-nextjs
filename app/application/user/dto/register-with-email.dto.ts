import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { Password } from '@/domain/user/value-objects/password';
import { z } from 'zod';

export const RegisterWithEmailRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
    password: z.string().transform(value => {
        return Password.create(value);
    }),
});

export type RegisterWithEmailRequestObject = z.infer<
    typeof RegisterWithEmailRequestSchema
>;

export const RegisterWithEmailResponseSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
    email: z.string().transform(value => {
        return Email.create(value);
    }),
});

export type RegisterWithEmailResponseObject = z.infer<
    typeof RegisterWithEmailRequestSchema
>;
