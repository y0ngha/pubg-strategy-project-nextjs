import { Password } from '@domain/user/value-objects/password';

export abstract class PasswordValidatorPort {
    abstract passwordDifferentValidate(
        oldPassword: Password,
        newPassword: Password
    ): boolean;
}
