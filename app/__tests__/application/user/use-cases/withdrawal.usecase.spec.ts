import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';
import { WithdrawalException } from '@domain/user/exceptions/user.exceptions';
import { getUserCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';

describe('WithdrawalUseCase', () => {
    let useCase: WithdrawalUseCase;
    let mockUserCommandRepository: jest.Mocked<UserCommandRepositoryPort>;

    beforeEach(() => {
        mockUserCommandRepository = getUserCommandRepositoryMocking();

        useCase = new WithdrawalUseCase(mockUserCommandRepository);
    });

    describe('성공 테스트', () => {
        it('회원탈퇴가 성공하면 True를 반환한다.', async () => {
            // Given
            mockUserCommandRepository.withdrawal.mockResolvedValue(true);

            // When
            const result = await useCase.execute();

            // Then
            expect(mockUserCommandRepository.withdrawal).toHaveBeenCalledTimes(
                1
            );

            expect(result).toBeTruthy();
        });
    });

    describe('실패 테스트', () => {
        it('회원탈퇴에 실패하면 에러를 던진다.', async () => {
            // Given
            mockUserCommandRepository.withdrawal.mockRejectedValue(
                new WithdrawalException('')
            );

            // When & Then
            await expect(useCase.execute()).rejects.toThrow(
                WithdrawalException
            );

            expect(mockUserCommandRepository.withdrawal).toHaveBeenCalledTimes(
                1
            );
        });
    });
});
