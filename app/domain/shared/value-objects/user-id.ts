import { EntityId } from '@domain/shared/value-objects/entity-id';

export class UserId extends EntityId {
    private readonly _value: string;

    private constructor(value: string) {
        super(value);
        this._value = value;
    }

    static create(value: string): UserId {
        return new UserId(value);
    }

    static generate(): UserId {
        return new UserId(EntityId._generateUuid());
    }

    equals(userId: UserId): boolean {
        if (!(userId instanceof UserId)) {
            return false;
        }

        return this._value === userId._value;
    }
}
