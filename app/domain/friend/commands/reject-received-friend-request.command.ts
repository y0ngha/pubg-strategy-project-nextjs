import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';

export class RejectReceivedFriendRequestCommand {
    private constructor(
        public readonly friendId: FriendId,
        private readonly currentStatus: FriendStatus
    ) {
        this.ensureFriendStatusUpdateAvailable();
    }

    static create(friendId: FriendId, currentStatus: FriendStatus) {
        return new RejectReceivedFriendRequestCommand(friendId, currentStatus);
    }

    private ensureFriendStatusUpdateAvailable() {
        if (this.currentStatus !== FriendStatus.PENDING) {
            throw new FriendUpdateInvalidStatus(this.currentStatus);
        }
    }
}
