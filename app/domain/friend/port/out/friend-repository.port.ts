import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendId } from '@domain/friend/value-objects/friend-id';

export abstract class FriendRepositoryPort {
    abstract save(friend: Friend): Promise<void>;

    abstract delete(id: FriendId): Promise<void>;

    abstract findById(id: FriendId): Promise<Friend | null>;

    abstract findAcceptedFriendsByUserId(userId: UserId): Promise<Friend[]>;

    abstract findReceivedFriendshipRequestsByRecipientUserId(
        userId: UserId
    ): Promise<Friend[]>;

    abstract findSentFriendshipRequestsByRequesterUserId(
        userId: UserId
    ): Promise<Friend[]>;
}
