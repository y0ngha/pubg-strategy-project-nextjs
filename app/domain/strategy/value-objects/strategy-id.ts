import { EntityId } from '@domain/shared/value-objects/entity-id';

export class StrategyId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): StrategyId {
        EntityId.validateEntityId(value);
        return new StrategyId(value);
    }

    static reconstruct(value: string): StrategyId {
        return new StrategyId(value);
    }

    static generate(): StrategyId {
        return new StrategyId(EntityId.generateUuid());
    }

    equals(strategyId: StrategyId): boolean {
        if (!(strategyId instanceof StrategyId)) {
            return false;
        }

        return this.value === strategyId.value;
    }
}
