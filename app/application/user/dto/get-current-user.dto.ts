import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export const GetCurrentUserRequestSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export type GetCurrentUserRequestObject = z.infer<
    typeof GetCurrentUserRequestSchema
>;

export const GetCurrentUserResponseSchema = z.object({
    id: z.string(),
    password: z.string(),
    email: z.string(),
    authProvider: z.string(),
});

export type GetCurrentUserResponseObject = z.infer<
    typeof GetCurrentUserResponseSchema
>;
