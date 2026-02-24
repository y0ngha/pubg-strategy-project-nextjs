import { z } from 'zod';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';

export interface DeleteFriendDto {
    id: string;
    currentStatus: string;
}

export const DeleteFriendSchema = z.object({
    id: z.string().transform(value => {
        return FriendId.create(value);
    }),
    currentStatus: z.enum(FriendStatus),
});
