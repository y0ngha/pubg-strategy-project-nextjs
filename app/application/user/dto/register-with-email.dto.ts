import { Email } from '@/domain/shared/value-objects/email';
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
    id: z.string(),
    email: z.string(),
});

export type RegisterWithEmailResponseObject = z.infer<
    typeof RegisterWithEmailResponseSchema
>;
