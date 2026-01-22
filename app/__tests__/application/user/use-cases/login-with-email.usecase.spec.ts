import { LoginWithEmailUseCase } from '@/application/user/use-cases/login-with-email.usecase';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import {
    getAuthenticationServiceMocking,
    getPasswordCipherMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { getUserRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { User } from '@domain/user/entities/user.entity';
import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';

describe('LoginWithEmailUseCase', () => {
    let useCase: LoginWithEmailUseCase;
    let mockAuthenticationService: jest.Mocked<AuthenticationServicePort>;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;

    beforeEach(() => {
        mockAuthenticationService = getAuthenticationServiceMocking();

        mockUserRepository = getUserRepositoryMocking();

        mockPasswordCipher = getPasswordCipherMocking();

        useCase = new LoginWithEmailUseCase(
            mockPasswordCipher,
            mockAuthenticationService,
            mockUserRepository
        );
    });

    describe('정상 로그인', () => {
        it('존재하는 유저로 로그인한다.', async () => {
            // Given
            const dto = {
                email: 'test@test.com',
                password: 'Abcd1234!',
            };

            const token = {
                accessToken: '1234',
                refreshToken: '2345',
            };

            const user = User.createWithEmail(
                Email.create(dto.email),
                Password.create(dto.password)
            );

            mockAuthenticationService.login.mockResolvedValue(token);
            mockUserRepository.findByAccessToken.mockResolvedValue(user);

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(mockPasswordCipher.encrypt).toHaveBeenCalledTimes(1);
            expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.findByAccessToken).toHaveBeenCalledTimes(
                1
            );

            expect(result.accessToken).toEqual(token.accessToken);
            expect(result.refreshToken).toEqual(token.refreshToken);
            expect(result.user.id).toEqual(user.id.toString());
            expect(result.user.email).toEqual(user.email.toString());
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
            expect(mockUserRepository.findByAccessToken).toHaveBeenCalledTimes(
                0
            );
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
