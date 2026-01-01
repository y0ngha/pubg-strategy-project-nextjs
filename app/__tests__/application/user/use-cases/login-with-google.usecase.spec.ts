import { LoginWithGoogleUseCase } from '@/application/user/use-cases/login-with-google.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';

describe('LoginWithGoogleUseCase', () => {
    let useCase: LoginWithGoogleUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockGoogleAuthService: jest.Mocked<GoogleAuthServicePort>;

    beforeEach(() => {
        mockAuthenticationService = {
            login: jest.fn(),
            logout: jest.fn(),
            googleLogin: jest.fn(),
        } as jest.Mocked<AuthenticationServicePort>;

        mockGoogleAuthService = {
            getToken: jest.fn(),
        } as jest.Mocked<GoogleAuthServicePort>;

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

            mockAuthenticationService.googleLogin.mockResolvedValue(true);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );

            expect(result).toBeTruthy();
        });
    });

    describe('에러 처리', () => {
        it('로그인에 실패할 경우 FALSE를 반환한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                token: 'test-1234-abcd',
            };

            mockAuthenticationService.googleLogin.mockResolvedValue(false);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockAuthenticationService.googleLogin).toHaveBeenCalledTimes(
                1
            );

            expect(result).toBeFalsy();
        });
    });
});
