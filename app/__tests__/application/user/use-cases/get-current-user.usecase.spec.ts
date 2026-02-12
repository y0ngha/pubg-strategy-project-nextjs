import { GetCurrentUserUseCase } from '@/application/user/use-cases/get-current-user.usecase';
import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { AuthProvider } from '@domain/user/enums/auth-provider.enum';
import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { getUserQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { User } from '@domain/user/models/user.model';

describe('GetCurrentUserUseCase', () => {
    let useCase: GetCurrentUserUseCase;
    let mockUserQueryRepository: jest.Mocked<UserQueryRepositoryPort>;

    beforeEach(() => {
        mockUserQueryRepository = getUserQueryRepositoryMocking();

        useCase = new GetCurrentUserUseCase(mockUserQueryRepository);
    });

    describe('정상 조회', () => {
        it('존재하는 유저를 조회한다.', async () => {
            // Given
            mockUserQueryRepository.findByAccessToken.mockImplementation(
                async (): Promise<User | null> => {
                    return {
                        id: UserId.generate().toString(),
                        email: Email.create('test@domain.com').toString(),
                        authProvider: AuthProvider.EMAIL,
                        hasPassword: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }
            );

            // When
            const result = await useCase.execute();

            // Then
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(1);
            expect(result.email).toBe('test@domain.com');
        });

        describe('에러 처리', () => {
            it('불러올 유저가 없을 때 없을 때 에러를 던진다.', async () => {
                // Given
                mockUserQueryRepository.findByAccessToken.mockResolvedValue(
                    null
                );

                // When & Then
                await expect(useCase.execute()).rejects.toThrow(
                    UserNotFoundException
                );
            });

            it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
                // Given
                mockUserQueryRepository.findByAccessToken.mockRejectedValue(
                    new Error()
                );

                // When & Then
                await expect(useCase.execute()).rejects.toThrow(Error);
            });
        });
    });
});
