import { EntityId } from '@domain/shared/value-objects/entity-id';

export class MarkerId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): MarkerId {
        return new MarkerId(value);
    }

    static generate(): MarkerId {
        return new MarkerId(EntityId._generateUuid());
    }

    equals(markerId: MarkerId): boolean {
        if (!(markerId instanceof MarkerId)) {
            return false;
        }

        return this.value === markerId.value;
    }
}
