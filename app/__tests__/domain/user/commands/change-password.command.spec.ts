import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { ChangePasswordException } from '@domain/user/exceptions/user.exceptions';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { getPasswordValidatorServiceMocking } from '@/__tests__/application/helpers/service-mocking.helpers';
import { Password } from '@domain/user/value-objects/password';

describe('ChangePasswordCommand', () => {
    let passwordValidator: jest.Mocked<PasswordValidatorPort>;

    const currentPassword = Password.create('Abcd1234@');

    beforeEach(() => {
        passwordValidator = getPasswordValidatorServiceMocking();
    });

    it('기존 비밀번호와 새 비밀번호가 다르면 생성된다.', () => {
        // given
        passwordValidator.passwordDifferentValidate.mockReturnValue(true);
        const newPassword = Password.create('Asdf1234@');

        // when
        const command = ChangePasswordCommand.create(
            currentPassword,
            newPassword,
            passwordValidator
        );

        expect(command.newPassword).toEqual(newPassword);
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
                    passwordValidator
                )
            ).toThrow(ChangePasswordException);
        });
    });
});
