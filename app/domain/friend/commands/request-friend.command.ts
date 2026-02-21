import { UserId } from '@domain/shared/value-objects/user-id';

export class RequestFriendCommand {
    private constructor(public readonly recipientUserId: UserId) {}

    static create(recipientUserId: UserId) {
        return new RequestFriendCommand(recipientUserId);
    }
}
