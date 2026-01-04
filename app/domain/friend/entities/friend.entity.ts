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

    accept(userId: UserId) {
        this.verifyFriendshipStatusUpdatePermission(userId);

        this.verifyFriendshipStatusUpdateAvailable();

        this._status = FriendshipStatus.ACCEPTED;
        this._respondedAt = new Date();
    }

    reject(userId: UserId) {
        this.verifyFriendshipStatusUpdatePermission(userId);

        this.verifyFriendshipStatusUpdateAvailable();

        this._status = FriendshipStatus.REJECTED;
        this._respondedAt = new Date();
    }

    private verifyFriendshipStatusUpdatePermission(userId: UserId) {
        if (!this.recipientUserId.equals(userId)) {
            throw new FriendshipUpdateInvalidPermission();
        }
    }

    private verifyFriendshipStatusUpdateAvailable() {
        if (this._status !== FriendshipStatus.PENDING) {
            throw new FriendshipUpdateInvalidStatus(this._status);
        }
    }
}
