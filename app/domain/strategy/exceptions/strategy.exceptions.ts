import { DomainException } from '@domain/shared/exceptions/domain.exception';

export class InvalidTeamLabelException extends DomainException {
    constructor(label: string) {
        super(`유효하지 않은 값입니다: ${label}`);
    }
}

export class WaypointCreateTooManyPositionException extends DomainException {
    constructor() {
        super('웨이포인트 마커가 너무 많습니다.');
    }
}

export class WaypointCreateDuplicatePositionException extends DomainException {
    constructor() {
        super('웨이포인트 마커가 중복된 것이 있습니다.');
    }
}
