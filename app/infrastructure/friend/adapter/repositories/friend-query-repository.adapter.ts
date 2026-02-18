import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Friend } from '@domain/friend/models/friend.model';

export class FriendQueryRepositoryAdapter extends FriendQueryRepositoryPort {
    existsFriendBetween(userId1: UserId, userId2: UserId): Promise<boolean> {
        throw new Error('Not Implemented.');
    }

    findAcceptedFriendsByUserId(userId: UserId): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findById(id: FriendId): Promise<Friend | null> {
        throw new Error('Not Implemented.');
    }

    findReceivedFriendRequestsByRecipientUserId(
        userId: UserId
    ): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findSentFriendRequestsByRequesterUserId(userId: UserId): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }
}
