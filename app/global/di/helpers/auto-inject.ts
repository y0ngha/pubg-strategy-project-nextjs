import { Container } from "inversify";
import { ClassDependency, ValueDependency } from "../types/di-types";

export function autoDependenciesBindForClass(
    classes: ClassDependency,
    container: Container
): void {
    (Object.keys(classes))
        .forEach(classKey => {
            const classDefinition = classes[classKey];
            container
                .bind<globalThis.InstanceType<typeof classDefinition.class>>(classDefinition.symbol)
                .to(classDefinition.class)
                .inSingletonScope();
        });
}

export function autoDependenciesBindForValue(
    values: ValueDependency,
    container: Container
): void {
    (Object.keys(values))
        .forEach(valueKey => {
            const valueDefinition = values[valueKey];
            container
                .bind<typeof valueDefinition.value>(valueDefinition.symbol)
                .toConstantValue(valueDefinition.value)
        });
}