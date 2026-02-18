import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { Friend } from '@domain/friend/models/friend.model';

export class FriendQueryRepositoryAdapter extends FriendQueryRepositoryPort {
    findAcceptedFriendsByUserId(): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findById(id: FriendId): Promise<Friend | null> {
        throw new Error('Not Implemented.');
    }

    findReceivedFriendRequestsByRecipientUserId(): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }

    findSentFriendRequestsByRequesterUserId(): Promise<Friend[]> {
        throw new Error('Not Implemented.');
    }
}
