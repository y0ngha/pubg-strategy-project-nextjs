import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Friend } from '@domain/friend/entities/friend.entity';

export class FriendRepositoryAdapter extends FriendRepositoryPort {
    delete(id: FriendId): Promise<void> {
        throw new Error('Not Implemented.');
    }

    existsFriendshipBetween(
        userId1: UserId,
        userId2: UserId
    ): Promise<boolean> {
        throw new Error('Not Implemented.');
    }

    findAcceptedFriendsByUserId(userId: UserId): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findById(id: FriendId): Promise<Friend | null> {
        throw new Error('Not Implemented.');
    }

    findReceivedFriendshipRequestsByRecipientUserId(
        userId: UserId
    ): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findSentFriendshipRequestsByRequesterUserId(
        userId: UserId
    ): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    save(friend: Friend): Promise<void> {
        throw new Error('Not Implemented.');
    }
}
