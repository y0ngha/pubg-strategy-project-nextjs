import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { Friend } from '@domain/friend/models/friend.model';

export abstract class FriendQueryRepositoryPort {
    abstract existsFriendBetween(
        userId1: UserId,
        userId2: UserId
    ): Promise<boolean>;

    abstract findById(id: FriendId): Promise<Friend | null>;

    abstract findAcceptedFriendsByUserId(userId: UserId): Promise<Friend[]>;

    abstract findReceivedFriendRequestsByRecipientUserId(
        userId: UserId
    ): Promise<Friend[]>;

    abstract findSentFriendRequestsByRequesterUserId(
        userId: UserId
    ): Promise<Friend[]>;
}
