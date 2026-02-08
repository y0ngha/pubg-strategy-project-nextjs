import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    AcceptReceivedFriendRequestDto,
    AcceptReceivedFriendRequestSchema,
} from '@/application/friend/dto/accept-received-friend.dto';
import { FriendNotFoundException } from '@domain/friend/exceptions/friend.exceptions';

@injectable()
export class AcceptReceivedFriendUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(dto: AcceptReceivedFriendRequestDto): Promise<boolean> {
        const { id, userId } = AcceptReceivedFriendRequestSchema.parse(dto);

        const friend = await this.friendRepository.findById(id);

        if (!friend) {
            throw new FriendNotFoundException(id.toString());
        }

        friend.accept(userId);

        await this.friendRepository.save(friend);

        return true;
    }
}
