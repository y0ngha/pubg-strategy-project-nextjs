import { EntityId } from '@domain/shared/value-objects/entity-id';

export class WaypointId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): WaypointId {
        EntityId.validateEntityId(value);
        return new WaypointId(value);
    }

    static reconstruct(value: string): WaypointId {
        return new WaypointId(value);
    }

    static generate(): WaypointId {
        return new WaypointId(EntityId.generateUuid());
    }

    equals(waypointId: WaypointId): boolean {
        if (!(waypointId instanceof WaypointId)) {
            return false;
        }

        return this.value === waypointId.value;
    }
}
