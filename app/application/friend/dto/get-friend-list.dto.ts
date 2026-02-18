import { FriendStatus } from '@domain/friend/enum/friend-status.enum';

export interface GetFriendResponseDto {
    id: string;
    requesterUserId: string;
    recipientUserId: string;
    status: FriendStatus;
    statusLabel: string;
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
