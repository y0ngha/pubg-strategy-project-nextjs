import { z } from 'zod';
import { Email } from '@domain/shared/value-objects/email';

export interface RequestFriendRequestDto {
    email: string;
}

export const RequestFriendRequestSchema = z.object({
    email: z.string().transform(value => {
        return Email.create(value);
    }),
});
