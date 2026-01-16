import { randomUUID } from 'node:crypto';
import {
    EntityIdBlankException,
    InvalidEntityIdException,
} from '@domain/shared/exceptions/entity-id.exceptions';

export abstract class EntityId {
    protected constructor(protected readonly value: string) {
        this.validateEntityId(value);
    }

    protected static _generateUuid(): string {
        return randomUUID();
    }

    abstract equals(id: EntityId): boolean;

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }

    private validateEntityId(value: string) {
        this.ensureNotBlank(value);
        this.ensureMatchesUUIDv4(value);
    }

    private ensureNotBlank(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new EntityIdBlankException();
        }
    }

    private ensureMatchesUUIDv4(value: string): void {
        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new InvalidEntityIdException();
        }
    }
}
