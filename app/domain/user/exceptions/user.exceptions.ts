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

export class UserNotFoundException extends DomainException {
    constructor(id?: string) {
        super(
            id ? `유저를 찾을 수 없습니다: ${id}` : '유저를 찾을 수 없습니다.'
        );
    }
}
