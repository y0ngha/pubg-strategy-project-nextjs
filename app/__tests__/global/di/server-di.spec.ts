import { DependencyInjectionSymbol } from '@/global/di/di-symbol';
import {
    injectServerEnvironmentClassAutomaticDependencies,
    injectServerEnvironmentValueAutomaticDependencies,
} from '@/global/di/server/server-auto-inject';
import { Container } from 'inversify';
import {
    ClassDependency,
    ValueDependency,
} from '../../../global/di/types/di-types';

describe('InversifyJS Dependency Injection Setup', () => {
    let container: Container;

    class TestService {
        isService: boolean = true;
    }

    const dataSourceInstance = new Map<number, string>();

    const configValue = 'test_config_value';

    const dependencyInjectionSymbols: DependencyInjectionSymbol = {
        TestService: Symbol.for('TestService'),
        DataSource: Symbol.for('DataSource'),
        Config: Symbol.for('Config'),
    };

    const dependencyInjectedClasses: ClassDependency[] = [
        {
            class: TestService,
        },
    ];

    const dependencyInjectedValues: ValueDependency = {
        DataSource: {
            symbol: dependencyInjectionSymbols.DataSource,
            value: dataSourceInstance,
        },
        Config: {
            symbol: dependencyInjectionSymbols.Config,
            value: configValue,
        },
    } as const;

    beforeEach(() => {
        container = new Container();

        injectServerEnvironmentClassAutomaticDependencies(
            dependencyInjectedClasses,
            container
        );
        injectServerEnvironmentValueAutomaticDependencies(
            dependencyInjectedValues,
            container
        );

        expect(container).toBeInstanceOf(Container);
    });

    describe('Class Bindings (.to(Class)) 테스트', () => {
        it('TestService를 Container에서 가져오고, 이는 타입이 동일해야합니다.', () => {
            const instance = container.get<TestService>(TestService);

            expect(instance).toBeDefined();
            expect(instance).toBeInstanceOf(TestService);
        });

        it('TestService를 Container에서 두번 가져오고, 처음 가져온 Instance와 다음으로 가져온 Instance가 동일하지 않습니다. (요청당 세션 유지)', () => {
            const instance = container.get<TestService>(TestService);
            const secondInstance = container.get<TestService>(TestService);

            expect(instance).not.toBe(secondInstance);
            expect(instance.isService).toBe(true);
        });
    });

    describe('Value Bindings (.toConstantValue(Value)) 테스트', () => {
        it('Datasource를 Container에서 Map 타입으로 가져오고, 이는 타입과 값이 엄격하게 동일해야합니다.', () => {
            const value = container.get<Map<number, string>>(
                dependencyInjectionSymbols.DataSource
            );

            expect(value).toBeDefined();
            expect(value).toBeInstanceOf(Map);
            expect(value).toBe(dataSourceInstance);
        });

        it('Config를 Container에서 String 타입으로 가져오고, 이는 타입과 값이 엄격하게 동일해야합니다.', () => {
            const value = container.get<string>(
                dependencyInjectionSymbols.Config
            );

            expect(value).toBeDefined();
            expect(value).toBe(configValue);
            expect(value).toBe(dependencyInjectedValues.Config.value);
        });
    });

    describe('Failure Test (Unbound Symbols)', () => {
        it('존재하지 않는 심볼을 가져올 때 오류가 발생합니다.', () => {
            const UNBOUND_SYMBOL = Symbol.for('UnboundSymbol');

            expect(() => {
                container.get(UNBOUND_SYMBOL);
            }).toThrow();
        });
    });
});
