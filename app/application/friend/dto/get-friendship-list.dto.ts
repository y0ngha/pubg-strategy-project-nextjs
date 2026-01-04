import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface GetFriendshipListRequestDto {
    id: string;
}

export const GetFriendshipListRequestSchema = z.object({
    id: z.string().transform(value => {
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
