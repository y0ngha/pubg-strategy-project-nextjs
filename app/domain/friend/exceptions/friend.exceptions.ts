import { DomainException } from '@domain/shared/exceptions/domain.exception';
import {
    FriendStatus,
    FriendStatusLabels,
} from '@domain/friend/enum/friend-status.enum';

export class FriendUpdateInvalidPermission extends DomainException {
    constructor() {
        super('친구 관계를 업데이트할 권한이 없습니다.');
    }
}

export class FriendUpdateInvalidStatus extends DomainException {
    constructor(friendStatus: FriendStatus) {
        super(`이미 ${FriendStatusLabels[friendStatus]} 상태 입니다.`);
    }
}

export class FriendNotFoundException extends DomainException {
    constructor(id?: string) {
        super(
            id
                ? `친구 관계를 찾을 수 없습니다: ${id}`
                : '친구 관계를 찾을 수 없습니다.'
        );
    }
}

export class AlreadyBecameFriendException extends DomainException {
    constructor() {
        super('이미 두 분은 친구 관계입니다.');
    }
}
