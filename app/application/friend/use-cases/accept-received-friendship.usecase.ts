import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    AcceptReceivedFriendshipRequestDto,
    AcceptReceivedFriendshipRequestSchema,
} from '@/application/friend/dto/accept-received-friendship.dto';
import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';

@injectable()
export class AcceptReceivedFriendshipUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: AcceptReceivedFriendshipRequestDto): Promise<boolean> {
        const { id, userId } = AcceptReceivedFriendshipRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.accept(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
