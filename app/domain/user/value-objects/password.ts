import { InvalidPasswordException } from '@domain/user/exceptions/user.exceptions';

export class Password {
    private constructor(private readonly value: string) {}

    static create(value: string): Password {
        const trimmed: string = value.trim();
        this.validatePassword(trimmed);
        return new Password(trimmed);
    }

    static reconstruct(hashedValue: string): Password {
        return new Password(hashedValue);
    }

    private static validatePassword(value: string): void {
        this.ensureNotBlank(value);
        this.ensureMinLength(value, 8);
        this.ensureContainsUppercase(value);
        this.ensureContainsLowercase(value);
        this.ensureContainsNumber(value);
        this.ensureContainsSpecialCharacter(value);
    }

    private static ensureNotBlank(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new InvalidPasswordException(
                '비밀번호는 빈 값일 수 없습니다.'
            );
        }
    }

    private static ensureMinLength(value: string, min: number): void {
        if (value.length < min) {
            throw new InvalidPasswordException(
                `비밀번호는 최소 ${min}자리 이상으로 구성되어야 합니다.`
            );
        }
    }

    private static ensureContainsUppercase(value: string): void {
        if (!/[A-Z]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 대문자 영문이 포함되어야 합니다.'
            );
        }
    }

    private static ensureContainsLowercase(value: string): void {
        if (!/[a-z]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 소문자 영문이 포함되어야 합니다.'
            );
        }
    }

    private static ensureContainsNumber(value: string): void {
        if (!/[0-9]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 숫자가 포함되어야 합니다.'
            );
        }
    }

    private static ensureContainsSpecialCharacter(value: string): void {
        if (!/[^A-Za-z0-9]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 특수문자가 포함되어야 합니다.'
            );
        }
    }

    equals(other: Password): boolean {
        if (!(other instanceof Password)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    contains(substring: string): boolean {
        return this.value.toLowerCase().includes(substring.toLowerCase());
    }

    toJSON(): string {
        return '[PROTECTED]';
    }
}
