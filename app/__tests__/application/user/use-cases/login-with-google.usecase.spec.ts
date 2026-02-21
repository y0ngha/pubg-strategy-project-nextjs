import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import {
    getAuthenticationServiceMocking,
    getGoogleAuthServiceMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { getUserQueryRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { UserId } from '@domain/shared/value-objects/user-id';
import { AuthProvider } from '@domain/user/enums/auth-provider.enum';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';

describe('LoginWithGoogleUseCase', () => {
    let useCase: LoginWithGoogleUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockUserQueryRepository: jest.Mocked<UserQueryRepositoryPort>;
    let mockGoogleAuthService: jest.Mocked<GoogleAuthServicePort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();
        mockUserQueryRepository = getUserQueryRepositoryMocking();
        mockGoogleAuthService = getGoogleAuthServiceMocking();

        useCase = new LoginWithGoogleUseCase(
            mockGoogleAuthService,
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
                googleToken: 'test-1234-abcd',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            mockAuthenticationService.googleLogin.mockResolvedValue(token);
            mockUserQueryRepository.findByAccessToken.mockResolvedValue({
                id: userId,
                email: dto.email,
                authProvider: AuthProvider.GOOGLE,
                hasPassword: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(1);
            expect(result).toEqual(token);
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
                googleToken: 'test-1234-abcd',
            };

            mockAuthenticationService.googleLogin.mockRejectedValue(
                new Error('로그인 실패')
            );

            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);

            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(0);
        });

        it('로그인에 성공했으나, 유저를 못불러올 경우 에러를 던진다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                googleToken: 'test-1234-abcd',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            mockAuthenticationService.googleLogin.mockResolvedValue(token);
            mockUserQueryRepository.findByAccessToken.mockResolvedValue(null);

            // When & Then
            await expect(() => useCase.execute(dto)).rejects.toThrow(
                UserNotFoundException
            );

            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );
            expect(
                mockUserQueryRepository.findByAccessToken
            ).toHaveBeenCalledTimes(1);
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                googleToken: 'test-1234-abcd',
            };

            mockAuthenticationService.googleLogin.mockRejectedValue(
                new Error()
            );

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
