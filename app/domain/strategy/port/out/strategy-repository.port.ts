import { UserId } from '@domain/shared/value-objects/user-id';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export abstract class StrategyRepositoryPort {
    abstract save(strategy: Strategy): Promise<Strategy>;

    abstract delete(id: StrategyId): Promise<void>;

    abstract findById(id: StrategyId): Promise<Strategy | null>;

    abstract findOwnedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }>;

    abstract findSharedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }>;
}
