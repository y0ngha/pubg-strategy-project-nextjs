import { FriendId } from '@domain/friend/value-objects/friend-id';
import { Friend } from '@domain/friend/models/friend.model';

export abstract class FriendQueryRepositoryPort {
    abstract findById(id: FriendId): Promise<Friend | null>;

    abstract findAcceptedFriendsByUserId(): Promise<Friend[]>;

    abstract findReceivedFriendRequestsByRecipientUserId(): Promise<Friend[]>;

    abstract findSentFriendRequestsByRequesterUserId(): Promise<Friend[]>;
}
