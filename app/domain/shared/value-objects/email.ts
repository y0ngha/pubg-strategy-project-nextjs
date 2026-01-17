import { InvalidEmailException } from '@/domain/user/exceptions/user.exceptions';

export class Email {
    private constructor(private readonly value: string) {}

    get localPart(): string {
        return this.value.split('@')[0];
    }

    static create(value: string): Email {
        const trimmed = value.trim().toLowerCase();

        this.validateEmail(trimmed);

        return new Email(trimmed);
    }

    static reconstruct(value: string): Email {
        return new Email(value);
    }

    private static ensureNotBlank(email: string): void {
        if (!email || email.trim().length === 0) {
            throw new InvalidEmailException('이메일은 빈 값일 수 없습니다.');
        }
    }

    private static ensureContainsAtSign(email: string): void {
        if (!email.includes('@')) {
            throw new InvalidEmailException(
                '이메일에는 "@"가 필수로 포함되어야 합니다.'
            );
        }
    }

    private static ensureNonEmptyParts(email: string): void {
        const [localPart, domain] = email.split('@');
        if (!localPart || !domain) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }
    }

    private static ensureContainsDot(email: string): void {
        if (!email.includes('.')) {
            throw new InvalidEmailException(
                '이메일에는 "."이 필수로 포함되어야 합니다.'
            );
        }
    }

    private static ensureMatchesPattern(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }
    }

    private static validateEmail(email: string) {
        Email.ensureNotBlank(email);
        Email.ensureContainsAtSign(email);
        Email.ensureNonEmptyParts(email);
        Email.ensureContainsDot(email);
        Email.ensureMatchesPattern(email);
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
