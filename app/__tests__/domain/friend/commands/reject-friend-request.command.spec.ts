import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';
import { RejectFriendRequestCommand } from '@domain/friend/commands/reject-friend-request.command';

describe('RejectFriendRequest', () => {
    const friendId = FriendId.generate();
    it('기존 상태값이 PENDING이라면, 변경하려고 하는 상태값으로 생성된다.', () => {
        // given
        const currentStatus = FriendStatus.PENDING;

        //when
        const command = RejectFriendRequestCommand.create(
            friendId,
            currentStatus
        );

        // then
        expect(command).toBeInstanceOf(RejectFriendRequestCommand);
    });

    it('기존 상태값이 PENDING이 아니라면 에러를 던진다.', () => {
        // given
        const currentStatus = FriendStatus.CANCELED;

        //when & then
        expect(() =>
            RejectFriendRequestCommand.create(friendId, currentStatus)
        ).toThrow(FriendUpdateInvalidStatus);
    });
});
