import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { jest } from '@jest/globals';

export function getFriendQueryRepositoryMocking(): jest.Mocked<FriendQueryRepositoryPort> {
    return {
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

export function getStrategyQueryRepositoryMocking(): jest.Mocked<StrategyQueryRepositoryPort> {
    return {
        findById: jest.fn(),
        findOwnedStrategiesByUserID: jest.fn(),
        findSharedStrategiesByUserID: jest.fn(),
    };
}

export function getStrategyCommandRepositoryMocking(): jest.Mocked<StrategyCommandRepositoryPort> {
    return {
        createMarker: jest.fn(),
        deleteMarker: jest.fn(),
        updateMarkerPosition: jest.fn(),
        createEnemyTeam: jest.fn(),
        deleteEnemyTeam: jest.fn(),
        updateEnemyTeamLabel: jest.fn(),
        updateEnemyTeamPosition: jest.fn(),
    };
}
