import { FriendStatus } from '@domain/friend/enum/friend-status.enum';

export interface GetFriendResponseDto {
    id: string;
    status: FriendStatus;
    statusLabel: string;
    displayEmail: string;
}

export interface GetFriendListResponseDto {
    friends: GetFriendResponseDto[];
    receivedFriendRequests: GetFriendResponseDto[];
    sentFriendRequests: GetFriendResponseDto[];
    friendCount: number;
    receivedFriendRequestCount: number;
}
