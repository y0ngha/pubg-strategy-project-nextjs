import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export interface CheckEmailDupliacteRequestDto {
    email: string;
}

export const CheckEmailDupliacteRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
});

export type CheckEmailDupliacteRequestObject = z.infer<
    typeof CheckEmailDupliacteRequestSchema
>;
