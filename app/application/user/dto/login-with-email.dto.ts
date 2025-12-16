import { Email } from '@/domain/shared/value-objects/email';
import { Password } from '@/domain/user/value-objects/password';
import { z } from 'zod';

export const LoginWithEmailRequestSchema = z.object({
    email: z.email('유효하지 않은 이메일 형식입니다.').transform(value => {
        return Email.create(value);
    }),
    password: z.string().transform(value => {
        return Password.create(value);
    }),
});

export type LoginWithEmailRequestObject = z.infer<typeof LoginWithEmailRequestSchema>;
