import { Container } from "inversify";
import { ClassDependency, ValueDependency } from "../types/di-types";
import { autoDependenciesBindForClass, autoDependenciesBindForValue } from "../helpers/auto-inject";

const dependencyInjectedClasses: ClassDependency = {
} as const;

const dependencyInjectedValues: ValueDependency = {
} as const;

export function createServerRequestContainer(): Container {
    if (typeof window !== 'undefined') {
        throw new Error("[createServerRequestContainer] 클라이언트 환경에서는 사용할 수 없는 코드입니다.");
    }

    const container = new Container();

    autoDependenciesBindForClass(dependencyInjectedClasses, container);
    autoDependenciesBindForValue(dependencyInjectedValues, container);

    return container;
}