import { RequestFriendUseCase } from '@/application/friend/use-cases/request-friend.usecase';
import { UserId } from '@domain/shared/value-objects/user-id';
import { FriendCommandRepositoryPort } from '@domain/friend/port/repositories/friend-command-repository.port';
import { getFriendCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { InvalidEntityIdException } from '@domain/shared/exceptions/entity-id.exceptions';

describe('RequestFriendUseCase', () => {
    let useCase: RequestFriendUseCase;
    let mockFriendCommandRepository: jest.Mocked<FriendCommandRepositoryPort>;

    const recipientUserId = UserId.generate();

    beforeEach(() => {
        mockFriendCommandRepository = getFriendCommandRepositoryMocking();
        useCase = new RequestFriendUseCase(mockFriendCommandRepository);
    });

    describe('성공 테스트', () => {
        it('정상적인 UserId를 보내면, Command를 생성하여 Repository에 전달한다.', async () => {
            // give
            const dto = {
                recipientUserId: recipientUserId.toString(),
            };

            // when
            await useCase.execute(dto);

            // then
            expect(mockFriendCommandRepository.request).toHaveBeenCalledTimes(
                1
            );
            expect(mockFriendCommandRepository.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    recipientUserId: recipientUserId,
                })
            );
        });
    });

    describe('실패 테스트', () => {
        it('UUID 형태가 아닌 UserId를 보내면, DTO 파싱 과정에서 에러가 발생하여 Repository에 전달하지도 않는다.', async () => {
            // give
            const dto = {
                recipientUserId: 'asdf-1234',
            };

            // when & then
            await expect(useCase.execute(dto)).rejects.toThrow(
                InvalidEntityIdException
            );
            expect(mockFriendCommandRepository.request).toHaveBeenCalledTimes(
                0
            );
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            jest.spyOn(
                mockFriendCommandRepository,
                'request'
            ).mockImplementation(() => {
                throw new Error();
            });

            const dto = {
                recipientUserId: recipientUserId.toString(),
            };

            //when & then
            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
