import { AcceptFriendRequestCommand } from '@domain/friend/commands/accept-friend-request.command';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';

describe('AcceptFriendRequest', () => {
    const friendId = FriendId.generate();
    it('기존 상태값이 PENDING이라면, 변경하려고 하는 상태값으로 생성된다.', () => {
        // given
        const currentStatus = FriendStatus.PENDING;

        //when
        const command = AcceptFriendRequestCommand.create(
            friendId,
            currentStatus
        );

        // then
        expect(command).toBeInstanceOf(AcceptFriendRequestCommand);
    });

    it('기존 상태값이 PENDING이 아니라면 에러를 던진다.', () => {
        // given
        const currentStatus = FriendStatus.CANCELED;

        //when & then
        expect(() =>
            AcceptFriendRequestCommand.create(friendId, currentStatus)
        ).toThrow(FriendUpdateInvalidStatus);
    });
});
