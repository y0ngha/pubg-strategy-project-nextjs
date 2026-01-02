import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export interface CheckEmailDuplicateRequestDto {
    email: string;
}

export const CheckEmailDuplicateRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
});

export type CheckEmailDuplicateRequestObject = z.infer<
    typeof CheckEmailDuplicateRequestSchema
>;
