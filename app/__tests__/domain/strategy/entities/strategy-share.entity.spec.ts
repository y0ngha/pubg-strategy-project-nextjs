import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';
import { StrategyShare } from '@domain/strategy/entities/strategy-share.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { StrategyShareAccessDeniedException } from '@domain/strategy/exceptions/strategy.exceptions';
import { StrategyShareId } from '@domain/strategy/value-objects/strategy-share-id';

describe('StrategyShareEntity', () => {
    const userId = UserId.generate();
    const userEmail = Email.create('domain@test.com');
    const strategyShareId = StrategyShareId.generate();

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Create', () => {
        it('전략 공유 생성시 권한이 "접근 제한"이 아니라면 생성된다.', () => {
            // given
            const permission1 = StrategySharePermission.EDITABLE;
            const permission2 = StrategySharePermission.READ_ONLY;

            // when
            const strategyShare1 = StrategyShare.create(
                userId,
                userEmail,
                permission1
            );
            const strategyShare2 = StrategyShare.create(
                userId,
                userEmail,
                permission2
            );
            // then
            expect(strategyShare1).toBeInstanceOf(StrategyShare);
            expect(strategyShare2).toBeInstanceOf(StrategyShare);

            expect(strategyShare1.sharedUserId).toBe(userId);
            expect(strategyShare2.sharedUserId).toBe(userId);

            expect(strategyShare1.sharedEmail).toBe(userEmail);
            expect(strategyShare2.sharedEmail).toBe(userEmail);

            expect(strategyShare1.permission).toBe(permission1);
            expect(strategyShare2.permission).toBe(permission2);
        });

        it('전략 공유 생성시 권한이 "접근 제한"이라면 에러를 던진다.', () => {
            // given
            const permission = StrategySharePermission.ACCESS_DENIED;

            // when & then
            expect(() =>
                StrategyShare.create(userId, userEmail, permission)
            ).toThrow(StrategyShareAccessDeniedException);
        });
    });
    describe('Reconstruct', () => {
        it('재생성되는 값을 그대로 신뢰하여 유효성 검사 없이 생성된다.', () => {
            // given
            const wrongPermission = StrategySharePermission.ACCESS_DENIED;
            const createdAt = new Date('2000-01-01');
            const updatedAt = new Date('2026-01-01');

            // when
            const strategyShare = StrategyShare.reconstruct(
                strategyShareId,
                userId,
                userEmail,
                wrongPermission,
                createdAt,
                updatedAt
            );

            // then
            expect(strategyShare).toBeInstanceOf(StrategyShare);
            expect(strategyShare.id).toEqual(strategyShareId);
            expect(strategyShare.sharedUserId).toEqual(userId);
            expect(strategyShare.sharedEmail).toEqual(userEmail);
            expect(strategyShare.permission).toEqual(wrongPermission);
            expect(strategyShare.createdAt).toEqual(createdAt);
            expect(strategyShare.updatedAt).toEqual(updatedAt);
        });
    });
    describe('UpdatePermission', () => {
        it('전략에 대한 권한 변경은 이전 권한이 어떤 권한이든 업데이트 된다.', () => {
            // given
            const initialPermission = StrategySharePermission.READ_ONLY;
            const strategyShare = StrategyShare.create(
                userId,
                userEmail,
                initialPermission
            );
            strategyShare.updatePermission(
                StrategySharePermission.ACCESS_DENIED
            );
            const oldUpdatedAt = strategyShare.updatedAt;
            const newPermission = StrategySharePermission.EDITABLE;

            jest.advanceTimersByTime(1000);

            // when
            strategyShare.updatePermission(newPermission);

            // then
            expect(strategyShare.permission).toBe(newPermission);
            expect(strategyShare.updatedAt.getTime()).toBeGreaterThan(
                oldUpdatedAt.getTime()
            );
        });
    });
});
