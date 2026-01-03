import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { FriendshipStatus } from '@domain/friend/enum/friendship-status.enum';
import {
    FriendshipUpdateInvalidPermission,
    FriendshipUpdateInvalidStatus,
} from '@domain/friend/exceptions/friend.exceptions';

describe('FriendEntity', () => {
    describe('Create', () => {
        it('새로운 친구 관계를 생성한다.', () => {
            // give
            const requesterUserId = UserId.generate();
            const requesterUserEmail = Email.create('test@domain.com');
            const recipientUserId = UserId.generate();
            const recipientUserEmail = Email.create('now@domain.com');

            // when
            const friend = Friend.create(
                requesterUserId,
                recipientUserId,
                requesterUserEmail,
                recipientUserEmail
            );

            // then
            expect(friend).toBeInstanceOf(Friend);
            expect(friend.requesterUserId).toBe(requesterUserId);
            expect(friend.requesterUserEmail).toBe(requesterUserEmail);
            expect(friend.recipientUserId).toBe(recipientUserId);
            expect(friend.recipientUserEmail).toBe(recipientUserEmail);
            expect(friend.status).toBe(FriendshipStatus.PENDING);
        });
    });

    describe('친구 관계 업데이트', () => {
        describe('성공', () => {
            it('내가 받은 친구 요청이고, PENDING 상태일 때 수락할 수 있다.', () => {
                // give
                const requesterUserId = UserId.generate();
                const requesterUserEmail = Email.create('test@domain.com');
                const recipientUserId = UserId.generate();
                const recipientUserEmail = Email.create('now@domain.com');

                const friend = Friend.create(
                    requesterUserId,
                    recipientUserId,
                    requesterUserEmail,
                    recipientUserEmail
                );

                // when
                friend.accept(recipientUserId);

                // then
                expect(friend.status).toBe(FriendshipStatus.ACCEPTED);
                expect(friend.respondedAt).not.toBeNull();
            });

            it('내가 받은 친구 요청이고, PENDING 상태일 때 거절할 수 있다.', () => {
                // give
                const requesterUserId = UserId.generate();
                const requesterUserEmail = Email.create('test@domain.com');
                const recipientUserId = UserId.generate();
                const recipientUserEmail = Email.create('now@domain.com');

                const friend = Friend.create(
                    requesterUserId,
                    recipientUserId,
                    requesterUserEmail,
                    recipientUserEmail
                );

                // when
                friend.reject(recipientUserId);

                // then
                expect(friend.status).toBe(FriendshipStatus.REJECTED);
                expect(friend.respondedAt).not.toBeNull();
            });
        });

        describe('실패', () => {
            it('내가 받은 친구 요청이 아닌데, 업데이트 하려 할 경우 에러를 던진다.', () => {
                // give
                const requesterUserId = UserId.generate();
                const requesterUserEmail = Email.create('test@domain.com');
                const recipientUserId = UserId.generate();
                const recipientUserEmail = Email.create('now@domain.com');

                const friend = Friend.create(
                    requesterUserId,
                    recipientUserId,
                    requesterUserEmail,
                    recipientUserEmail
                );

                // when & then
                expect(() => {
                    friend.accept(requesterUserId);
                }).toThrow(new FriendshipUpdateInvalidPermission());

                expect(() => {
                    friend.reject(requesterUserId);
                }).toThrow(new FriendshipUpdateInvalidPermission());
            });

            it('이미 수락/거절한 상태의 친구 관계를 또 업데이트 하려 할 경우 에러를 던진다.', () => {
                // give
                const requesterUserId = UserId.generate();
                const requesterUserEmail = Email.create('test@domain.com');
                const recipientUserId = UserId.generate();
                const recipientUserEmail = Email.create('now@domain.com');

                const friend = Friend.create(
                    requesterUserId,
                    recipientUserId,
                    requesterUserEmail,
                    recipientUserEmail
                );

                friend.accept(recipientUserId);

                // when & then
                expect(() => {
                    friend.accept(recipientUserId);
                }).toThrow(new FriendshipUpdateInvalidStatus(friend.status));

                expect(() => {
                    friend.reject(recipientUserId);
                }).toThrow(new FriendshipUpdateInvalidStatus(friend.status));
            });
        });
    });
});
