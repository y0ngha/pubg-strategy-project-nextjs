import { EntityId } from '@domain/shared/value-objects/entity-id';
import { randomUUID } from 'crypto';

export class FriendId extends EntityId {
    private readonly _value: string;

    constructor(value: string) {
        super(value);
        this._value = value;
    }

    static create(value: string): FriendId {
        if (!value || value.trim().length === 0) {
            throw new Error('Friend ID는 빈 값일 수 없습니다.');
        }

        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new Error('Friend ID는 UUIDv4 형식이어야 합니다.');
        }

        return new FriendId(value);
    }

    static generate(): EntityId {
        return new FriendId(randomUUID());
    }

    equals(friendId: FriendId): boolean {
        if (!(friendId instanceof FriendId)) {
            return false;
        }

        return this._value === friendId._value;
    }
}
