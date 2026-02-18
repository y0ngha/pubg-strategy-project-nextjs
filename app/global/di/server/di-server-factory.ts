import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { AuthenticationServiceAdapter } from '@/infrastructure/user/adapter/driven/authentication-service.adapter';
import { GoogleAuthServiceAdapter } from '@/infrastructure/user/adapter/driven/google-auth-service.adapter';
import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/driven/password-cipher.adapter';
import { UserQueryRepositoryAdapter } from '@infrastructure/user/adapter/repositories/user-query-repository.adapter';
import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';
import {
    injectServerEnvironmentClassAutomaticDependencies,
    injectServerEnvironmentValueAutomaticDependencies,
} from './server-auto-inject';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { LogoutUseCase } from '@/application/user/use-cases/logout.usecase';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';
import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import {
    FriendQueryRepositoryAdapter
} from '@infrastructure/friend/adapter/repositories/friend-query-repository.adapter';
import { CancelSentFriendUseCase } from '@/application/friend/use-cases/cancel-sent-friend.usecase';
import { AcceptReceivedFriendUseCase } from '@/application/friend/use-cases/accept-received-friend.usecase';
import { GetFriendListUseCase } from '@/application/friend/use-cases/get-friend-list.usecase';
import { RejectReceivedFriendUseCase } from '@/application/friend/use-cases/reject-received-friend.usecase';
import { RequestFriendUseCase } from '@/application/friend/use-cases/request-friend.usecase';
import {
    StrategyQueryRepositoryAdapter
} from '@infrastructure/strategy/adapter/repositories/strategy-query-repository.adapter';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';
import { AddAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/add-airplane-path.usecase';
import { DeleteAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/delete-airplane-path.usecase';
import { UpdateAirplanePathUseCase } from '@/application/strategy/use-cases/airplane-path/update-airplane-path.usecase';
import { CreateCircleUseCase } from '@/application/strategy/use-cases/circle/create-circle.usecase';
import { DeleteCircleUseCase } from '@/application/strategy/use-cases/circle/delete-circle.usecase';
import { UpdateCircleUseCase } from '@/application/strategy/use-cases/circle/update-circle.usecase';
import { CreateCommentUseCase } from '@/application/strategy/use-cases/comment/create-comment.usecase';
import { DeleteCommentUseCase } from '@/application/strategy/use-cases/comment/delete-comment.usecase';
import { UpdateCommentUseCase } from '@/application/strategy/use-cases/comment/update-comment.usecase';
import { AddEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/add-enemy-team.usecase';
import { DeleteEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/delete-enemy-team.usecase';
import { UpdateEnemyTeamUseCase } from '@/application/strategy/use-cases/enemy-team/update-enemy-team.usecase';
import { AddMarkerUseCase } from '@/application/strategy/use-cases/marker/add-marker.usecase';
import { DeleteMarkerUseCase } from '@/application/strategy/use-cases/marker/delete-marker.usecase';
import { UpdateMarkerUseCase } from '@/application/strategy/use-cases/marker/update-marker.usecase';
import { CreateStrategyShareUseCase } from '@/application/strategy/use-cases/share/create-strategy-share.usecase';
import { RevokeStrategyShareUseCase } from '@/application/strategy/use-cases/share/revoke-strategy-share.usecase';
import {
    UpdateStrategySharePermissionUseCase
} from '@/application/strategy/use-cases/share/update-strategy-share-permission.usecase';
import { CreateTagUseCase } from '@/application/strategy/use-cases/tag/create-tag.usecase';
import { DeleteTagUseCase } from '@/application/strategy/use-cases/tag/delete-tag.usecase';
import { UpdateTagUseCase } from '@/application/strategy/use-cases/tag/update-tag.usecase';
import { AddTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/add-team-player.usecase';
import { DeleteTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/delete-team-player.usecase';
import { MoveTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/move-team-player.usecase';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';
import { DeleteWaypointUseCase } from '@/application/strategy/use-cases/waypoint/delete-waypoint.usecase';
import { UpdateWaypointUseCase } from '@/application/strategy/use-cases/waypoint/update-waypoint.usecase';
import { GetOwnedStrategiesUseCase } from '@/application/strategy/use-cases/get-owned-strategies.usecase';
import { GetSharedStrategiesUseCase } from '@/application/strategy/use-cases/get-shared-strategies.usecase';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { CreateStrategyUseCase } from '@/application/strategy/use-cases/create-strategy.usecase';
import { DeleteStrategyUseCase } from '@/application/strategy/use-cases/delete-strategy.usecase';
import { GetStrategyUseCase } from '@/application/strategy/use-cases/get-strategy.usecase';
import { UpdateStrategyUseCase } from '@/application/strategy/use-cases/update-strategy.usecase';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { PasswordValidatorAdapter } from '@infrastructure/user/adapter/driving/password-validator.adapter';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import {
    UserCommandRepositoryAdapter
} from '@infrastructure/user/adapter/repositories/user-command-repository.adapter';
import {
    FriendCommandRepositoryAdapter
} from '@infrastructure/friend/adapter/repositories/friend-command-repository.adapter';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import {
    StrategyCommandRepositoryAdapter
} from '@infrastructure/strategy/adapter/repositories/strategy-command-repository.adapter';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';

/**
 * User
 */
const userRepositories: ClassDependency[] = [
    {
        class: UserQueryRepositoryAdapter,
        abstract: UserQueryRepositoryPort,
    },
    {
        class: UserCommandRepositoryAdapter,
        abstract: UserCommandRepositoryPort,
    },
];
const userServices: ClassDependency[] = [
    {
        class: PasswordCipherAdapter,
        abstract: PasswordCipherPort,
    },
    {
        class: PasswordValidatorAdapter,
        abstract: PasswordValidatorPort,
    },
    {
        class: AuthenticationServiceAdapter,
        abstract: AuthenticationServicePort,
    },
    {
        class: GoogleAuthServiceAdapter,
        abstract: GoogleAuthServicePort,
    },
];
const userUseCases: ClassDependency[] = [
    { class: ChangePasswordUseCase },
    { class: GetCurrentUserUseCase },
    { class: LoginWithEmailUseCase },
    { class: LoginWithGoogleUseCase },
    { class: LogoutUseCase },
    { class: RegisterWithEmailUseCase },
    { class: WithdrawalUseCase },
];

/**
 * Friend
 */
const friendRepositories: ClassDependency[] = [
    {
        class: FriendQueryRepositoryAdapter,
        abstract: FriendQueryRepositoryPort,
    },
    {
        class: FriendCommandRepositoryAdapter,
        abstract: FriendCommandRepositoryPort,
    },
];
const friendUseCases: ClassDependency[] = [
    { class: AcceptReceivedFriendUseCase },
    { class: CancelSentFriendUseCase },
    { class: GetFriendListUseCase },
    { class: RejectReceivedFriendUseCase },
    { class: RequestFriendUseCase },
];

/**
 * Strategy
 */
const strategyRepositories: ClassDependency[] = [
    {
        class: StrategyQueryRepositoryAdapter,
        abstract: StrategyQueryRepositoryPort,
    },
    {
        class: StrategyCommandRepositoryAdapter,
        abstract: StrategyCommandRepositoryPort,
    },
];
const strategyUseCases: ClassDependency[] = [
    { class: AddAirplanePathUseCase },
    { class: DeleteAirplanePathUseCase },
    { class: UpdateAirplanePathUseCase },
    { class: CreateCircleUseCase },
    { class: DeleteCircleUseCase },
    { class: UpdateCircleUseCase },
    { class: CreateCommentUseCase },
    { class: DeleteCommentUseCase },
    { class: UpdateCommentUseCase },
    { class: AddEnemyTeamUseCase },
    { class: DeleteEnemyTeamUseCase },
    { class: UpdateEnemyTeamUseCase },
    { class: AddMarkerUseCase },
    { class: DeleteMarkerUseCase },
    { class: UpdateMarkerUseCase },
    { class: CreateStrategyShareUseCase },
    { class: RevokeStrategyShareUseCase },
    { class: UpdateStrategySharePermissionUseCase },
    { class: CreateTagUseCase },
    { class: DeleteTagUseCase },
    { class: UpdateTagUseCase },
    { class: AddTeamPlayerUseCase },
    { class: DeleteTeamPlayerUseCase },
    { class: MoveTeamPlayerUseCase },
    { class: AddWaypointUseCase },
    { class: DeleteWaypointUseCase },
    { class: UpdateWaypointUseCase },
    { class: GetOwnedStrategiesUseCase },
    { class: GetSharedStrategiesUseCase },
    { class: CreateStrategyUseCase },
    { class: DeleteStrategyUseCase },
    { class: GetStrategyUseCase },
    { class: UpdateStrategyUseCase },
];
const strategyServices: ClassDependency[] = [{ class: StrategyMapper }];

const dependencyInjectedClasses: ClassDependency[] = [
    ...userRepositories,
    ...userServices,
    ...userUseCases,
    ...friendRepositories,
    ...friendUseCases,
    ...strategyRepositories,
    ...strategyUseCases,
    ...strategyServices,
];

const dependencyInjectedValues: ValueDependency = {} as const;

export function createServerRequestContainer(): Container {
    if (typeof window !== 'undefined') {
        throw new Error(
            '[createServerRequestContainer] 클라이언트 환경에서는 사용할 수 없는 코드입니다.'
        );
    }

    const container = new Container();

    injectServerEnvironmentClassAutomaticDependencies(
        dependencyInjectedClasses,
        container
    );
    injectServerEnvironmentValueAutomaticDependencies(
        dependencyInjectedValues,
        container
    );

    return container;
}
