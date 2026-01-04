import { inject, injectable } from 'inversify';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import {
    GetFriendshipDisplayableDto,
    GetFriendshipListRequestDto,
    GetFriendshipListRequestSchema,
    GetFriendshipListResponseDto,
} from '@/application/friend/dto/get-friendship-list.dto';
import { Friend } from '@domain/friend/entities/friend.entity';
import { FriendshipStatusLabels } from '@domain/friend/enum/friendship-status.enum';

@injectable()
export class GetFriendshipListUseCase {
    constructor(
        @inject(FriendRepositoryPort)
        private readonly friendRepository: FriendRepositoryPort
    ) {}

    async execute(
        dto: GetFriendshipListRequestDto
    ): Promise<GetFriendshipListResponseDto> {
        const { id } = GetFriendshipListRequestSchema.parse(dto);

        const [friends, receivedFriendshipRequests, sentFriendshipRequests] =
            await Promise.all([
                this.friendRepository.findAcceptedFriendsByUserId(id),
                this.friendRepository.findReceivedFriendshipRequestsByRecipientUserId(
                    id
                ),
                this.friendRepository.findSentFriendshipRequestsByRequesterUserId(
                    id
                ),
            ]);

        return {
            friends: friends.map(friend => this.entityToDisplayableDto(friend)),
            receivedFriendshipRequests: receivedFriendshipRequests.map(friend =>
                this.entityToDisplayableDto(friend)
            ),
            sentFriendshipRequests: sentFriendshipRequests.map(friend =>
                this.entityToDisplayableDto(friend)
            ),
        };
    }

    private entityToDisplayableDto(
        entity: Friend
    ): GetFriendshipDisplayableDto {
        return {
            id: entity.id.toString(),
            status: FriendshipStatusLabels[entity.status],
            requesterUserId: entity.requesterUserId.toString(),
            recipientUserId: entity.recipientUserId.toString(),
            requesterUserEmail: entity.requesterUserEmail.toString(),
            recipientUserEmail: entity.recipientUserEmail.toString(),
        };
    }
}
