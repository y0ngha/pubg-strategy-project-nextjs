import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import {
    getAuthenticationServiceMocking,
    getPasswordCipherMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';

describe('LoginWithEmailUseCase', () => {
    let useCase: LoginWithEmailUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();

        mockPasswordCipher = getPasswordCipherMocking();

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

            // When
            const result = await useCase.execute(dto);

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

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);

            expect(result).toBeFalsy();
        });

        it('인증 서비스에서 로그인 에러 발생시 에러를 전파한다', async () => {
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
