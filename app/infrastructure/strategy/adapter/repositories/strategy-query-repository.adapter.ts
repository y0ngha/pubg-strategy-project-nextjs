import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Strategy } from '@domain/strategy/entities/strategy.entity';

export class StrategyQueryRepositoryAdapter extends StrategyQueryRepositoryPort {
    findById(id: StrategyId): Promise<Strategy | null> {
        throw new Error('Not Implemented.');
    }

    findOwnedStrategies(
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }> {
        throw new Error('Not Implemented.');
    }

    findSharedStrategies(
        page: number,
        limit: number
    ): Promise<{
        hasNextPage: boolean;
        data: Strategy[];
    }> {
        throw new Error('Not Implemented.');
    }
}
