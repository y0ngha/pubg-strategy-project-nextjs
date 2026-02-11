import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { ChangePasswordRequestSchema } from '@/application/user/dto/change-password.dto';
import { User } from '@domain/user/entities/user.entity';
import { Email } from '@domain/shared/value-objects/email';
import {
    ChangePasswordException,
    InvalidPasswordException,
} from '@domain/user/exceptions/user.exceptions';
import { getUserRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import {
    getPasswordCipherMocking,
    getPasswordValidatorServiceMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { Password } from '@domain/user/value-objects/password';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';

describe('ChangePasswordUseCase', () => {
    let useCase: ChangePasswordUseCase;
    let mockUserRepository: jest.Mocked<UserRepositoryPort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;
    let mockPasswordValidatorService: jest.Mocked<PasswordValidatorPort>;

    let userFixture: User;

    beforeEach(() => {
        mockUserRepository = getUserRepositoryMocking();
        mockPasswordCipher = getPasswordCipherMocking();
        mockPasswordValidatorService = getPasswordValidatorServiceMocking();

        useCase = new ChangePasswordUseCase(
            mockUserRepository,
            mockPasswordCipher,
            mockPasswordValidatorService
        );

        userFixture = User.createWithEmail(
            Email.create('test@domain.com'),
            Password.reconstruct('encrypted:Abcd1234@')
        );

        mockUserRepository.findByUserId.mockResolvedValue(userFixture);

        mockPasswordCipher.encrypt.mockImplementation(value => {
            return `encrypted:${value}`;
        });
    });

    describe('정상 변경', () => {
        it('현재 비밀번호가 맞고, 비밀번호 유효성이 전부 통과한다면 성공한다.', async () => {
            // Give
            mockPasswordValidatorService.passwordMatchValidate.mockReturnValue(
                true
            );
            mockPasswordValidatorService.passwordDifferentValidate.mockReturnValue(
                true
            );
            mockPasswordValidatorService.emailIncludedValidate.mockReturnValue(
                true
            );
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'Abcd1234!',
            };

            mockPasswordValidatorService.emailIncludedValidate.mockReturnValue(
                true
            );

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(
                mockPasswordValidatorService.emailIncludedValidate
            ).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();

            const savedUser = mockUserRepository.save.mock.calls[0][0] as User;

            expect(savedUser.password?.toString()).toEqual(
                `encrypted:${dto.newPassword}`
            );
        });
    });

    describe('변경 실패', () => {
        it('현재 비밀번호가 같지 않을 경우 에러를 던진다.', async () => {
            // Give
            mockPasswordValidatorService.passwordMatchValidate.mockReturnValue(
                false
            );
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Wrong1234@',
                newPassword: 'Abcd1234!',
            };

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                ChangePasswordException
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
        });

        it('현재 비밀번호가 같지만, 비밀번호 유효성 정책(이메일과 같은 경우) 에 실패했을 경우 에러를 던진다.', async () => {
            // Give
            mockPasswordValidatorService.passwordMatchValidate.mockReturnValue(
                true
            );
            mockPasswordValidatorService.passwordDifferentValidate.mockReturnValue(
                true
            );
            mockPasswordValidatorService.emailIncludedValidate.mockReturnValue(
                false
            );
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'Test1234!',
            };

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                InvalidPasswordException
            );
            expect(
                mockPasswordValidatorService.emailIncludedValidate
            ).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
        });

        it('현재 비밀번호가 같지만, 비밀번호 유효성 정책(대소문자, 특문 등) 에 실패했을 경우 에러를 던진다.', async () => {
            // Give
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'test1234!',
            };

            // When & Then
            expect(() => {
                ChangePasswordRequestSchema.parse(dto);
            }).toThrow(InvalidPasswordException);
        });

        it('현재 비밀번호와 변경하려고 하는 비밀번호가 같은 경우 에러를 던진다.', async () => {
            // Give
            mockPasswordValidatorService.emailIncludedValidate.mockReturnValue(
                true
            );
            mockPasswordValidatorService.passwordDifferentValidate.mockReturnValue(
                false
            );
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'Abcd1234@',
            };

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                ChangePasswordException
            );
            expect(mockUserRepository.findByUserId).toHaveBeenCalledTimes(1);
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'test1234!',
            };

            mockUserRepository.findByUserId.mockRejectedValue(new Error());

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
