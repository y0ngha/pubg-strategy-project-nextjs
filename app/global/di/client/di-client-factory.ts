import { Container } from 'inversify';
import {
    injectClientEnvironmentClassAutomaticDependencies,
    injectClientEnvironmentValueAutomaticDependencies,
} from './client-auto-inject';
import { ClassDependency, ValueDependency } from '../types/di-types';

let container: Container | null = null;

const dependencyInjectedClasses: ClassDependency[] = [];

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
