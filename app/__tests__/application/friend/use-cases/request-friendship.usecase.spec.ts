import { FriendRepositoryPort } from '@domain/friend/port/out/friend-repository.port';
import { FriendshipStatus } from '@domain/friend/enum/friendship-status.enum';
import { RequestFriendshipUseCase } from '@/application/friend/use-cases/request-friendship.usecase';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { User } from '@domain/user/entities/user.entity';
import { Email } from '@domain/shared/value-objects/email';
import { UserId } from '@domain/shared/value-objects/user-id';
import { AlreadyBecameFriendshipException } from '@domain/friend/exceptions/friend.exceptions';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';
import {
    getFriendRepositoryMocking,
    getUserRepositoryMocking,
} from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('RequestFriendshipUseCase', () => {
    let useCase: RequestFriendshipUseCase;
    let mockFriendRepository: jest.Mocked<FriendRepositoryPort>;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    let requester: User;
    let recipient: User;

    beforeEach(() => {
        mockFriendRepository = getFriendRepositoryMocking();
        mockUserRepository = getUserRepositoryMocking();

        requester = User.createWithSSO(Email.create('mockA@fixtures.com'));
        recipient = User.createWithSSO(Email.create('mockB@fixtures.com'));

        mockUserRepository.findByUserId.mockImplementation(
            async (id: UserId): Promise<User | null> => {
                if (id.equals(requester.id)) {
                    return requester;
                } else if (id.equals(recipient.id)) {
                    return recipient;
                }

                return null;
            }
        );

        useCase = new RequestFriendshipUseCase(
            mockFriendRepository,
            mockUserRepository
        );
    });

    describe('성공 테스트', () => {
        it('친구 관계가 맺어져있지 않고, 두 유저 모두 존재할 때 친구 요청 보내기는 성공한다.', async () => {
            // give
            mockFriendRepository.existsFriendshipBetween.mockResolvedValue(
                false
            );

            const dto = {
                requesterUserId: requester.id.toString(),
                recipientUserId: recipient.id.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(2);
            expect(
                mockFriendRepository.existsFriendshipBetween
            ).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(1);

            const savedFriend = mockFriendRepository.save.mock.calls[0][0];

            expect(savedFriend.status).toBe(FriendshipStatus.PENDING);
            expect(savedFriend.recipientUserId).toBe(recipient.id);
            expect(savedFriend.requesterUserId).toBe(requester.id);
        });
    });

    describe('실패 테스트', () => {
        it('유저가 없을 때 에러를 던진다.', async () => {
            // give
            mockUserRepository.findByUserId.mockResolvedValue(null);

            const dto = {
                requesterUserId: 'a0f01e35-f96b-4dee-a75b-89cea500ce50',
                recipientUserId: 'c92c6abc-82aa-423f-83e9-9e2823c1bcf7',
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                UserNotFoundException
            );

            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(2);
        });

        it('이미 친구 관계일 때 에러를 던진다.', async () => {
            // give
            mockFriendRepository.existsFriendshipBetween.mockResolvedValue(
                true
            );

            const dto = {
                requesterUserId: requester.id.toString(),
                recipientUserId: recipient.id.toString(),
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                AlreadyBecameFriendshipException
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(2);
            expect(
                mockFriendRepository.existsFriendshipBetween
            ).toHaveBeenCalledTimes(1);
            expect(mockFriendRepository.save).toHaveBeenCalledTimes(0);
        });

        it('도메인 엔티티에서 예외가 발생하면, 예외가 그대로 전파되어야 한다', async () => {
            // given
            mockFriendRepository.existsFriendshipBetween.mockRejectedValue(
                new Error()
            );

            const dto = {
                requesterUserId: requester.id.toString(),
                recipientUserId: recipient.id.toString(),
            };

            //when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
