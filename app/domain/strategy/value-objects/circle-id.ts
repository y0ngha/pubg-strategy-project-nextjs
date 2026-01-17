import { EntityId } from '@domain/shared/value-objects/entity-id';

export class CircleId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): CircleId {
        EntityId.validateEntityId(value);
        return new CircleId(value);
    }

    static reconstruct(value: string): CircleId {
        return new CircleId(value);
    }

    static generate(): CircleId {
        return new CircleId(EntityId.generateUuid());
    }

    equals(circleId: CircleId): boolean {
        if (!(circleId instanceof CircleId)) {
            return false;
        }

        return this.value === circleId.value;
    }
}
