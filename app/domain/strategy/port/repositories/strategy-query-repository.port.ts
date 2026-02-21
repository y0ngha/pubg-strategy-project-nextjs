import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Strategy } from '@domain/strategy/models/strategy.model';

export abstract class StrategyQueryRepositoryPort {
    abstract findById(id: StrategyId): Promise<Strategy | null>;

    abstract findOwnedStrategies(
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }>;

    abstract findSharedStrategies(
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }>;
}
