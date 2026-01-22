import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '@/domain/user/entities/user.entity';
import { AuthProvider } from '@domain/user/enums/auth-provider.enum';
import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { Password } from '@/domain/user/value-objects/password';
import { getUserRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';

describe('GetCurrentUserUseCase', () => {
    let useCase: GetCurrentUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockUserRepository = getUserRepositoryMocking();

        useCase = new GetCurrentUserUseCase(mockUserRepository);
    });

    describe('정상 조회', () => {
        it('존재하는 유저를 조회한다.', async () => {
            // Given
            mockUserRepository.findByAccessToken.mockImplementation(
                async (): Promise<User | null> => {
                    return User.reconstruct(
                        UserId.generate(),
                        Email.create('test@domain.com'),
                        Password.create('Asdf1234@'),
                        AuthProvider.EMAIL,
                        new Date(),
                        new Date()
                    );
                }
            );

            // When
            const result = await useCase.execute();

            // Then
            expect(mockUserRepository.findByAccessToken).toHaveBeenCalledTimes(
                1
            );
            expect(result.email).toBe('test@domain.com');
        });

        describe('에러 처리', () => {
            it('불러올 유저가 없을 때 없을 때 에러를 던진다.', async () => {
                // Given
                mockUserRepository.findByAccessToken.mockResolvedValue(null);

                // When & Then
                await expect(useCase.execute()).rejects.toThrow(
                    UserNotFoundException
                );
            });

            it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
                // Given
                mockUserRepository.findByAccessToken.mockRejectedValue(
                    new Error()
                );

                // When & Then
                await expect(useCase.execute()).rejects.toThrow(Error);
            });
        });
    });
});
