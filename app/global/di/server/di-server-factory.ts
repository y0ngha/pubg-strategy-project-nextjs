import { PasswordCipherAdapter } from '@/infrastructure/user/adapter/password-cipher.adapter';
import { Container } from 'inversify';
import { DependencyInjectionSymbols, SymbolKeys } from '../di-symbol';
import { ClassDependency, ValueDependency } from '../types/di-types';
import {
    injectServerEnvironmentClassAutomaticDependencies,
    injectServerEnvironmentValueAutomaticDependencies,
} from './server-auto-inject';

const dependencyInjectedClasses: ClassDependency = {
    [SymbolKeys.PasswordCipher]: {
        symbol: DependencyInjectionSymbols[SymbolKeys.PasswordCipher],
        class: PasswordCipherAdapter,
    },
} as const;

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
