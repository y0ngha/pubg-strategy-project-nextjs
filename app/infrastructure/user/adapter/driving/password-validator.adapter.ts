import { injectable } from 'inversify';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { Password } from '@domain/user/value-objects/password';

@injectable()
export class PasswordValidatorAdapter extends PasswordValidatorPort {
    passwordDifferentValidate(
        oldPassword: Password,
        newPassword: Password
    ): boolean {
        return !oldPassword.equals(newPassword);
    }
}
