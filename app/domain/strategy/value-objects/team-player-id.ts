import { EntityId } from '@domain/shared/value-objects/entity-id';

export class TeamPlayerId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): TeamPlayerId {
        EntityId.validateEntityId(value);
        return new TeamPlayerId(value);
    }

    static reconstruct(value: string): TeamPlayerId {
        return new TeamPlayerId(value);
    }

    static generate(): TeamPlayerId {
        return new TeamPlayerId(EntityId.generateUuid());
    }

    equals(teamPlayerId: TeamPlayerId): boolean {
        if (!(teamPlayerId instanceof TeamPlayerId)) {
            return false;
        }

        return this.value === teamPlayerId.value;
    }
}
