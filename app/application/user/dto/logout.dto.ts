import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface LogoutRequestDto {
    id: string;
}

export const LogoutRequestSchema = z.object({
    id: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export type LogoutRequestObject = z.infer<typeof LogoutRequestSchema>;
