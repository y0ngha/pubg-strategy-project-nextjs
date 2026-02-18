import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { RejectFriendRequestCommand } from '@domain/friend/commands/reject-friend-request.command';
import { AcceptFriendRequestCommand } from '@domain/friend/commands/accept-friend-request.command';
import { CancelFriendRequestCommand } from '@domain/friend/commands/cancel-friend-request.command';
import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';

export class FriendCommandRepositoryAdapter extends FriendCommandRepositoryPort {
    accept(command: AcceptFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    cancel(command: CancelFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    reject(command: RejectFriendRequestCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }

    request(command: RequestFriendCommand): Promise<void> {
        throw new Error('Not Implemented.');
    }
}
