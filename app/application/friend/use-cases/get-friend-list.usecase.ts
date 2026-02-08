import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    GetFriendListRequestDto,
    GetFriendListRequestSchema,
    GetFriendListResponseDto,
} from '@/application/friend/dto/get-friend-list.dto';
import { FriendMapper } from '@/application/friend/mappers/friend.mapper';

@injectable()
export class GetFriendListUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort,
        @inject(FriendMapper)
        private readonly friendMapper: FriendMapper
    ) {}

    async execute(
        dto: GetFriendListRequestDto
    ): Promise<GetFriendListResponseDto> {
        const { userId } = GetFriendListRequestSchema.parse(dto);

        const [friends, receivedFriendRequests, sentFriendRequests] =
            await Promise.all([
                this.friendRepository.findAcceptedFriendsByUserId(userId),
                this.friendRepository.findReceivedFriendRequestsByRecipientUserId(
                    userId
                ),
                this.friendRepository.findSentFriendRequestsByRequesterUserId(
                    userId
                ),
            ]);

        return {
            friends: friends.map(friend =>
                this.friendMapper.toResponse(friend)
            ),
            receivedFriendRequests: receivedFriendRequests.map(friend =>
                this.friendMapper.toResponse(friend)
            ),
            sentFriendRequests: sentFriendRequests.map(friend =>
                this.friendMapper.toResponse(friend)
            ),
            friendCount: friends.length,
            receivedFriendRequestCount: receivedFriendRequests.length,
        };
    }
}
