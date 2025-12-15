import { ServiceIdentifier } from 'inversify';
import { createServerRequestContainer } from './di-server-factory';

export function initializeRequestServices() {
    const container = createServerRequestContainer();

    return function getServiceFromRequestContainer<T>(
        identifier: ServiceIdentifier<T>
    ): T {
        return container.get<T>(identifier);
    };
}
