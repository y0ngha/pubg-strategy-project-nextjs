import { inject, injectable } from 'inversify';
import {
    RejectReceivedFriendRequestDto,
    RejectReceivedFriendRequestSchema,
} from '@/application/friend/dto/reject-received-friend.dto';
import { RejectReceivedFriendRequestCommand } from '@domain/friend/commands/reject-received-friend-request.command';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';

@injectable()
export class RejectReceivedFriendUseCase {
    constructor(
        @inject(FriendCommandRepositoryPort)
        private readonly friendCommandRepository: FriendCommandRepositoryPort
    ) {}

    async execute(dto: RejectReceivedFriendRequestDto): Promise<boolean> {
        const { id, currentStatus } =
            RejectReceivedFriendRequestSchema.parse(dto);

        const command = RejectReceivedFriendRequestCommand.create(
            id,
            currentStatus
        );

        await this.friendCommandRepository.reject(command);

        return true;
    }
}
