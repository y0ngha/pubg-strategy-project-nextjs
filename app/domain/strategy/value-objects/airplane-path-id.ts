import { EntityId } from '@domain/shared/value-objects/entity-id';

export class AirplanePathId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): AirplanePathId {
        return new AirplanePathId(value);
    }

    static generate(): AirplanePathId {
        return new AirplanePathId(EntityId._generateUuid());
    }

    equals(airplanePathId: AirplanePathId): boolean {
        if (!(airplanePathId instanceof AirplanePathId)) {
            return false;
        }

        return this.value === airplanePathId.value;
    }
}
