import { EntityId } from '@domain/shared/value-objects/entity-id';

export class FriendId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): FriendId {
        return new FriendId(value);
    }

    static generate(): FriendId {
        return new FriendId(EntityId._generateUuid());
    }

    equals(friendId: FriendId): boolean {
        if (!(friendId instanceof FriendId)) {
            return false;
        }

        return this.value === friendId.value;
    }
}
