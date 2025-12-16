import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';

export function injectClientEnvironmentClassAutomaticDependencies(
    classes: ClassDependency,
    container: Container
): void {
    for (const classDefinition of Object.values(classes)) {
        container
            .bind<
                InstanceType<typeof classDefinition.class>
            >(classDefinition.symbol)
            .to(classDefinition.class)
            .inSingletonScope();
    }
}

export function injectClientEnvironmentValueAutomaticDependencies(
    values: ValueDependency,
    container: Container
): void {
    for (const valueDefinition of Object.values(values)) {
        container
            .bind<typeof valueDefinition.value>(valueDefinition.symbol)
            .toConstantValue(valueDefinition.value);
    }
}
