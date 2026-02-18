import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';

export function getFriendQueryRepositoryMocking(): jest.Mocked<FriendQueryRepositoryPort> {
    return {
        existsFriendBetween: jest.fn(),
        findById: jest.fn(),
        findAcceptedFriendsByUserId: jest.fn(),
        findReceivedFriendRequestsByRecipientUserId: jest.fn(),
        findSentFriendRequestsByRequesterUserId: jest.fn(),
    };
}

export function getFriendCommandRepositoryMocking(): jest.Mocked<FriendCommandRepositoryPort> {
    return {
        accept: jest.fn(),
        reject: jest.fn(),
        cancel: jest.fn(),
        request: jest.fn(),
    };
}

export function getUserQueryRepositoryMocking(): jest.Mocked<UserQueryRepositoryPort> {
    return {
        findByUserId: jest.fn(),
        findByAccessToken: jest.fn(),
    };
}

export function getUserCommandRepositoryMocking(): jest.Mocked<UserCommandRepositoryPort> {
    return {
        changePassword: jest.fn(),
        registerWithEmail: jest.fn(),
        registerWithGoogle: jest.fn(),
        withdrawal: jest.fn(),
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
