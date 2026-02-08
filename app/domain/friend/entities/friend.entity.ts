import { FriendId } from '@domain/friend/value-objects/friend-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { Email } from '@domain/shared/value-objects/email';
import {
    FriendUpdateInvalidPermission,
    FriendUpdateInvalidStatus,
} from '@domain/friend/exceptions/friend.exceptions';

export class Friend {
    private constructor(
        public readonly id: FriendId,
        public readonly requesterUserId: UserId,
        public readonly recipientUserId: UserId,
        private _status: FriendStatus,
        public readonly requesterUserEmail: Email,
        public readonly recipientUserEmail: Email,
        public readonly requestedAt: Date,
        private _respondedAt: Date | null
    ) {}

    get status() {
        return this._status;
    }

    get respondedAt() {
        return this._respondedAt;
    }

    static create(
        requesterUserId: UserId,
        recipientUserId: UserId,
        requesterUserEmail: Email,
        recipientUserEmail: Email
    ) {
        return new Friend(
            FriendId.generate(),
            requesterUserId,
            recipientUserId,
            FriendStatus.PENDING,
            requesterUserEmail,
            recipientUserEmail,
            new Date(),
            null
        );
    }

    static reconstruct(
        id: FriendId,
        requesterUserId: UserId,
        recipientUserId: UserId,
        status: FriendStatus,
        requesterUserEmail: Email,
        recipientUserEmail: Email,
        requestedAt: Date,
        respondedAt: Date | null
    ) {
        return new Friend(
            id,
            requesterUserId,
            recipientUserId,
            status,
            requesterUserEmail,
            recipientUserEmail,
            requestedAt,
            respondedAt
        );
    }

    accept(userId: UserId) {
        this.ensureRecipientAuthority(userId);

        this.ensureFriendStatusUpdateAvailable();

        this._status = FriendStatus.ACCEPTED;
        this._respondedAt = new Date();
    }

    reject(userId: UserId) {
        this.ensureRecipientAuthority(userId);

        this.ensureFriendStatusUpdateAvailable();

        this._status = FriendStatus.REJECTED;
        this._respondedAt = new Date();
    }

    cancel(userId: UserId) {
        this.ensureRequesterAuthority(userId);

        this.ensureFriendStatusUpdateAvailable();

        this._status = FriendStatus.CANCELED;
    }

    private ensureRequesterAuthority(userId: UserId) {
        if (!this.requesterUserId.equals(userId)) {
            throw new FriendUpdateInvalidPermission();
        }
    }

    private ensureRecipientAuthority(userId: UserId) {
        if (!this.recipientUserId.equals(userId)) {
            throw new FriendUpdateInvalidPermission();
        }
    }

    private ensureFriendStatusUpdateAvailable() {
        if (this._status !== FriendStatus.PENDING) {
            throw new FriendUpdateInvalidStatus(this._status);
        }
    }
}
