import { Password } from '@domain/user/value-objects/password';
import { ChangePasswordException } from '@domain/user/exceptions/user.exceptions';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';

export class ChangePasswordCommand {
    private constructor(
        public readonly currentPassword: Password,
        public readonly newPassword: Password
    ) {}

    static create(
        currentPassword: Password,
        newPassword: Password,
        passwordValidator: PasswordValidatorPort
    ): ChangePasswordCommand {
        this.ensurePasswordIsDifferent(
            currentPassword,
            newPassword,
            passwordValidator
        );

        return new ChangePasswordCommand(currentPassword, newPassword);
    }

    private static ensurePasswordIsDifferent(
        currentPassword: Password,
        newPassword: Password,
        passwordValidator: PasswordValidatorPort
    ): void {
        if (
            !passwordValidator.passwordDifferentValidate(
                currentPassword,
                newPassword
            )
        ) {
            throw new ChangePasswordException(
                '기존 비밀번호와 새로운 비밀번호는 일치할 수 없습니다.'
            );
        }
    }
}
