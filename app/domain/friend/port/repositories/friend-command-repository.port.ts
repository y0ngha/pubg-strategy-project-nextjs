import { AcceptFriendRequestCommand } from '@domain/friend/commands/accept-friend-request.command';
import { RejectFriendRequestCommand } from '@domain/friend/commands/reject-friend-request.command';
import { CancelFriendRequestCommand } from '@domain/friend/commands/cancel-friend-request.command';
import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';

export abstract class FriendCommandRepositoryPort {
    abstract accept(command: AcceptFriendRequestCommand): Promise<void>;

    abstract reject(command: RejectFriendRequestCommand): Promise<void>;

    abstract cancel(command: CancelFriendRequestCommand): Promise<void>;

    abstract request(command: RequestFriendCommand): Promise<void>;
}
