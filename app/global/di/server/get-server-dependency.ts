import { ServiceIdentifier } from "inversify";
import { createServerRequestContainer } from "./di-server-factory";

export function getDependencyFromContainer<T>(
    identifier: ServiceIdentifier<T>,
): T {
    return createServerRequestContainer().get<T>(identifier);
}