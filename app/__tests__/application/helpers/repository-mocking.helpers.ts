import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';

export function getFriendRepositoryMocking(): jest.Mocked<FriendRepositoryPort> {
    return {
        save: jest.fn(),
        delete: jest.fn(),
        existsFriendBetween: jest.fn(),
        findById: jest.fn(),
        findAcceptedFriendsByUserId: jest.fn(),
        findReceivedFriendRequestsByRecipientUserId: jest.fn(),
        findSentFriendRequestsByRequesterUserId: jest.fn(),
    };
}

export function getUserQueryRepositoryMocking(): jest.Mocked<UserQueryRepositoryPort> {
    return {
        findByUserId: jest.fn(),
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
