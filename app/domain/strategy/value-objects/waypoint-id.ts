import { EntityId } from '@domain/shared/value-objects/entity-id';

export class WaypointId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): WaypointId {
        return new WaypointId(value);
    }

    static generate(): WaypointId {
        return new WaypointId(EntityId._generateUuid());
    }

    equals(waypointId: WaypointId): boolean {
        if (!(waypointId instanceof WaypointId)) {
            return false;
        }

        return this.value === waypointId.value;
    }
}
