import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';

export function getFriendRepositoryMocking(): jest.Mocked<FriendRepositoryPort> {
    return {
        save: jest.fn(),
        delete: jest.fn(),
        existsFriendshipBetween: jest.fn(),
        findById: jest.fn(),
        findAcceptedFriendsByUserId: jest.fn(),
        findReceivedFriendshipRequestsByRecipientUserId: jest.fn(),
        findSentFriendshipRequestsByRequesterUserId: jest.fn(),
    };
}

export function getUserRepositoryMocking(): jest.Mocked<UserRepositoryPort> {
    return {
        save: jest.fn(),
        findByUserId: jest.fn(),
        delete: jest.fn(),
        existsByEmail: jest.fn(),
        findByAccessToken: jest.fn(),
    };
}

export function getStrategyRepositoryMocking(): jest.Mocked<StrategyRepositoryPort> {
    return {
        save: jest.fn(),
        delete: jest.fn(),
        findById: jest.fn(),
        findOwnedStrategiesByUserID: jest.fn(),
        findSharedStrategiesByUserID: jest.fn(),
    };
}
