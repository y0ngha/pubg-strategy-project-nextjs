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
        public status: FriendshipStatus,
        public readonly requesterUserEmail: Email,
        public readonly recipientUserEmail: Email,
        public readonly requestedAt: Date,
        public respondedAt: Date | null
    ) {}

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

        this.status = FriendshipStatus.ACCEPTED;
        this.respondedAt = new Date();
    }

    reject(userId: UserId) {
        this.verifyFriendshipStatusUpdatePermission(userId);

        this.verifyFriendshipStatusUpdateAvailable();

        this.status = FriendshipStatus.REJECTED;
        this.respondedAt = new Date();
    }

    private verifyFriendshipStatusUpdatePermission(userId: UserId) {
        if (!this.recipientUserId.equals(userId)) {
            throw new FriendshipUpdateInvalidPermission();
        }
    }

    private verifyFriendshipStatusUpdateAvailable() {
        if (this.status !== FriendshipStatus.PENDING) {
            throw new FriendshipUpdateInvalidStatus(this.status);
        }
    }
}
