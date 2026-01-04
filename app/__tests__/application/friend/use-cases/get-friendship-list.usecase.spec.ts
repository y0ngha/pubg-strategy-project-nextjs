import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { GetFriendshipListUseCase } from '@/application/friend/use-cases/get-friendship-list.usecase';
import { Friend } from '@domain/friend/entities/friend.entity';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';

describe('GetFriendshipListUseCase', () => {
    let useCase: GetFriendshipListUseCase;
    let mockFriendRepository: jest.Mocked<FriendRepositoryPort>;

    beforeEach(() => {
        mockFriendRepository = {
            save: jest.fn(),
            delete: jest.fn(),
            existsFriendshipBetween: jest.fn(),
            findById: jest.fn(),
            findAcceptedFriendsByUserId: jest.fn(),
            findReceivedFriendshipRequestsByRecipientUserId: jest.fn(),
            findSentFriendshipRequestsByRequesterUserId: jest.fn(),
        } as jest.Mocked<FriendRepositoryPort>;

        useCase = new GetFriendshipListUseCase(mockFriendRepository);
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
            mockFriendRepository.findReceivedFriendshipRequestsByRecipientUserId.mockImplementation(
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
            mockFriendRepository.findSentFriendshipRequestsByRequesterUserId.mockImplementation(
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
                id: userId.toString(),
            };

            // when
            const result = await useCase.execute(dto);

            // then
            // then
            expect(
                mockFriendRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findReceivedFriendshipRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findSentFriendshipRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(1);
            expect(result.receivedFriendshipRequests).toHaveLength(2);
            expect(result.sentFriendshipRequests).toHaveLength(3);
        });

        it('친구 관계가 없어도, 오류가 나지 않고 빈 배열을 응답한다.', async () => {
            // give
            mockFriendRepository.findAcceptedFriendsByUserId.mockResolvedValue(
                []
            );
            mockFriendRepository.findReceivedFriendshipRequestsByRecipientUserId.mockResolvedValue(
                []
            );
            mockFriendRepository.findSentFriendshipRequestsByRequesterUserId.mockResolvedValue(
                []
            );
            const dto = {
                id: 'a0f01e35-f96b-4dee-a75b-89cea500ce50',
            };

            // when
            const result = await useCase.execute(dto);

            // then
            expect(
                mockFriendRepository.findAcceptedFriendsByUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findReceivedFriendshipRequestsByRecipientUserId
            ).toHaveBeenCalledTimes(1);
            expect(
                mockFriendRepository.findSentFriendshipRequestsByRequesterUserId
            ).toHaveBeenCalledTimes(1);

            expect(result.friends).toHaveLength(0);
            expect(result.receivedFriendshipRequests).toHaveLength(0);
            expect(result.sentFriendshipRequests).toHaveLength(0);
        });
    });
});
