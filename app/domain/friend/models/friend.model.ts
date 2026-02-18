export interface Friend {
    readonly id: string;
    readonly requesterUserId: string;
    readonly recipientUserId: string;
    readonly status: string;
    readonly requesterUserEmail: string;
    readonly recipientUserEmail: string;
    readonly requestedAt: Date;
    readonly respondedAt: Date | null;
}
