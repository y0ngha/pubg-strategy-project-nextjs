import { InvalidEmailException } from '@/domain/user/exceptions/user.exceptions';

export class Email {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Email {
        if (!value || value.trim().length === 0) {
            throw new InvalidEmailException('이메일은 빈 값일 수 없습니다.');
        }

        const trimmed = value.trim().toLowerCase();

        if (!trimmed.includes('@')) {
            throw new InvalidEmailException(
                '이메일에는 "@"가 필수로 포함되어야 합니다.'
            );
        }

        const [localPart, domain] = trimmed.split('@');
        if (localPart.length === 0 || domain.length === 0) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }

        if (!domain.includes('.')) {
            throw new InvalidEmailException(
                '이메일에는 "."이 필수로 포함되어야 합니다.'
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }

        return new Email(trimmed);
    }

    get localPart(): string {
        return this.value.split('@')[0];
    }

    equals(other: Email): boolean {
        if (!(other instanceof Email)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}
