import { EntityId } from '@domain/shared/value-objects/entity-id';

export class FriendId extends EntityId {
    private readonly _value: string;

    private constructor(value: string) {
        super(value);
        this._value = value;
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

        return this._value === friendId._value;
    }
}
