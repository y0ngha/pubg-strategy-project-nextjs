import { Password } from '@domain/user/value-objects/password';
import {
    ChangePasswordException,
    InvalidPasswordException,
} from '@domain/user/exceptions/user.exceptions';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { Email } from '@domain/shared/value-objects/email';

export class ChangePasswordCommand {
    private constructor(
        public readonly currentPassword: Password,
        public readonly newPassword: Password
    ) {}

    static create(
        currentPassword: Password,
        newPassword: Password,
        email: Email,
        passwordValidator: PasswordValidatorPort
    ): ChangePasswordCommand {
        this.ensurePasswordIsDifferent(
            currentPassword,
            newPassword,
            passwordValidator
        );
        this.ensurePasswordEmailValidate(email, newPassword, passwordValidator);

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

    private static ensurePasswordEmailValidate(
        email: Email,
        password: Password,
        passwordValidator: PasswordValidatorPort
    ) {
        if (!passwordValidator.emailIncludedValidate(email, password)) {
            throw new InvalidPasswordException(
                '신규 비밀번호에 이메일이 포함될 수 없습니다.'
            );
        }
    }
}
