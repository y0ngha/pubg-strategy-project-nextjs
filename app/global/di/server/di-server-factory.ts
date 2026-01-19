import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { AuthenticationServiceAdapter } from '@/infrastructure/user/adapter/driven/authentication-service.adapter';
import { GoogleAuthServiceAdapter } from '@/infrastructure/user/adapter/driven/google-auth-service.adapter';
import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/driven/password-cipher.adapter';
import { UserRepositoryAdapter } from '@/infrastructure/user/adapter/driven/user-repository.adapter';
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
import { CheckEmailDuplicateUsecase } from '@/application/user/use-cases/check-email-duplicate.usecase';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { FriendRepositoryAdapter } from '@infrastructure/friend/adapter/driven/friend-repository.adapter';
import { CancelSentFriendshipUseCase } from '@/application/friend/use-cases/cancel-sent-friendship.usecase';
import { AcceptReceivedFriendshipUseCase } from '@/application/friend/use-cases/accept-received-friendship.usecase';
import { GetFriendshipListUseCase } from '@/application/friend/use-cases/get-friendship-list.usecase';
import { RejectReceivedFriendshipUseCase } from '@/application/friend/use-cases/reject-received-friendship.usecase';
import { RequestFriendshipUseCase } from '@/application/friend/use-cases/request-friendship.usecase';
import { StrategyRepositoryAdapter } from '@infrastructure/strategy/adapter/driven/strategy-repository.adapter';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
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
import { UpdateStrategySharePermissionUseCase } from '@/application/strategy/use-cases/share/update-strategy-share-permission.usecase';
import { CreateTagUseCase } from '@/application/strategy/use-cases/tag/create-tag.usecase';
import { DeleteTagUseCase } from '@/application/strategy/use-cases/tag/delete-tag.usecase';
import { UpdateTagUseCase } from '@/application/strategy/use-cases/tag/update-tag.usecase';
import { AddTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/add-team-player.usecase';
import { DeleteTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/delete-team-player.usecase';
import { MoveTeamPlayerUseCase } from '@/application/strategy/use-cases/team-player/move-team-player.usecase';
import { AddWaypointUseCase } from '@/application/strategy/use-cases/waypoint/add-waypoint.usecase';
import { DeleteWaypointUseCase } from '@/application/strategy/use-cases/waypoint/delete-waypoint.usecase';
import { UpdateWaypointUseCase } from '@/application/strategy/use-cases/waypoint/update-waypoint.usecase';

/**
 * User
 */
const userRepositories: ClassDependency[] = [
    {
        class: UserRepositoryAdapter,
        abstract: UserRepositoryPort,
    },
];
const userServices: ClassDependency[] = [
    {
        class: PasswordCipherAdapter,
        abstract: PasswordCipherPort,
    },
    {
        class: PasswordValidatorService,
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
    { class: CheckEmailDuplicateUsecase },
    { class: WithdrawalUseCase },
];

/**
 * Friend
 */
const friendRepositories: ClassDependency[] = [
    {
        class: FriendRepositoryAdapter,
        abstract: FriendRepositoryPort,
    },
];
const friendUseCases: ClassDependency[] = [
    { class: AcceptReceivedFriendshipUseCase },
    { class: CancelSentFriendshipUseCase },
    { class: GetFriendshipListUseCase },
    { class: RejectReceivedFriendshipUseCase },
    { class: RequestFriendshipUseCase },
];

/**
 * Strategy
 */
const strategyRepositories: ClassDependency[] = [
    {
        class: StrategyRepositoryAdapter,
        abstract: StrategyRepositoryPort,
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
];

const dependencyInjectedClasses: ClassDependency[] = [
    ...userRepositories,
    ...userServices,
    ...userUseCases,
    ...friendRepositories,
    ...friendUseCases,
    ...strategyRepositories,
    ...strategyUseCases,
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
