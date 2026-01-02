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

const dependencyInjectedClasses: ClassDependency[] = [
    {
        class: PasswordCipherAdapter,
        abstract: PasswordCipherPort,
    },
    {
        class: UserRepositoryAdapter,
        abstract: UserRepositoryPort,
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
    { class: ChangePasswordUseCase },
    { class: GetCurrentUserUseCase },
    { class: LoginWithEmailUseCase },
    { class: LoginWithGoogleUseCase },
    { class: LogoutUseCase },
    { class: RegisterWithEmailUseCase },
    { class: CheckEmailDuplicateUsecase },
    { class: WithdrawalUseCase },
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
