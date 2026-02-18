import { FriendStatus } from '@domain/friend/enum/friend-status.enum';
import { FriendUpdateInvalidStatus } from '@domain/friend/exceptions/friend.exceptions';
import { RejectReceivedFriendUseCase } from '@/application/friend/use-cases/reject-received-friend.usecase';
import { getFriendCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { FriendId } from '@domain/friend/value-objects/friend-id';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';

describe('RejectReceivedFriendUseCase', () => {
    let useCase: RejectReceivedFriendUseCase;
    let mockFriendCommandRepository: jest.Mocked<FriendCommandRepositoryPort>;

    const friendId = FriendId.generate();

    beforeEach(() => {
        mockFriendCommandRepository = getFriendCommandRepositoryMocking();

        useCase = new RejectReceivedFriendUseCase(mockFriendCommandRepository);
    });

    describe('성공 테스트', () => {
        it('PENDING 상태라면, Command를 생성하여 Repository에 전달한다.', async () => {
            // give
            const currentStatus = FriendStatus.PENDING;
            const dto = {
                id: friendId.toString(),
                currentStatus: currentStatus,
            };

            // when
            await useCase.execute(dto);

            // then
            expect(mockFriendCommandRepository.reject).toHaveBeenCalledTimes(1);
            expect(mockFriendCommandRepository.reject).toHaveBeenCalledWith(
                expect.objectContaining({
                    friendId: friendId,
                    currentStatus: currentStatus,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('PENDING 상태가 아니라면, Command 생성 과정에서 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const currentStatus = FriendStatus.CANCELED;
            const dto = {
                id: friendId.toString(),
                currentStatus: currentStatus,
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                FriendUpdateInvalidStatus
            );
            expect(mockFriendCommandRepository.reject).toHaveBeenCalledTimes(0);
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // given
            jest.spyOn(
                mockFriendCommandRepository,
                'reject'
            ).mockImplementation(() => {
                throw new Error();
            });

            const currentStatus = FriendStatus.PENDING;
            const dto = {
                id: friendId.toString(),
                currentStatus: currentStatus,
            };

            //when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
