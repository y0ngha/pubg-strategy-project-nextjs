export const FriendStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    CANCELED: 'CANCELED',
} as const;

export type FriendStatus = (typeof FriendStatus)[keyof typeof FriendStatus];

export const FriendStatusLabels: Record<FriendStatus, string> = {
    [FriendStatus.PENDING]: '대기중',
    [FriendStatus.ACCEPTED]: '수락됨',
    [FriendStatus.REJECTED]: '거절됨',
    [FriendStatus.CANCELED]: '요청 취소됨',
};
