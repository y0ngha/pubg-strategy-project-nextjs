import { DomainException } from '@/domain/shared/exceptions/domain.exception';

export class EmailAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(`이미 사용 중인 이메일입니다: ${email}`);
    }
}

export class InvalidPasswordException extends DomainException {
    constructor(reason: string) {
        super(reason);
    }
}

export class InvalidEmailException extends DomainException {
    constructor(reason: string) {
        super(reason);
    }
}

export class ChangePasswordException extends DomainException {
    constructor(reason: string) {
        super(reason);
    }
}
