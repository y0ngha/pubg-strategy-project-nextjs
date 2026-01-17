import { EntityId } from '@domain/shared/value-objects/entity-id';

export class StrategyShareId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): StrategyShareId {
        EntityId.validateEntityId(value);
        return new StrategyShareId(value);
    }

    static reconstruct(value: string): StrategyShareId {
        return new StrategyShareId(value);
    }

    static generate(): StrategyShareId {
        return new StrategyShareId(EntityId.generateUuid());
    }

    equals(strategyShareId: StrategyShareId): boolean {
        if (!(strategyShareId instanceof StrategyShareId)) {
            return false;
        }

        return this.value === strategyShareId.value;
    }
}
