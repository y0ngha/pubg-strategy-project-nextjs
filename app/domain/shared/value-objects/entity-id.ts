import { randomUUID } from 'node:crypto';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

export abstract class EntityId {
    protected constructor(protected readonly value: string) {}

    protected static generateUuid(): string {
        return randomUUID();
    }

    protected static validateEntityId(value: string) {
        EntityId.ensureNotBlank(value);
        EntityId.ensureMatchesUUIDv4(value);
    }

    private static ensureNotBlank(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new EntityIdBlankException();
        }
    }

    private static ensureMatchesUUIDv4(value: string): void {
        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new InvalidEntityIdException();
        }
    }

    abstract equals(id: EntityId): boolean;

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}
