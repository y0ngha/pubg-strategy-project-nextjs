import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface GetCurrentUserRequestDto {
    id: string;
}

export const GetCurrentUserRequestSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export type GetCurrentUserRequestObject = z.infer<
    typeof GetCurrentUserRequestSchema
>;

export interface GetCurrentUserResponseDto {
    id: string;
    email: string;
}
