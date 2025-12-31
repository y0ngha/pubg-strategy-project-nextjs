import { LoginWithEmailRequestSchema } from '@/application/user/dto/login-with-email.dto';
import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';

describe('LoginWithEmailUseCase', () => {
    let useCase: LoginWithEmailUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        mockAuthenticationService = {
            login: jest.fn(),
            logout: jest.fn(),
            googleLogin: jest.fn(),
        } as jest.Mocked<AuthenticationServicePort>;

        mockPasswordCipher = {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
        } as jest.Mocked<PasswordCipherPort>;

        useCase = new LoginWithEmailUseCase(
            mockPasswordCipher,
            mockAuthenticationService
        );
    });

    describe('정상 로그인', () => {
        it('존재하는 유저로 로그인한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            mockAuthenticationService.login.mockResolvedValue(true);

            const validateDto = LoginWithEmailRequestSchema.parse(dto);

            // When
            const result = await useCase.execute(validateDto);

            // Then
            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();
        });
    });

    describe('에러 처리', () => {
        it('로그인에 실패할 경우 FALSE를 반환한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            mockAuthenticationService.login.mockResolvedValue(false);

            const validateDto = LoginWithEmailRequestSchema.parse(dto);

            // When
            const result = await useCase.execute(validateDto);

            // Then
            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);

            expect(result).toBeFalsy();
        });
    });
});
