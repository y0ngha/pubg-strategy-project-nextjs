import { Container } from "inversify";
import { ClassDependency, ValueDependency } from "../types/di-types";

export function autoDependenciesBindForClass(
    classes: ClassDependency,
    container: Container
): void {
    for (const classDefinition of Object.values(classes)) {
        container
            .bind<globalThis.InstanceType<typeof classDefinition.class>>(classDefinition.symbol)
            .to(classDefinition.class)
            .inSingletonScope();
    }
}

export function autoDependenciesBindForValue(
    values: ValueDependency,
    container: Container
): void {
    for (const valueDefinition of Object.values(values)) {
        container
            .bind<typeof valueDefinition.value>(valueDefinition.symbol)
            .toConstantValue(valueDefinition.value)
    }
}