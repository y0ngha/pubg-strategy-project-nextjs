import { inject, injectable } from 'inversify';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import {
    DeleteFriendDto,
    DeleteFriendSchema,
} from '@/application/friend/dto/delete-friend.dto';
import { DeleteFriendCommand } from '@domain/friend/commands/delete-friend.command';

@injectable()
export class DeleteFriendUseCase {
    constructor(
        @inject(FriendCommandRepositoryPort)
        private readonly friendCommandRepository: FriendCommandRepositoryPort
    ) {}

    async execute(dto: DeleteFriendDto): Promise<boolean> {
        const { id, currentStatus } = DeleteFriendSchema.parse(dto);

        const command = DeleteFriendCommand.create(id, currentStatus);

        await this.friendCommandRepository.delete(command);

        return true;
    }
}
