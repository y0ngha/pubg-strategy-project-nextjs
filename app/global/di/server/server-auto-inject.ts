import { Container } from 'inversify';
import { ClassDependency, ValueDependency } from '../types/di-types';

export function injectServerEnvironmentClassAutomaticDependencies(
    classes: ClassDependency,
    container: Container
): void {
    for (const classDefinition of Object.values(classes)) {
        container
            .bind<
                InstanceType<typeof classDefinition.class>
            >(classDefinition.symbol)
            .to(classDefinition.class)
            .inRequestScope();
    }
}

export function injectServerEnvironmentValueAutomaticDependencies(
    values: ValueDependency,
    container: Container
): void {
    for (const valueDefinition of Object.values(values)) {
        container
            .bind<typeof valueDefinition.value>(valueDefinition.symbol)
            .toConstantValue(valueDefinition.value);
    }
}
