import { inject, injectable } from 'inversify';
import {
    RequestFriendRequestDto,
    RequestFriendRequestSchema,
} from '@/application/friend/dto/request-friend.dto';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { RequestFriendCommand } from '@domain/friend/commands/request-friend.command';

@injectable()
export class RequestFriendUseCase {
    constructor(
        @inject(FriendCommandRepositoryPort)
        private readonly friendCommandRepository: FriendCommandRepositoryPort
    ) {}

    async execute(dto: RequestFriendRequestDto): Promise<boolean> {
        const { recipientUserId } = RequestFriendRequestSchema.parse(dto);

        const command = RequestFriendCommand.create(recipientUserId);

        await this.friendCommandRepository.request(command);

        return true;
    }
}
