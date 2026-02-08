import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';
import {
    CancelSentFriendRequestDto,
    CancelSentFriendRequestSchema,
} from '@/application/friend/dto/cancel-sent-friend.dto';

@injectable()
export class CancelSentFriendUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: CancelSentFriendRequestDto): Promise<boolean> {
        const { id, userId } = CancelSentFriendRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.cancel(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
