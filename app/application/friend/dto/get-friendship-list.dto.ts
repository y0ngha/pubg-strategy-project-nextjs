import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface GetFriendshipListRequestDto {
    userId: string;
}

export const GetFriendshipListRequestSchema = z.object({
    userId: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export interface GetFriendshipDisplayableDto {
    id: string;
    requesterUserId: string;
    recipientUserId: string;
    status: string;
    requesterUserEmail: string;
    recipientUserEmail: string;
}

export interface GetFriendshipListResponseDto {
    friends: GetFriendshipDisplayableDto[];
    receivedFriendshipRequests: GetFriendshipDisplayableDto[];
    sentFriendshipRequests: GetFriendshipDisplayableDto[];
}
