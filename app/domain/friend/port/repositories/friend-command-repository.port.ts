import { AcceptReceivedFriendRequestCommand } from '@domain/friend/commands/accept-received-friend-request.command';
import { RejectReceivedFriendRequestCommand } from '@domain/friend/commands/reject-received-friend-request.command';
import { CancelSentFriendRequestCommand } from '@domain/friend/commands/cancel-sent-friend-request.command';
import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';
import { DeleteFriendCommand } from '@domain/friend/commands/delete-friend.command';

export abstract class FriendCommandRepositoryPort {
    abstract accept(command: AcceptReceivedFriendRequestCommand): Promise<void>;

    abstract reject(command: RejectReceivedFriendRequestCommand): Promise<void>;

    abstract cancel(command: CancelSentFriendRequestCommand): Promise<void>;

    abstract request(command: RequestFriendCommand): Promise<void>;

    abstract delete(command: DeleteFriendCommand): Promise<void>;
}
