import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';

export abstract class PasswordValidatorPort {
    abstract emailIncludedValidate(email: Email, password: Password): boolean;

    abstract currentPasswordMatchValidate(
        userPassword: Password,
        password: Password
    ): boolean;

    abstract changePasswordDifferentValidate(
        oldPassword: Password,
        newPassword: Password
    ): boolean;
}
