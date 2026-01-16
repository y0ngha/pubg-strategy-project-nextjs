import { DomainException } from '@domain/shared/exceptions/domain.exception';

export class EntityIdBlankException extends DomainException {
    constructor() {
        super('ID는 빈 값일 수 없습니다.');
    }
}

export class InvalidEntityIdException extends DomainException {
    constructor() {
        super('ID는 UUIDv4 형식이어야 합니다.');
    }
}
