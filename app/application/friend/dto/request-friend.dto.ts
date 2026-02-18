import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface RequestFriendRequestDto {
    recipientUserId: string;
}

export const RequestFriendRequestSchema = z.object({
    recipientUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
