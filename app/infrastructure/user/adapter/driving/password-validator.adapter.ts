import { Email } from '@domain/shared/value-objects/email';
import { inject, injectable } from 'inversify';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { Password } from '@domain/user/value-objects/password';

@injectable()
export class PasswordValidatorAdapter extends PasswordValidatorPort {
    constructor(
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort
    ) {
        super();
    }

    emailIncludedValidate(email: Email, password: Password): boolean {
        return !password.contains(email.localPart);
    }

    passwordMatchValidate(userPassword: Password, password: Password): boolean {
        const decryptedUserPassword = Password.reconstruct(
            this.passwordCipher.decrypt(userPassword.toString())
        );

        return decryptedUserPassword.equals(password);
    }

    passwordDifferentValidate(
        oldPassword: Password,
        newPassword: Password
    ): boolean {
        return !oldPassword.equals(newPassword);
    }
}
