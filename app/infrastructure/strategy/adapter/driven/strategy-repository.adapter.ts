import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';

export class StrategyRepositoryAdapter extends StrategyRepositoryPort {
    delete(id: StrategyId): Promise<void> {
        throw new Error('Not Implemented.');
    }

    findById(id: StrategyId): Promise<Strategy | null> {
        throw new Error('Not Implemented.');
    }

    save(strategy: Strategy): Promise<void> {
        throw new Error('Not Implemented.');
    }

    findOwnedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<Strategy[]> {
        throw new Error('Not Implemented.');
    }

    findSharedStrategiesByUserID(
        userId: UserId,
        page: number,
        limit: number
    ): Promise<Strategy[]> {
        throw new Error('Not Implemented.');
    }
}
