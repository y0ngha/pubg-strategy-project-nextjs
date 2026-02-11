import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';

export class LoginWithEmailCommand {
    private constructor(
        public readonly email: Email,
        public readonly password: Password
    ) {}

    static create(
        email: Email,
        password: Password,
        passwordCipher: PasswordCipherPort
    ): LoginWithEmailCommand {
        const encryptedPassword = Password.reconstruct(
            passwordCipher.encrypt(password.toString())
        );

        return new LoginWithEmailCommand(email, encryptedPassword);
    }
}
