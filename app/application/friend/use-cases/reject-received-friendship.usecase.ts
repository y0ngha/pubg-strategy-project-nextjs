import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';

import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';
import {
    RejectReceivedFriendshipRequestDto,
    RejectReceivedFriendshipRequestSchema,
} from '@/application/friend/dto/reject-received-friendship.dto';

@injectable()
export class RejectReceivedFriendshipUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: RejectReceivedFriendshipRequestDto): Promise<boolean> {
        const { id, userId } = RejectReceivedFriendshipRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.reject(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
