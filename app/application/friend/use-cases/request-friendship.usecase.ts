import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    RequestFriendshipRequestDto,
    RequestFriendshipRequestSchema,
} from '@/application/friend/dto/request-friendship.dto';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';
import { AlreadyBecameFriendshipException } from '@domain/friend/exceptions/friend.exceptions';
import { Friend } from '@domain/friend/entities/friend.entity';

@injectable()
export class RequestFriendshipUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort,
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(dto: RequestFriendshipRequestDto): Promise<boolean> {
        const { requesterUserId, recipientUserId } =
            RequestFriendshipRequestSchema.parse(dto);

        const requester =
            await this.userRepository.findByUserId(requesterUserId);

        if (!requester) {
            throw new UserNotFoundException(requesterUserId.toString());
        }

        const recipient =
            await this.userRepository.findByUserId(recipientUserId);

        if (!recipient) {
            throw new UserNotFoundException(recipientUserId.toString());
        }

        const existsFriendship =
            await this.friendRepository.existsFriendshipBetween(
                recipientUserId,
                requesterUserId
            );

        if (existsFriendship) {
            throw new AlreadyBecameFriendshipException();
        }

        const friend = Friend.create(
            requester.id,
            recipient.id,
            requester.email,
            recipient.email
        );

        await this.friendRepository.save(friend);

        return true;
    }
}
