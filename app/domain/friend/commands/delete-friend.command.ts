import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';

export class DeleteFriendCommand {
    private constructor(public readonly id: FriendId) {}

    static create(id: FriendId, currentStatus: FriendStatus) {
        this.ensureFriendStatusUpdateAvailable(currentStatus);

        return new DeleteFriendCommand(id);
    }

    private static ensureFriendStatusUpdateAvailable(status: FriendStatus) {
        if (status !== FriendStatus.ACCEPTED) {
            throw new FriendUpdateInvalidStatus();
        }
    }
}
