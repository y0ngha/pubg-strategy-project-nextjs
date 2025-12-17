import { InvalidPasswordException } from "../exceptions/user.exceptions";

export class Password {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): Password {
        if (!value || value.trim().length === 0) {
            throw new InvalidPasswordException('비밀번호는 빈 값일 수 없습니다.');
        }

        if (value.length < 8) {
            throw new InvalidPasswordException(
                '비밀번호는 최소 8자리 이상으로 구성되어야 합니다.'
            );
        }

        if (!/[A-Z]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 대문자 영문이 포함되어야 합니다.'
            );
        }

        if (!/[a-z]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 소문자 영문이 포함되어야 합니다.'
            );
        }

        if (!/[0-9]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 숫자가 포함되어야 합니다.'
            );
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            throw new InvalidPasswordException(
                '비밀번호에는 최소 1글자 이상 특수문자가 포함되어야 합니다.'
            );
        }

        return new Password(value);
    }

    static reconstruct(hashedValue: string): Password {
        return new Password(hashedValue);
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
