import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { ChangePasswordException } from '@domain/user/exceptions/user.exceptions';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import {
    getPasswordCipherMocking,
    getPasswordValidatorServiceMocking,
} from '@/__tests__/application/helpers/service-mocking.helpers';
import { Password } from '@domain/user/value-objects/password';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';

describe('ChangePasswordCommand', () => {
    let passwordValidator: jest.Mocked<PasswordValidatorPort>;
    let passwordCipher: jest.Mocked<PasswordCipherPort>;

    const currentPassword = Password.create('Abcd1234@');

    beforeEach(() => {
        passwordValidator = getPasswordValidatorServiceMocking();
        passwordCipher = getPasswordCipherMocking();

        passwordCipher.encrypt.mockImplementation((value: string) => {
            return `encrypted:${value}`;
        });
    });

    it('기존 비밀번호와 새 비밀번호가 다르면 생성된다.', () => {
        // given
        passwordValidator.passwordDifferentValidate.mockReturnValue(true);
        const newPassword = Password.create('Asdf1234@');

        // when
        const command = ChangePasswordCommand.create(
            currentPassword,
            newPassword,
            passwordValidator,
            passwordCipher
        );

        expect(command.currentPassword.toString()).toEqual(
            `encrypted:${currentPassword.toString()}`
        );
        expect(command.newPassword.toString()).toEqual(
            `encrypted:${newPassword.toString()}`
        );
    });

    it('기존 비밀번호와 새 비밀번호가 같으면 에러를 던진다', () => {
        expect(() => {
            // given
            passwordValidator.passwordDifferentValidate.mockReturnValue(false);
            const newPassword = Password.create('Abcd1234@');

            // when & then
            expect(
                ChangePasswordCommand.create(
                    currentPassword,
                    newPassword,
                    passwordValidator,
                    passwordCipher
                )
            ).toThrow(ChangePasswordException);
        });
    });
});
