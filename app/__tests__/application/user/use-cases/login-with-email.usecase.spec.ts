import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import {
    getAuthenticationServiceMocking,
    getPasswordCipherMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { getUserQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { AuthProvider } from '@domain/user/enums/auth-provider.enum';
import { UserId } from '@domain/shared/value-objects/user-id';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';

describe('LoginWithEmailUseCase', () => {
    let useCase: LoginWithEmailUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockUserQueryRepository: jest.Mocked<UserQueryRepositoryPort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();
        mockUserQueryRepository = getUserQueryRepositoryMocking();
        mockPasswordCipher = getPasswordCipherMocking();

        useCase = new LoginWithEmailUseCase(
            mockPasswordCipher,
            mockAuthenticationService,
            mockUserQueryRepository
        );
    });

    describe('정상 로그인', () => {
        it('존재하는 유저로 로그인한다.', async () => {
            // Given
            const userId = UserId.generate().toString();

            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            mockAuthenticationService.login.mockResolvedValue(token);
            mockUserQueryRepository.findByAccessToken.mockResolvedValue({
                id: userId,
                email: dto.email,
                authProvider: AuthProvider.EMAIL,
                hasPassword: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(1);

            expect(result.accessToken).toEqual(token.accessToken);
            expect(result.refreshToken).toEqual(token.refreshToken);
            expect(result.user).toEqual({
                id: userId,
                email: dto.email,
            });
        });
    });

    describe('에러 처리', () => {
        it('로그인에 실패할 경우 에러를 던진다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            mockAuthenticationService.login.mockRejectedValue(
                new Error('로그인 실패')
            );

            // When & Then
            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);

            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(0);
        });

        it('로그인에 성공했으나, 유저를 못불러올 경우 에러를 던진다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            mockAuthenticationService.login.mockResolvedValue(token);
            mockUserQueryRepository.findByAccessToken.mockResolvedValue(null);

            // When & Then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                UserNotFoundException
            );

            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(1);
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            mockAuthenticationService.login.mockRejectedValue(new Error());

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
