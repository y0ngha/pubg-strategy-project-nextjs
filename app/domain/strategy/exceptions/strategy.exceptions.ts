import { DomainException } from '@domain/shared/exceptions/domain.exception';

export class InvalidTeamLabelException extends DomainException {
    constructor(label: string) {
        super(`유효하지 않은 값입니다: ${label}`);
    }
}
