import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface RequestFriendRequestDto {
    requesterUserId: string;
    recipientUserId: string;
}

export const RequestFriendRequestSchema = z.object({
    requesterUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
    recipientUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
