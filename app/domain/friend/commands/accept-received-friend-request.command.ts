import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';

export class AcceptReceivedFriendRequestCommand {
    private constructor(public readonly friendId: FriendId) {}

    static create(friendId: FriendId, currentStatus: FriendStatus) {
        this.ensureFriendStatusUpdateAvailable(currentStatus);

        return new AcceptReceivedFriendRequestCommand(friendId);
    }

    private static ensureFriendStatusUpdateAvailable(status: FriendStatus) {
        if (status !== FriendStatus.PENDING) {
            throw new FriendUpdateInvalidStatus(status);
        }
    }
}
