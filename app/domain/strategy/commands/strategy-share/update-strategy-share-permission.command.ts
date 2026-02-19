import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

type AvaliablePermission = Exclude<StrategySharePermission, 'ACCESS_DENIED'>;

export class UpdateStrategySharePermissionCommand {
    private constructor(
        public readonly strategyId: StrategyId,
        public readonly strategyShareId: StrategyShareId,
        public readonly permission: AvaliablePermission
    ) {}

    static create(
        strategyId: StrategyId,
        strategyShareId: StrategyShareId,
        permission: AvaliablePermission
    ) {
        return new UpdateStrategySharePermissionCommand(
            strategyId,
            strategyShareId,
            permission
        );
    }
}
