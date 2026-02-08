import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    RequestFriendRequestDto,
    RequestFriendRequestSchema,
} from '@/application/friend/dto/request-friend.dto';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';
import { AlreadyBecameFriendException } from '@domain/friend/exceptions/friend.exceptions';
import { Friend } from '@domain/friend/entities/friend.entity';

@injectable()
export class RequestFriendUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort,
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(dto: RequestFriendRequestDto): Promise<boolean> {
        const { requesterUserId, recipientUserId } =
            RequestFriendRequestSchema.parse(dto);

        const [requester, recipient] = await Promise.all([
            this.userRepository.findByUserId(requesterUserId),
            this.userRepository.findByUserId(recipientUserId),
        ]);

        if (!requester) {
            throw new UserNotFoundException(requesterUserId.toString());
        }

        if (!recipient) {
            throw new UserNotFoundException(recipientUserId.toString());
        }

        const existsFriend = await this.friendRepository.existsFriendBetween(
            recipientUserId,
            requesterUserId
        );

        if (existsFriend) {
            throw new AlreadyBecameFriendException();
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
