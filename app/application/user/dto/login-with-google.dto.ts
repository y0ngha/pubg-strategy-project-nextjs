import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export interface LoginWithGoogleRequestDto {
    email: string;
    token: string;
}

export const LoginWithGoogleRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
    token: z.string(),
});

export type LoginWithGoogleRequestObject = z.infer<
    typeof LoginWithGoogleRequestSchema
>;
