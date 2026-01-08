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

export class AirplanePathCreateDuplicatePositionException extends DomainException {
    constructor() {
        super('비행기의 시작과 끝이 동일합니다.');
    }
}

export class DeletedEnemyTeamException extends DomainException {
    constructor() {
        super('삭제된 적 팀에게는 할 수 없습니다.');
    }
}

export class SameTeamLabelException extends DomainException {
    constructor() {
        super('현재 사용중인 팀 라벨입니다.');
    }
}

export class SamePositionException extends DomainException {
    constructor() {
        super('현재 위치한 포지션입니다.');
    }
}

export class DeletedTeamPlayerException extends DomainException {
    constructor() {
        super('삭제된 플레이어에게는 할 수 없습니다.');
    }
}

export class InvalidTeamPlayerPriorityException extends DomainException {
    constructor() {
        super('유효하지 않은 팀 플레이어 순번입니다.');
    }
}

export class SamePositionTeamPlayerException extends DomainException {
    constructor() {
        super('이미 현재 위치한 포지션입니다.');
    }
}
