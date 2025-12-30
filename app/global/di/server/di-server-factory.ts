import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';
import {
    injectServerEnvironmentClassAutomaticDependencies,
    injectServerEnvironmentValueAutomaticDependencies,
} from './server-auto-inject';
import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/driven/password-cipher.adapter';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { UserRepositoryAdapter } from '@/infrastructure/user/adapter/driven/user-repository.adapter';
import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { AuthenticationServiceAdapter } from '@/infrastructure/user/adapter/driven/authentication-service.adapter';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';

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
