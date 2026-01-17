import { FriendId } from '@domain/friend/value-objects/friend-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendshipStatus } from '@domain/friend/enum/friendship-status.enum';
import { Email } from '@domain/shared/value-objects/email';
import {
    FriendshipUpdateInvalidPermission,
    FriendshipUpdateInvalidStatus,
} from '@domain/friend/exceptions/friend.exceptions';

export class Friend {
    private constructor(
        public readonly id: FriendId,
        public readonly requesterUserId: UserId,
        public readonly recipientUserId: UserId,
        private _status: FriendshipStatus,
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
            FriendshipStatus.PENDING,
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
        status: FriendshipStatus,
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

        this.ensureFriendshipStatusUpdateAvailable();

        this._status = FriendshipStatus.ACCEPTED;
        this._respondedAt = new Date();
    }

    reject(userId: UserId) {
        this.ensureRecipientAuthority(userId);

        this.ensureFriendshipStatusUpdateAvailable();

        this._status = FriendshipStatus.REJECTED;
        this._respondedAt = new Date();
    }

    cancel(userId: UserId) {
        this.ensureRequesterAuthority(userId);

        this.ensureFriendshipStatusUpdateAvailable();

        this._status = FriendshipStatus.CANCELED;
    }

    private ensureRequesterAuthority(userId: UserId) {
        if (!this.requesterUserId.equals(userId)) {
            throw new FriendshipUpdateInvalidPermission();
        }
    }

    private ensureRecipientAuthority(userId: UserId) {
        if (!this.recipientUserId.equals(userId)) {
            throw new FriendshipUpdateInvalidPermission();
        }
    }

    private ensureFriendshipStatusUpdateAvailable() {
        if (this._status !== FriendshipStatus.PENDING) {
            throw new FriendshipUpdateInvalidStatus(this._status);
        }
    }
}
