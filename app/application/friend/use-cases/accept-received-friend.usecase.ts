import { inject, injectable } from 'inversify';
import {
    AcceptReceivedFriendRequestDto,
    AcceptReceivedFriendRequestSchema,
} from '@/application/friend/dto/accept-received-friend.dto';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { AcceptReceivedFriendRequestCommand } from '@domain/friend/commands/accept-received-friend-request.command';

@injectable()
export class AcceptReceivedFriendUseCase {
    constructor(
        @inject(FriendCommandRepositoryPort)
        private readonly friendCommandRepository: FriendCommandRepositoryPort
    ) {}

    async execute(dto: AcceptReceivedFriendRequestDto): Promise<boolean> {
        const { id, currentStatus } =
            AcceptReceivedFriendRequestSchema.parse(dto);

        const command = AcceptReceivedFriendRequestCommand.create(
            id,
            currentStatus
        );

        await this.friendCommandRepository.accept(command);

        return true;
    }
}
