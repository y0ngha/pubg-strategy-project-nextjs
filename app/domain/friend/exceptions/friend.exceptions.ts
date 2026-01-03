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
    constructor(firendshipStatus: FriendshipStatus) {
        super(`이미 ${FriendshipStatusLabels[firendshipStatus]} 상태 입니다.`);
    }
}
