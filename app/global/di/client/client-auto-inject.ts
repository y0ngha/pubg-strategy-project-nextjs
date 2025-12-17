import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';

export function injectClientEnvironmentClassAutomaticDependencies(
    classes: ClassDependency[],
    container: Container
): void {
    for (const classDefinition of classes) {
        container
            .bind(classDefinition.abstract ?? classDefinition.class)
            .to(classDefinition.class)
            .inRequestScope();
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
