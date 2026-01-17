import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { Email } from '@domain/shared/value-objects/email';
import { StrategyShareAccessDeniedException } from '@domain/strategy/exceptions/strategy.exceptions';

export class StrategyShare {
    private constructor(
        public readonly id: StrategyShareId,
        public readonly sharedUserId: UserId,
        public readonly sharedEmail: Email,
        private _permission: StrategySharePermission,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get permission(): StrategySharePermission {
        return this._permission;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get isEditable(): boolean {
        return this._permission === 'EDITABLE';
    }

    get isReadonly(): boolean {
        return this._permission === 'READ_ONLY';
    }

    static create(
        sharedUserId: UserId,
        sharedEmail: Email,
        permission: StrategySharePermission
    ) {
        StrategyShare.ensureNotDeniedPermission(permission);

        return new StrategyShare(
            StrategyShareId.generate(),
            sharedUserId,
            sharedEmail,
            permission,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: StrategyShareId,
        sharedUserId: UserId,
        sharedEmail: Email,
        permission: StrategySharePermission,
        createdAt: Date,
        updatedAt: Date
    ) {
        return new StrategyShare(
            id,
            sharedUserId,
            sharedEmail,
            permission,
            createdAt,
            updatedAt
        );
    }

    private static ensureNotDeniedPermission(
        permission: StrategySharePermission
    ) {
        if (permission === StrategySharePermission.ACCESS_DENIED) {
            throw new StrategyShareAccessDeniedException();
        }
    }

    updatePermission(permission: StrategySharePermission): boolean {
        if (this._permission === permission) return false;

        this._permission = permission;
        this._updatedAt = new Date();

        return true;
    }

    delete() {
        this.updatePermission(StrategySharePermission.ACCESS_DENIED);
    }
}
