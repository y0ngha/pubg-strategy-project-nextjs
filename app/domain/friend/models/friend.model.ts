import { FriendStatus } from '@domain/friend/enum/friend-status.enum';

export interface Friend {
    readonly id: string;
    readonly requesterUserId: string;
    readonly recipientUserId: string;
    readonly status: FriendStatus;
    readonly requesterUserEmail: string;
    readonly recipientUserEmail: string;
    readonly requestedAt: Date;
    readonly respondedAt: Date | null;
    readonly displayEmail: string;
}
