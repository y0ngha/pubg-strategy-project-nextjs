import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface RequestFriendshipRequestDto {
    requesterUserId: string;
    recipientUserId: string;
}

export const RequestFriendshipRequestSchema = z.object({
    requesterUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
    recipientUserId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
