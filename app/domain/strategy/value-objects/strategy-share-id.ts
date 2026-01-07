import { EntityId } from '@domain/shared/value-objects/entity-id';

export class StrategyShareId extends EntityId {
    private constructor(value: string) {
        super(value);
    }

    static create(value: string): StrategyShareId {
        return new StrategyShareId(value);
    }

    static generate(): StrategyShareId {
        return new StrategyShareId(EntityId._generateUuid());
    }

    equals(strategyShareId: StrategyShareId): boolean {
        if (!(strategyShareId instanceof StrategyShareId)) {
            return false;
        }

        return this.value === strategyShareId.value;
    }
}
