import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';
import { FriendId } from '@domain/friend/value-objects/friend-id';

export interface CancelSentFriendshipRequestDto {
    id: string;
    userId: string;
}

export const CancelSentFriendshipRequestSchema = z.object({
    id: z.string().transform(value => {
        return FriendId.create(value);
    }),
    userId: z.string().transform(value => {
        return UserId.create(value);
    }),
});
