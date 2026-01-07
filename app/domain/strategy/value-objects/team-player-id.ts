import { EntityId } from '@domain/shared/value-objects/entity-id';

export class TeamPlayerId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): TeamPlayerId {
        return new TeamPlayerId(value);
    }

    static generate(): TeamPlayerId {
        return new TeamPlayerId(EntityId._generateUuid());
    }

    equals(teamPlayerId: TeamPlayerId): boolean {
        if (!(teamPlayerId instanceof TeamPlayerId)) {
            return false;
        }

        return this.value === teamPlayerId.value;
    }
}
