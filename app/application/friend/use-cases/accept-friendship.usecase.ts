import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    AcceptFriendshipRequestDto,
    AcceptFriendshipRequestSchema,
} from '@/application/friend/dto/accept-friendship.dto';
import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';

@injectable()
export class AcceptFriendshipUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: AcceptFriendshipRequestDto): Promise<boolean> {
        const { id, userId } = AcceptFriendshipRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.accept(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
