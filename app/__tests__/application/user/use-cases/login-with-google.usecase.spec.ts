import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import {
    getAuthenticationServiceMocking,
    getGoogleAuthServiceMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';

describe('LoginWithGoogleUseCase', () => {
    let useCase: LoginWithGoogleUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockGoogleAuthService: jest.Mocked<GoogleAuthServicePort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();

        mockGoogleAuthService = getGoogleAuthServiceMocking();

        useCase = new LoginWithGoogleUseCase(
            mockGoogleAuthService,
            mockAuthenticationService
        );
    });

    describe('정상 로그인', () => {
        it('존재하는 유저로 로그인한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                token: 'test-1234-abcd',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            mockAuthenticationService.googleLogin.mockResolvedValue(token);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );

            expect(result).toEqual(token);
        });
    });

    describe('에러 처리', () => {
        it('로그인에 실패할 경우 FALSE를 반환한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                token: 'test-1234-abcd',
            };

            mockAuthenticationService.googleLogin.mockRejectedValue(
                new Error('로그인 실패')
            );

            await expect(() => useCase.execute(dto)).rejects.toThrow(Error);

            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                token: 'test-1234-abcd',
            };

            mockAuthenticationService.googleLogin.mockRejectedValue(
                new Error()
            );

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
