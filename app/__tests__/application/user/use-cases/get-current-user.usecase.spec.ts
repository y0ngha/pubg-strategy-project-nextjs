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
            const dto = {
                id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
            };

            mockUserRepository.findByUserId.mockImplementation(
                async (id: UserId): Promise<User | null> => {
                    return User.reconstruct(
                        id,
                        Email.create('test@domain.com'),
                        Password.create('Asdf1234@'),
                        AuthProvider.EMAIL,
                        new Date(),
                        new Date()
                    );
                }
            );

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
            expect(result.id).toBe(dto.id);
            expect(result.email).toBe('test@domain.com');
        });

        describe('에러 처리', () => {
            it('존재하지 않는 유저를 조회했을 때 에러를 던진다.', async () => {
                // Given
                const dto = {
                    id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                };

                mockUserRepository.findByUserId.mockResolvedValue(null);

                // When & Then
                await expect(useCase.execute(dto)).rejects.toThrow(
                    UserNotFoundException
                );
            });

            it('Repository에서 에러 발생시 에러를 전파한다', async () => {
                // Given
                const dto = {
                    id: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                };

                mockUserRepository.findByUserId.mockRejectedValue(new Error());

                // When & Then
                await expect(useCase.execute(dto)).rejects.toThrow(Error);
            });
        });
    });
});
