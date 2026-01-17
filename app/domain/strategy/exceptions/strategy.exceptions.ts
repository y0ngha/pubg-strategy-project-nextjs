import { DomainException } from '@domain/shared/exceptions/domain.exception';

export class InvalidTeamLabelException extends DomainException {
    constructor(label: string) {
        super(`유효하지 않은 값입니다: ${label}`);
    }
}

export class WaypointPositionLimitExceededException extends DomainException {
    constructor() {
        super('웨이포인트가 너무 많습니다.');
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

export class DeletedTagException extends DomainException {
    constructor() {
        super('삭제된 태그에는 할 수 없습니다.');
    }
}

export class TagContentBlankException extends DomainException {
    constructor() {
        super('태그의 내용은 빈 값일 수 없습니다.');
    }
}

export class StrategyShareAccessDeniedException extends DomainException {
    constructor() {
        super('해당 전략은 접근 권한이 거부된 전략입니다.');
    }
}

export class InvalidCirclePhaseException extends DomainException {
    constructor() {
        super('잘못된 자기장 페이즈입니다.');
    }
}

export class DeletedCircleException extends DomainException {
    constructor() {
        super('삭제된 자기장에는 할 수 없습니다.');
    }
}

export class InvalidAuthorException extends DomainException {
    constructor() {
        super('작성자만 할 수 있습니다.');
    }
}

export class DeletedCommentException extends DomainException {
    constructor() {
        super('삭제된 댓글에는 할 수 없습니다.');
    }
}

export class CommentContentBlankException extends DomainException {
    constructor() {
        super('댓글의 내용은 빈 값일 수 없습니다.');
    }
}

export class DeletedStrategyException extends DomainException {
    constructor() {
        super('삭제된 전략에는 할 수 없습니다.');
    }
}

export class TeamPlayerLimitExceededException extends DomainException {
    constructor() {
        super('팀 플레이어는 최대 4명까지 허용됩니다.');
    }
}

export class TeamPlayerBelowMinimumException extends DomainException {
    constructor() {
        super('팀 플레이어는 최소 1명 이상 있어야 합니다.');
    }
}

export class TeamPlayerNotFoundException extends DomainException {
    constructor() {
        super('팀 플레이어를 찾을 수 없습니다.');
    }
}

export class EnemyTeamNotFoundException extends DomainException {
    constructor() {
        super('적 팀을 찾을 수 없습니다.');
    }
}

export class CircleLimitExceededException extends DomainException {
    constructor() {
        super('자기장은 최대 8개까지 허용됩니다.');
    }
}

export class CircleNotFoundException extends DomainException {
    constructor() {
        super('자기장을 찾을 수 없습니다.');
    }
}

export class TagNotFoundException extends DomainException {
    constructor() {
        super('태그를 찾을 수 없습니다.');
    }
}

export class CirclePhaseDuplicateException extends DomainException {
    constructor() {
        super('자기장 페이즈가 중복되었습니다.');
    }
}

export class StrategyEditPermissionDeniedException extends DomainException {
    constructor() {
        super('전략을 수정할 권한이 없습니다.');
    }
}

export class StrategyShareNotFoundException extends DomainException {
    constructor() {
        super('전략 공유를 찾을 수 없습니다.');
    }
}

export class StrategyShareDuplicateException extends DomainException {
    constructor() {
        super('이미 전략 공유를 받은 사용자입니다.');
    }
}

export class StrategyPermissionDeniedException extends DomainException {
    constructor() {
        super('전략 소유자만 할 수 있습니다.');
    }
}

export class CommentNotFoundException extends DomainException {
    constructor() {
        super('댓글을 찾을 수 없습니다.');
    }
}

export class ChildCommentException extends DomainException {
    constructor() {
        super('최상위 댓글에만 가능합니다.');
    }
}

export class StrategyShareSelfDeniedException extends DomainException {
    constructor() {
        super('자기 자신에게는 할 수 없습니다.');
    }
}

export class ParentCommentPositionRequiredException extends DomainException {
    constructor() {
        super('최상위 댓글에는 위치가 반드시 필요합니다.');
    }
}

export class StrategyNotFoundException extends DomainException {
    constructor() {
        super('전략을 찾을 수 없습니다.');
    }
}

export class StrategyTitleBlankException extends DomainException {
    constructor() {
        super('전략 제목은 빈 값일 수 없습니다.');
    }
}

export class StrategyAccessDeniedException extends DomainException {
    constructor() {
        super('전략에 접근할 수 있는 권한이 없습니다.');
    }
}

export class DeletedAirplanePathException extends DomainException {
    constructor() {
        super('삭제된 비행기 동선에는 할 수 없습니다.');
    }
}

export class AirplanePathNotFoundException extends DomainException {
    constructor() {
        super('비행기 동선을 찾을 수 없습니다.');
    }
}

export class AirplanePathExistsException extends DomainException {
    constructor() {
        super('비행기 동선이 이미 존재합니다.');
    }
}
