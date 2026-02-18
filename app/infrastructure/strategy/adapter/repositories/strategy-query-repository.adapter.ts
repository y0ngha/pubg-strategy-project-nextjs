import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';

export class StrategyQueryRepositoryAdapter extends StrategyQueryRepositoryPort {
    findById(id: StrategyId): Promise<Strategy | null> {
        throw new Error('Not Implemented.');
    }

    findOwnedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }> {
        throw new Error('Not Implemented.');
    }

    findSharedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }> {
        throw new Error('Not Implemented.');
    }
}
