import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';
import {
    CancelSentFriendshipRequestDto,
    CancelSentFriendshipRequestSchema,
} from '@/application/friend/dto/cancel-sent-friendship.dto';

@injectable()
export class CancelSentFriendshipUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: CancelSentFriendshipRequestDto): Promise<boolean> {
        const { id, userId } = CancelSentFriendshipRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.cancel(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
