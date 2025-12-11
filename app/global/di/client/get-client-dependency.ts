import { ServiceIdentifier } from "inversify";
import { getClientContainer } from "./di-client-factory";

export function getDependencyFromContainer<T>(
    identifier: ServiceIdentifier<T>,
): T {
    return getClientContainer().get<T>(identifier);
}