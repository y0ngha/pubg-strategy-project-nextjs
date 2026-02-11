import { Email } from '@domain/shared/value-objects/email';
import { Password } from '@domain/user/value-objects/password';

export class RegisterWithEmailCommand {
    private constructor(
        public readonly email: Email,
        public readonly password: Password
    ) {}

    static create(email: Email, password: Password): RegisterWithEmailCommand {
        return new RegisterWithEmailCommand(email, password);
    }
}
