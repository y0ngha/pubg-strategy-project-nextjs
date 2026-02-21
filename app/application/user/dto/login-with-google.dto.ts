import { Email } from '@/domain/shared/value-objects/email';
import { z } from 'zod';

export interface LoginWithGoogleRequestDto {
    email: string;
    googleToken: string;
}

export const LoginWithGoogleRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
    googleToken: z.string(),
});

export type LoginWithGoogleRequestObject = z.infer<
    typeof LoginWithGoogleRequestSchema
>;
