import { EntityId } from '@domain/shared/value-objects/entity-id';

export class UserId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): UserId {
        EntityId.validateEntityId(value);
        return new UserId(value);
    }

    static reconstruct(value: string): UserId {
        return new UserId(value);
    }

    static generate(): UserId {
        return new UserId(EntityId.generateUuid());
    }

    equals(userId: UserId): boolean {
        if (!(userId instanceof UserId)) {
            return false;
        }

        return this.value === userId.value;
    }
}
