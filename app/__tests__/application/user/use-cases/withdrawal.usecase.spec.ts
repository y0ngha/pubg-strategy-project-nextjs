import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { WithdrawalUseCase } from '@/application/user/use-cases/withdrawal.usecase';
import { AuthenticationServicePort } from '@domain/user/port/out/authentication-service.port';
import {
    LogoutException,
    WithdrawalException,
} from '@domain/user/exceptions/user.exceptions';
import { UserId } from '@domain/shared/value-objects/user-id';

describe('WithdrawalUseCase', () => {
    let useCase: WithdrawalUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByUserId: jest.fn(),
            existsByEmail: jest.fn(),
            delete: jest.fn(),
        } as jest.Mocked<UserRepositoryPort>;

        mockAuthenticationService = {
            login: jest.fn(),
            logout: jest.fn(),
            googleLogin: jest.fn(),
        } as jest.Mocked<AuthenticationServicePort>;

        useCase = new WithdrawalUseCase(
            mockUserRepository,
            mockAuthenticationService
        );
    });

    describe('성공 테스트', () => {
        it('로그아웃도 성공하고, 회원탈퇴도 성공하면 True를 반환한다.', async () => {
            // Given
            const dto = {
                id: '550e8400-e29b-41d4-a716-446655440000',
            };

            mockAuthenticationService.logout.mockResolvedValue(true);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();
        });
    });

    describe('실패 테스트', () => {
        it('로그아웃이 실패하면 에러를 던진다.', async () => {
            // Given
            const dto = {
                id: '550e8400-e29b-41d4-a716-446655440000',
            };

            mockAuthenticationService.logout.mockImplementation(
                async (_: UserId): Promise<boolean> => {
                    throw new LogoutException('Test');
                }
            );

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new LogoutException('Test')
            );

            expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.delete).toHaveBeenCalledTimes(0);
        });

        it('회원탈퇴에 실패하면 에러를 던진다.', async () => {
            // Given
            const dto = {
                id: '550e8400-e29b-41d4-a716-446655440000',
            };

            mockAuthenticationService.logout.mockResolvedValue(true);

            mockUserRepository.delete.mockImplementation(
                async (_: UserId): Promise<void> => {
                    throw new WithdrawalException('Test');
                }
            );

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                new WithdrawalException('Test')
            );

            expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
        });
    });
});
