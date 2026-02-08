import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import {
    FriendUpdateInvalidPermission,
    FriendUpdateInvalidStatus,
} from '@domain/friend/exceptions/friend.exceptions';
import { FriendId } from '@domain/friend/value-objects/friend-id';

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
            expect(friend.status).toBe(FriendStatus.PENDING);
        });
    });

    describe('Reconstruct', () => {
        it('친구 관계를 재생성한다.', () => {
            // given
            const id = FriendId.generate();
            const requesterUserId = UserId.generate();
            const requesterUserEmail = Email.create('test@domain.com');
            const status = FriendStatus.REJECTED;
            const recipientUserId = UserId.generate();
            const recipientUserEmail = Email.create('now@domain.com');
            const requestedAt = new Date();
            const respondedAt = new Date();

            // when
            const friend = Friend.reconstruct(
                id,
                requesterUserId,
                recipientUserId,
                status,
                requesterUserEmail,
                recipientUserEmail,
                requestedAt,
                respondedAt
            );

            // then
            expect(friend).toBeInstanceOf(Friend);
            expect(friend.id).toEqual(id);
            expect(friend.requesterUserId).toEqual(requesterUserId);
            expect(friend.requesterUserEmail).toEqual(requesterUserEmail);
            expect(friend.status).toEqual(status);
            expect(friend.recipientUserId).toEqual(recipientUserId);
            expect(friend.recipientUserEmail).toEqual(recipientUserEmail);
            expect(friend.requestedAt).toEqual(requestedAt);
            expect(friend.respondedAt).toEqual(respondedAt);
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
                expect(friend.status).toBe(FriendStatus.ACCEPTED);
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
                expect(friend.status).toBe(FriendStatus.REJECTED);
                expect(friend.respondedAt).not.toBeNull();
            });

            it('내가 보낸 친구 요청이고, PENDING 상태일 때 취소할 수 있다.', () => {
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
                friend.cancel(requesterUserId);

                // then
                expect(friend.status).toBe(FriendStatus.CANCELED);
                expect(friend.respondedAt).toBeNull();
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
                }).toThrow(FriendUpdateInvalidPermission);

                expect(() => {
                    friend.reject(requesterUserId);
                }).toThrow(FriendUpdateInvalidPermission);
            });

            it('내가 보낸 친구 요청이 아닌데, 취소 하려 할 경우 에러를 던진다.', () => {
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
                    friend.cancel(recipientUserId);
                }).toThrow(FriendUpdateInvalidPermission);
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
                }).toThrow(FriendUpdateInvalidStatus);

                expect(() => {
                    friend.reject(recipientUserId);
                }).toThrow(FriendUpdateInvalidStatus);

                expect(() => {
                    friend.cancel(requesterUserId);
                }).toThrow(FriendUpdateInvalidStatus);
            });
        });
    });
});
