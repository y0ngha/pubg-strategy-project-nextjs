import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { getUserCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { UserId } from '@domain/shared/value-objects/user-id';
import { Email } from '@domain/shared/value-objects/email';
import { AuthProvider } from '@domain/user/enums/auth-provider.enum';

describe('RegisterWithEmailUseCase', () => {
    let useCase: RegisterWithEmailUseCase;
    let mockUserCommandRepository: jest.Mocked<UserCommandRepositoryPort>;

    beforeEach(() => {
        mockUserCommandRepository = getUserCommandRepositoryMocking();

        useCase = new RegisterWithEmailUseCase(mockUserCommandRepository);
    });

    describe('정상 회원가입', () => {
        it('유효한 이메일과 비밀번호로 회원가입한다', async () => {
            // Given
            mockUserCommandRepository.registerWithEmail.mockResolvedValue({
                id: UserId.generate().toString(),
                email: Email.create('test@domain.com').toString(),
                authProvider: AuthProvider.EMAIL,
                hasPassword: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const dto = {
                email: 'test@example.com',
                password: 'Asdf1234!',
            };

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(result).toBeTruthy();
        });

        describe('에러 처리', () => {
            it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
                // Given
                const dto = {
                    email: 'test@example.com',
                    password: 'Asdf1234!',
                };

                mockUserCommandRepository.registerWithEmail.mockRejectedValue(
                    new Error('Internal error')
                );

                // When & Then
                await expect(useCase.execute(dto)).rejects.toThrow(Error);
            });
        });
    });
});
