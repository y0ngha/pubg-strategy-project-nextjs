import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';

import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';
import {
    RejectReceivedFriendRequestDto,
    RejectReceivedFriendRequestSchema,
} from '@/application/friend/dto/reject-received-friend.dto';

@injectable()
export class RejectReceivedFriendUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: RejectReceivedFriendRequestDto): Promise<boolean> {
        const { id, userId } = RejectReceivedFriendRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.reject(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
