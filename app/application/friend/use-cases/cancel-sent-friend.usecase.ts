import { inject, injectable } from 'inversify';
import { CancelSentFriendRequestDto } from '@/application/friend/dto/cancel-sent-friend.dto';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { AcceptReceivedFriendRequestSchema } from '@/application/friend/dto/accept-received-friend.dto';
import { CancelSentFriendRequestCommand } from '@domain/friend/commands/cancel-sent-friend-request.command';

@injectable()
export class CancelSentFriendUseCase {
    constructor(
        @inject(FriendCommandRepositoryPort)
        private readonly friendCommandRepository: FriendCommandRepositoryPort
    ) {}

    async execute(dto: CancelSentFriendRequestDto): Promise<boolean> {
        const { id, currentStatus } =
            AcceptReceivedFriendRequestSchema.parse(dto);

        const command = CancelSentFriendRequestCommand.create(
            id,
            currentStatus
        );

        await this.friendCommandRepository.cancel(command);

        return true;
    }
}
