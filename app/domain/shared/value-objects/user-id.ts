import { randomUUID } from 'crypto';

export class UserId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): UserId {
        if (!value || value.trim().length === 0) {
            throw new Error('유저ID는 빈 값일 수 없습니다.');
        }

        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidV4Regex.test(value)) {
            throw new Error('유저ID는 UUIDv4 형식이어야 합니다.');
        }

        return new UserId(value);
    }

    static generate(): UserId {
        return new UserId(randomUUID());
    }

    equals(userId: UserId): boolean {
        if (!(userId instanceof UserId)) {
            return false;
        }
        return this.value === userId.value;
    }

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}
