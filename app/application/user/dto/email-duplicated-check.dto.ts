import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export const EmailDuplicatedCheckRequestSchema = z.object({
    email: z.email('유효하지 않은 이메일 형식입니다.').transform(value => {
        return Email.create(value);
    }),
});

export type EmailDuplicatedCheckRequestObject = z.infer<
    typeof EmailDuplicatedCheckRequestSchema
>;
