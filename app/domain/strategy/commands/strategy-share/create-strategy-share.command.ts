import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

export class CreateStrategyShareCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly targetUserId: UserId,
        public readonly permission: StrategySharePermission
    ) {}

    static create(
        strategyId: StrategyId,
        targetUserId: UserId,
        permission: StrategySharePermission
    ) {
        return new CreateStrategyShareCommand(
            strategyId,
            targetUserId,
            permission
        );
    }
}
