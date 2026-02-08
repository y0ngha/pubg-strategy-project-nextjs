import { injectable } from 'inversify';
import { Friend } from '@domain/friend/entities/friend.entity';
import { GetFriendResponseDto } from '@/application/friend/dto/get-friend-list.dto';
import { FriendStatusLabels } from '@domain/friend/enum/friend-status.enum';

@injectable()
export class FriendMapper {
    toResponse(entity: Friend): GetFriendResponseDto {
        return {
            id: entity.id.toString(),
            status: FriendStatusLabels[entity.status],
            requesterUserId: entity.requesterUserId.toString(),
            recipientUserId: entity.recipientUserId.toString(),
            requesterUserEmail: entity.requesterUserEmail.toString(),
            recipientUserEmail: entity.recipientUserEmail.toString(),
        };
    }
}
