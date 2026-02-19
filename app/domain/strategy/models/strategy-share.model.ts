import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

export interface StrategyShare {
    readonly id: string;
    readonly sharedUserId: string;
    readonly sharedEmail: string;
    readonly permission: StrategySharePermission;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
