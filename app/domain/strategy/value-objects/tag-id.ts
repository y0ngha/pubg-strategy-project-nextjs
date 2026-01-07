import { EntityId } from '@domain/shared/value-objects/entity-id';

export class TagId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): TagId {
        return new TagId(value);
    }

    static generate(): TagId {
        return new TagId(EntityId._generateUuid());
    }

    equals(tagId: TagId): boolean {
        if (!(tagId instanceof TagId)) {
            return false;
        }

        return this.value === tagId.value;
    }
}
