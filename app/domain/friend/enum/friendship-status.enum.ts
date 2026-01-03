export const FriendshipStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
} as const;

export type FriendshipStatus =
    (typeof FriendshipStatus)[keyof typeof FriendshipStatus];

export const FriendshipStatusLabels: Record<FriendshipStatus, string> = {
    [FriendshipStatus.PENDING]: '대기중',
    [FriendshipStatus.ACCEPTED]: '수락됨',
    [FriendshipStatus.REJECTED]: '거절됨',
};
