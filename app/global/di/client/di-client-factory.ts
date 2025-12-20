import { Container } from 'inversify';
import {
    injectClientEnvironmentClassAutomaticDependencies,
    injectClientEnvironmentValueAutomaticDependencies,
} from './client-auto-inject';
import { ClassDependency, ValueDependency } from '../types/di-types';
import { UserSessionAdapter } from '@/infrastructure/user/adapter/driving/user-session.adapter';
import { UserSessionPort } from '@/domain/user/port/in/user-session.port';

let container: Container | null = null;

const dependencyInjectedClasses: ClassDependency[] = [
    {
        class: UserSessionAdapter,
        abstract: UserSessionPort,
    },
];

const dependencyInjectedValues: ValueDependency = {} as const;

export function getClientContainer(): Container {
    if (typeof window === 'undefined') {
        throw new Error(
            '[getClientContainer] 서버 환경에서는 사용할 수 없는 코드입니다.'
        );
    }

    if (!container) {
        container = new Container();

        injectClientEnvironmentClassAutomaticDependencies(
            dependencyInjectedClasses,
            container
        );
        injectClientEnvironmentValueAutomaticDependencies(
            dependencyInjectedValues,
            container
        );
    }

    return container;
}
