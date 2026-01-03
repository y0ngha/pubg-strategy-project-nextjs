import { randomUUID } from 'node:crypto';

export abstract class EntityId {
    private readonly value: string;

    protected constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('ID는 빈 값일 수 없습니다.');
        }

        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new Error('ID는 UUIDv4 형식이어야 합니다.');
        }

        this.value = value;
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
}
