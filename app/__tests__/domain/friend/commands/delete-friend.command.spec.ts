import { FriendId } from '@domain/friend/value-objects/friend-id';
import { DeleteFriendCommand } from '@domain/friend/commands/delete-friend.command';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';

describe('DeleteFriend', () => {
    const friendId = FriendId.generate();
    it('기존 상태값이 ACCEPTED이라면, 삭제 명령이 생성된다.', () => {
        // given
        const currentStatus = FriendStatus.ACCEPTED;

        //when
        const command = DeleteFriendCommand.create(friendId, currentStatus);

        // then
        expect(command).toBeInstanceOf(DeleteFriendCommand);
    });

    it('기존 상태값이 ACCEPTED이 아니라면 에러를 던진다.', () => {
        // given
        const currentStatus = FriendStatus.CANCELED;

        //when & then
        expect(() =>
            DeleteFriendCommand.create(friendId, currentStatus)
        ).toThrow(FriendUpdateInvalidStatus);
    });
});
