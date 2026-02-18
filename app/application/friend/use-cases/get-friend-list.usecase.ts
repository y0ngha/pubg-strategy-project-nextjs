import { inject, injectable } from 'inversify';
import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import {
    GetFriendListResponseDto,
    GetFriendResponseDto,
} from '@/application/friend/dto/get-friend-list.dto';
import { FriendStatusLabels } from '@domain/friend/enum/friend-status.enum';
import { Friend } from '@domain/friend/models/friend.model';

@injectable()
export class GetFriendListUseCase {
    constructor(
        @inject(FriendQueryRepositoryPort)
        private readonly friendRepository: FriendQueryRepositoryPort
    ) {}

    async execute(): Promise<GetFriendListResponseDto> {
        const [friends, receivedFriendRequests, sentFriendRequests] =
            await Promise.all([
                this.friendRepository.findAcceptedFriendsByUserId(),
                this.friendRepository.findReceivedFriendRequestsByRecipientUserId(),
                this.friendRepository.findSentFriendRequestsByRequesterUserId(),
            ]);

        return {
            friends: friends.map(friend => this.modelToResponseDto(friend)),
            receivedFriendRequests: receivedFriendRequests.map(friend =>
                this.modelToResponseDto(friend)
            ),
            sentFriendRequests: sentFriendRequests.map(friend =>
                this.modelToResponseDto(friend)
            ),
            friendCount: friends.length,
            receivedFriendRequestCount: receivedFriendRequests.length,
        };
    }

    private modelToResponseDto(friend: Friend): GetFriendResponseDto {
        return {
            id: friend.id,
            requesterUserId: friend.requesterUserId,
            recipientUserId: friend.recipientUserId,
            status: friend.status,
            statusLabel: FriendStatusLabels[friend.status],
            requesterUserEmail: friend.requesterUserEmail,
            recipientUserEmail: friend.recipientUserEmail,
        };
    }
}
