import { EntityId } from '@domain/shared/value-objects/entity-id';

export class EnemyTeamId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): EnemyTeamId {
        EntityId.validateEntityId(value);
        return new EnemyTeamId(value);
    }

    static reconstruct(value: string): EnemyTeamId {
        return new EnemyTeamId(value);
    }

    static generate(): EnemyTeamId {
        return new EnemyTeamId(EntityId.generateUuid());
    }

    equals(enemyTeamId: EnemyTeamId): boolean {
        if (!(enemyTeamId instanceof EnemyTeamId)) {
            return false;
        }

        return this.value === enemyTeamId.value;
    }
}
