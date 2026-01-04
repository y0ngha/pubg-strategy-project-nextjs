import { AcceptFriendshipUseCase } from '@/application/friend/use-cases/accept-friendship.usecase';
import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { FriendshipStatus } from '@domain/friend/enum/friendship-status.enum';
import {
    FriendNotFoundException,
    FriendshipUpdateInvalidPermission,
    FriendshipUpdateInvalidStatus,
} from '@domain/friend/exceptions/friend.exceptions';

describe('AcceptFriendshipUseCase', () => {
    let useCase: AcceptFriendshipUseCase;
    let mockFriendRepository: jest.Mocked<FriendRepositoryPort>;

    beforeEach(() => {
        mockFriendRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findAcceptedFriendsByUserId: jest.fn(),
            findReceivedFriendshipRequestsByRecipientUserId: jest.fn(),
            findSentFriendshipRequestsByRequesterUserId: jest.fn(),
        } as jest.Mocked<FriendRepositoryPort>;

        useCase = new AcceptFriendshipUseCase(mockFriendRepository);
    });

    describe('성공 테스트', () => {
        it('요청 받은 친구 관계가 존재하고, 받은 사람이 본인이며, 친구 상태가 PENDING일 때 성공한다.', async () => {
            // give
            const requesterUserId = 'a0f01e35-f96b-4dee-a75b-89cea500ce50';
            const recipientUserId = 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7';

            const requesterUserEmail = 'requester@domain.com';
            const recipientUserEmail = 'recipient@domain.com';

            mockFriendRepository.findById.mockImplementation(
                async (): Promise<Friend | null> => {
                    return Friend.create(
                        UserId.create(requesterUserId),
                        UserId.create(recipientUserId),
                        Email.create(requesterUserEmail),
                        Email.create(recipientUserEmail)
                    );
                }
            );

            const dto = {
                id: '869215ed-3baf-4abb-a511-b164f0cc716e',
                userId: recipientUserId,
            };

            // when
            await useCase.execute(dto);

            // then
            expect(mockFriendRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(1);

            const savedFriend = mockFriendRepository.save.mock.calls[0][0];

            expect(savedFriend.status).toBe(FriendshipStatus.ACCEPTED);
            expect(savedFriend.respondedAt).not.toBeNull();
        });
    });
    describe('실패 테스트', () => {
        it('요청 받은 친구 관계가 없을 때 에러를 던진다.', async () => {
            // give
            const recipientUserId = 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7';

            mockFriendRepository.findById.mockImplementation(
                async (): Promise<Friend | null> => {
                    return null;
                }
            );

            const dto = {
                id: '869215ed-3baf-4abb-a511-b164f0cc716e',
                userId: recipientUserId,
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new FriendNotFoundException(dto.id)
            );
            expect(mockFriendRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(0);
        });

        it('본인이 받은 요청이 아닌 경우 에러를 던진다.', async () => {
            // give
            const requesterUserId = 'a0f01e35-f96b-4dee-a75b-89cea500ce50';
            const recipientUserId = 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7';

            const requesterUserEmail = 'requester@domain.com';
            const recipientUserEmail = 'recipient@domain.com';

            mockFriendRepository.findById.mockImplementation(
                async (): Promise<Friend | null> => {
                    return Friend.create(
                        UserId.create(requesterUserId),
                        UserId.create(recipientUserId),
                        Email.create(requesterUserEmail),
                        Email.create(recipientUserEmail)
                    );
                }
            );

            const dto = {
                id: '869215ed-3baf-4abb-a511-b164f0cc716e',
                userId: requesterUserId,
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new FriendshipUpdateInvalidPermission()
            );

            expect(mockFriendRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(0);
        });

        it('요청 받은 친구 관계가 이미 수락된 상태인 경우 에러를 던진다.', async () => {
            // give
            const requesterUserId = 'a0f01e35-f96b-4dee-a75b-89cea500ce50';
            const recipientUserId = 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7';

            const requesterUserEmail = 'requester@domain.com';
            const recipientUserEmail = 'recipient@domain.com';

            mockFriendRepository.findById.mockImplementation(
                async (): Promise<Friend | null> => {
                    const friend = Friend.create(
                        UserId.create(requesterUserId),
                        UserId.create(recipientUserId),
                        Email.create(requesterUserEmail),
                        Email.create(recipientUserEmail)
                    );

                    friend.accept(UserId.create(recipientUserId));

                    return friend;
                }
            );

            const dto = {
                id: '869215ed-3baf-4abb-a511-b164f0cc716e',
                userId: recipientUserId,
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new FriendshipUpdateInvalidStatus(FriendshipStatus.ACCEPTED)
            );

            expect(mockFriendRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(0);
        });

        it('요청 받은 친구 관계가 이미 거절된 상태인 경우 에러를 던진다.', async () => {
            // give
            const requesterUserId = 'a0f01e35-f96b-4dee-a75b-89cea500ce50';
            const recipientUserId = 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7';

            const requesterUserEmail = 'requester@domain.com';
            const recipientUserEmail = 'recipient@domain.com';

            mockFriendRepository.findById.mockImplementation(
                async (): Promise<Friend | null> => {
                    const friend = Friend.create(
                        UserId.create(requesterUserId),
                        UserId.create(recipientUserId),
                        Email.create(requesterUserEmail),
                        Email.create(recipientUserEmail)
                    );
                    friend.reject(UserId.create(recipientUserId));

                    return friend;
                }
            );

            const dto = {
                id: '869215ed-3baf-4abb-a511-b164f0cc716e',
                userId: recipientUserId,
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new FriendshipUpdateInvalidStatus(FriendshipStatus.REJECTED)
            );

            expect(mockFriendRepository.findById).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(0);
        });
    });
});
