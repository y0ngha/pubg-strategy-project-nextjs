import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';
import { UserId } from '@domain/shared/value-objects/user-id';

describe('FriendRequest', () => {
    it('친구 요청 Command가 생성된다.', () => {
        // given
        const userId = UserId.generate();

        //when
        const command = RequestFriendCommand.create(userId);

        // then
        expect(command).toBeInstanceOf(RequestFriendCommand);
    });
});
