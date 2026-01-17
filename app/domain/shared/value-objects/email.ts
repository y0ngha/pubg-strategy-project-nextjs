import { InvalidEmailException } from '@/domain/user/exceptions/user.exceptions';

export class Email {
    private constructor(private readonly value: string) {
        this.validateEmail(value);
    }

    get localPart(): string {
        return this.value.split('@')[0];
    }

    static create(value: string): Email {
        const trimmed = value.trim().toLowerCase();

        return new Email(trimmed);
    }

    static reconstruct(value: string): Email {
        return new Email(value);
    }

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }

    private ensureNotBlank(email: string): void {
        if (!email || email.trim().length === 0) {
            throw new InvalidEmailException('이메일은 빈 값일 수 없습니다.');
        }
    }

    private ensureContainsAtSign(email: string): void {
        if (!email.includes('@')) {
            throw new InvalidEmailException(
                '이메일에는 "@"가 필수로 포함되어야 합니다.'
            );
        }
    }

    private ensureNonEmptyParts(email: string): void {
        const [localPart, domain] = email.split('@');
        if (!localPart || !domain) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }
    }

    private ensureContainsDot(email: string): void {
        if (!email.includes('.')) {
            throw new InvalidEmailException(
                '이메일에는 "."이 필수로 포함되어야 합니다.'
            );
        }
    }

    private ensureMatchesPattern(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new InvalidEmailException('유효하지 않은 이메일 형식입니다.');
        }
    }

    private validateEmail(email: string) {
        this.ensureNotBlank(email);
        this.ensureContainsAtSign(email);
        this.ensureNonEmptyParts(email);
        this.ensureContainsDot(email);
        this.ensureMatchesPattern(email);
    }
}
