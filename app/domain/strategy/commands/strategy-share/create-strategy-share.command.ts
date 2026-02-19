import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

type AvaliablePermission = Exclude<StrategySharePermission, 'ACCESS_DENIED'>;

export class CreateStrategyShareCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly targetUserId: UserId,
        public readonly permission: AvaliablePermission
    ) {}

    static create(
        strategyId: StrategyId,
        targetUserId: UserId,
        permission: AvaliablePermission
    ) {
        return new CreateStrategyShareCommand(
            strategyId,
            targetUserId,
            permission
        );
    }
}
