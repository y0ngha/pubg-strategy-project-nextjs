import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { RejectReceivedFriendRequestCommand } from '@domain/friend/commands/reject-received-friend-request.command';
import { AcceptReceivedFriendRequestCommand } from '@domain/friend/commands/accept-received-friend-request.command';
import { CancelSentFriendRequestCommand } from '@domain/friend/commands/cancel-sent-friend-request.command';
import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';

export class FriendCommandRepositoryAdapter extends FriendCommandRepositoryPort {
    accept(command: AcceptReceivedFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    cancel(command: CancelSentFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    reject(command: RejectReceivedFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    request(command: RequestFriendCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }
}
