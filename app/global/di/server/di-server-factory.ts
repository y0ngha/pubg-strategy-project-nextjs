import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';
import {
    injectServerEnvironmentClassAutomaticDependencies,
    injectServerEnvironmentValueAutomaticDependencies,
} from './server-auto-inject';
import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/password-cipher.adapter';
import { PasswordCipherPort } from '@/domain/user/port/password-cipher.port';
import { UserRepositoryAdapter } from '@/infrastructure/user/adapter/user.repository.adapter';
import { UserRepository } from '@/domain/user/port/user.repository';

const dependencyInjectedClasses: ClassDependency[] = [
    {
        class: PasswordCipherAdapter,
        abstract: PasswordCipherPort,
    },
    {
        class: UserRepositoryAdapter,
        abstract: UserRepository,
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
