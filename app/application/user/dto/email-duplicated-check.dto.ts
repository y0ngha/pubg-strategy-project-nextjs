import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export interface EmailDuplicatedCheckRequestDto {
    email: string;
}

export const EmailDuplicatedCheckRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
});

export type EmailDuplicatedCheckRequestObject = z.infer<
    typeof EmailDuplicatedCheckRequestSchema
>;
