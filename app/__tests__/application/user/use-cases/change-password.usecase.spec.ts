import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { ChangePasswordUseCase } from '@/application/user/use-cases/change-password.usecase';
import { ChangePasswordException } from '@domain/user/exceptions/user.exceptions';
import { getUserCommandRepositoryMocking } from '@/__tests__/application/helpers/repository-mocking.helpers';
import {
    getPasswordCipherMocking,
    getPasswordValidatorServiceMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';

describe('ChangePasswordUseCase', () => {
    let useCase: ChangePasswordUseCase;
    let mockUserCommandRepository: jest.Mocked<UserCommandRepositoryPort>;
    let mockPasswordCipher: jest.Mocked<PasswordCipherPort>;
    let mockPasswordValidatorService: jest.Mocked<PasswordValidatorPort>;

    beforeEach(() => {
        mockUserCommandRepository = getUserCommandRepositoryMocking();
        mockPasswordCipher = getPasswordCipherMocking();
        mockPasswordValidatorService = getPasswordValidatorServiceMocking();

        mockPasswordCipher.encrypt.mockImplementation(value => {
            return `encrypted:${value}`;
        });

        useCase = new ChangePasswordUseCase(
            mockUserCommandRepository,
            mockPasswordValidatorService,
            mockPasswordCipher
        );
    });

    describe('정상 변경', () => {
        it('현재 비밀번호가 맞고, 비밀번호 유효성이 전부 통과한다면 성공한다.', async () => {
            // Give
            mockPasswordValidatorService.passwordDifferentValidate.mockReturnValue(
                true
            );

            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'Abcd1234!',
            };

            // When
            const result = await useCase.execute(dto);

            // Then
            expect(
                mockPasswordValidatorService.passwordDifferentValidate
            ).toHaveBeenCalledTimes(1);
            expect(
                mockUserCommandRepository.changePassword
            ).toHaveBeenCalledTimes(1);

            expect(result).toBeTruthy();
        });
    });

    describe('변경 실패', () => {
        it('바꾸려하는 비밀번호와 현재 비밀번호가 같을 경우 에러가 발생한다.', async () => {
            // Give
            mockPasswordValidatorService.passwordDifferentValidate.mockReturnValue(
                false
            );
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234!',
                newPassword: 'Abcd1234!',
            };

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(
                ChangePasswordException
            );
            expect(
                mockPasswordValidatorService.passwordDifferentValidate
            ).toHaveBeenCalledTimes(1);
            expect(
                mockUserCommandRepository.changePassword
            ).toHaveBeenCalledTimes(0);
        });

        it('Use Case 내 도메인 호출 과정에서 예외가 발생하면, 예외가 그대로 전파되어야 한다.', async () => {
            // Given
            const dto = {
                userId: '836397c9-06ae-4fe0-82ec-5bd7d1f22700',
                currentPassword: 'Abcd1234@',
                newPassword: 'test1234!',
            };

            mockUserCommandRepository.changePassword.mockRejectedValue(
                new Error()
            );

            // When & Then
            await expect(useCase.execute(dto)).rejects.toThrow(Error);
        });
    });
});
