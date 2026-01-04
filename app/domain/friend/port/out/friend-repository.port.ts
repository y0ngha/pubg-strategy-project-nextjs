import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendId } from '@domain/friend/value-objects/friend-id';

export abstract class FriendRepositoryPort {
    abstract save(friend: Friend): Promise<void>;

    abstract delete(id: FriendId): Promise<void>;

    abstract findById(id: FriendId): Promise<Friend | null>;

    abstract findByUserId(id: UserId): Promise<Friend | null>;

    abstract findFriendsByUserId(userId: UserId): Promise<Friend[]>;

    abstract findReceivedRequests(userId: UserId): Promise<Friend[]>;

    abstract findSentRequests(userId: UserId): Promise<Friend[]>;
}
