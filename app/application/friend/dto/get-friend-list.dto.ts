import { UserId } from '@/domain/shared/value-objects/user-id';
import { z } from 'zod';

export interface GetFriendListRequestDto {
    userId: string;
}

export const GetFriendListRequestSchema = z.object({
    userId: z.string().transform(value => {
        return UserId.create(value);
    }),
});

export interface GetFriendResponseDto {
    id: string;
    requesterUserId: string;
    recipientUserId: string;
    status: string;
    requesterUserEmail: string;
    recipientUserEmail: string;
}

export interface GetFriendListResponseDto {
    friends: GetFriendResponseDto[];
    receivedFriendRequests: GetFriendResponseDto[];
    sentFriendRequests: GetFriendResponseDto[];
    friendCount: number;
    receivedFriendRequestCount: number;
}
