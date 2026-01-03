import { EntityId } from '@domain/shared/value-objects/entity-id';
import { randomUUID } from 'node:crypto';

export class UserId extends EntityId {
    private readonly _value: string;

    constructor(value: string) {
        super(value);
        this._value = value;
    }

    static create(value: string): UserId {
        if (!value || value.trim().length === 0) {
            throw new Error('User ID는 빈 값일 수 없습니다.');
        }

        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new Error('User ID는 UUIDv4 형식이어야 합니다.');
        }

        return new UserId(value);
    }

    static generate(): EntityId {
        return new UserId(randomUUID());
    }

    equals(userId: UserId): boolean {
        if (!(userId instanceof UserId)) {
            return false;
        }

        return this._value === userId._value;
    }
}
