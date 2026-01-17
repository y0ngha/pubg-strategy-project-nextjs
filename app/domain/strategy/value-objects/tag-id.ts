import { EntityId } from '@domain/shared/value-objects/entity-id';

export class TagId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): TagId {
        EntityId.validateEntityId(value);
        return new TagId(value);
    }

    static reconstruct(value: string): TagId {
        return new TagId(value);
    }

    static generate(): TagId {
        return new TagId(EntityId.generateUuid());
    }

    equals(tagId: TagId): boolean {
        if (!(tagId instanceof TagId)) {
            return false;
        }

        return this.value === tagId.value;
    }
}
