import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { GetFriendListUseCase } from '@/application/friend/use-cases/get-friend-list.usecase';
import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { getFriendRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { FriendMapper } from '@/application/friend/mappers/friend.mapper';

describe('GetFriendListUseCase', () => {
    let useCase: GetFriendListUseCase;
    let mockFriendRepository: jest.Mocked<FriendRepositoryPort>;
    const friendMapper = new FriendMapper();

    beforeEach(() => {
        mockFriendRepository = getFriendRepositoryMocking();

        useCase = new GetFriendListUseCase(mockFriendRepository, friendMapper);
    });

    describe('정상 조회', () => {
        it('각 친구 상태별로 나눠서 응답한다.', async () => {
            // give
            const userId = UserId.generate();

            mockFriendRepository.findAcceptedFriendsByUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1].map(i => {
                        const recipientUserId = UserId.generate();

                        const friend = Friend.create(
                            userId,
                            recipientUserId,
                            Email.create(`test${i}_requester@fixtures.com`),
                            Email.create(`test${i}_recipient@fixtures.com`)
                        );

                        friend.accept(recipientUserId);

                        return friend;
                    });
                }
            );
            mockFriendRepository.findReceivedFriendRequestsByRecipientUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1, 2].map(i => {
                        return Friend.create(
                            UserId.generate(),
                            userId,
                            Email.create(`test${i}_requester@fixtures.com`),
                            Email.create(`test${i}_recipient@fixtures.com`)
                        );
                    });
                }
            );
            mockFriendRepository.findSentFriendRequestsByRequesterUserId.mockImplementation(
                async (): Promise<Friend[]> => {
                    return [1, 2, 3].map(i => {
                        return Friend.create(
                            userId,
                            UserId.generate(),
                            Email.create(`test${i}_requester@fixtures.com`),
                            Email.create(`test${i}_recipient@fixtures.com`)
                        );
                    });
                }
            );
            const dto = {
                userId: userId.toString(),
            };

            // when
            const result = await useCase.execute(dto);

            // then
            // then
            expect(
                mockFriendRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findReceivedFriendRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findSentFriendRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(1);
            expect(result.receivedFriendRequests).toHaveLength(2);
            expect(result.sentFriendRequests).toHaveLength(3);
        });

        it('친구 관계가 없어도, 오류가 나지 않고 빈 배열을 응답한다.', async () => {
            // give
            mockFriendRepository.findAcceptedFriendsByUserId.mockResolvedValue(
                []
            );
            mockFriendRepository.findReceivedFriendRequestsByRecipientUserId.mockResolvedValue(
                []
            );
            mockFriendRepository.findSentFriendRequestsByRequesterUserId.mockResolvedValue(
                []
            );

            const dto = {
                userId: 'a0f01e35-f96b-4dee-a75b-89cea500ce50',
            };
            // when
            const result = await useCase.execute(dto);

            // then
            expect(
                mockFriendRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findReceivedFriendRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findSentFriendRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(0);
            expect(result.receivedFriendRequests).toHaveLength(0);
            expect(result.sentFriendRequests).toHaveLength(0);
        });

        it('예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
            // given
            mockFriendRepository.findAcceptedFriendsByUserId.mockRejectedValue(
                new Error()
            );

            const dto = {
                userId: 'a0f01e35-f96b-4dee-a75b-89cea500ce50',
            };

            //when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
