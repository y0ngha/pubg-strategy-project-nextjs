import { DomainException } from '@domain/shared/exceptions/domain.exception';
import {
    FriendshipStatus,
    FriendshipStatusLabels,
} from '@domain/friend/enum/friendship-status.enum';

export class FriendshipUpdateInvalidPermission extends DomainException {
    constructor() {
        super('친구 관계를 업데이트할 권한이 없습니다.');
    }
}

export class FriendshipUpdateInvalidStatus extends DomainException {
    constructor(friendshipStatus: FriendshipStatus) {
        super(`이미 ${FriendshipStatusLabels[friendshipStatus]} 상태 입니다.`);
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

export class AlreadyBecameFriendshipException extends DomainException {
    constructor() {
        super('이미 두 분은 친구 관계입니다.');
    }
}
