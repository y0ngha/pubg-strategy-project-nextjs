import { FriendQueryRepositoryPort } from '@domain/friend/port/repositories/friend-query-repository.port';
import { GetFriendListUseCase } from '@/application/friend/use-cases/get-friend-list.usecase';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { getFriendQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { Friend } from '@domain/friend/models/friend.model';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendStatus } from '@domain/friend/enum/friend-status.enum';

describe('GetFriendListUseCase', () => {
    let useCase: GetFriendListUseCase;
    let mockFriendQueryRepository: jest.Mocked<FriendQueryRepositoryPort>;

    beforeEach(() => {
        mockFriendQueryRepository = getFriendQueryRepositoryMocking();

        useCase = new GetFriendListUseCase(mockFriendQueryRepository);
    });

    describe('정상 조회', () => {
        it('각 친구 상태별로 나눠서 응답한다.', async () => {
            // give
            const userId = UserId.generate();

            mockFriendQueryRepository.findAcceptedFriendsByUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1].map(i => {
                        const recipientUserId = UserId.generate();

                        const friend: Friend = {
                            id: FriendId.generate().toString(),
                            requesterUserId: userId.toString(),
                            requesterUserEmail: Email.create(
                                `test${i}_requester@fixtures.com`
                            ).toString(),
                            recipientUserId: recipientUserId.toString(),
                            recipientUserEmail: Email.create(
                                `test${i}_recipient@fixtures.com`
                            ).toString(),
                            status: FriendStatus.ACCEPTED,
                            requestedAt: new Date(),
                            respondedAt: new Date(),
                        };

                        return friend;
                    });
                }
            );
            mockFriendQueryRepository.findReceivedFriendRequestsByRecipientUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1, 2].map(i => {
                        const friend: Friend = {
                            id: FriendId.generate().toString(),
                            requesterUserId: UserId.generate().toString(),
                            requesterUserEmail: Email.create(
                                `test${i}_requester@fixtures.com`
                            ).toString(),
                            recipientUserId: userId.toString(),
                            recipientUserEmail: Email.create(
                                `test${i}_recipient@fixtures.com`
                            ).toString(),
                            status: FriendStatus.PENDING,
                            requestedAt: new Date(),
                            respondedAt: null,
                        };

                        return friend;
                    });
                }
            );
            mockFriendQueryRepository.findSentFriendRequestsByRequesterUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1, 2, 3].map(i => {
                        const friend: Friend = {
                            id: FriendId.generate().toString(),
                            requesterUserId: userId.toString(),
                            requesterUserEmail: Email.create(
                                `test${i}_requester@fixtures.com`
                            ).toString(),
                            recipientUserId: UserId.generate().toString(),
                            recipientUserEmail: Email.create(
                                `test${i}_recipient@fixtures.com`
                            ).toString(),
                            status: FriendStatus.PENDING,
                            requestedAt: new Date(),
                            respondedAt: null,
                        };

                        return friend;
                    });
                }
            );

            // when
            const result = await useCase.execute();

            // then
            // then
            expect(
                mockFriendQueryRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendQueryRepository.findReceivedFriendRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendQueryRepository.findSentFriendRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(1);
            expect(result.receivedFriendRequests).toHaveLength(2);
            expect(result.sentFriendRequests).toHaveLength(3);
        });

        it('친구 관계가 없어도, 오류가 나지 않고 빈 배열을 응답한다.', async () => {
            // give
            mockFriendQueryRepository.findAcceptedFriendsByUserId.mockResolvedValue(
                []
            );
            mockFriendQueryRepository.findReceivedFriendRequestsByRecipientUserId.mockResolvedValue(
                []
            );
            mockFriendQueryRepository.findSentFriendRequestsByRequesterUserId.mockResolvedValue(
                []
            );

            // when
            const result = await useCase.execute();

            // then
            expect(
                mockFriendQueryRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendQueryRepository.findReceivedFriendRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendQueryRepository.findSentFriendRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(0);
            expect(result.receivedFriendRequests).toHaveLength(0);
            expect(result.sentFriendRequests).toHaveLength(0);
        });

        it('예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
            // given
            mockFriendQueryRepository.findAcceptedFriendsByUserId.mockRejectedValue(
                new Error()
            );

            //when & then
            await expect(() => useCase.execute()).rejects.toThrow(Error);
        });
    });
});
