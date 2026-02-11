import { Email } from '@domain/shared/value-objects/email';

export class RegisterWithGoogleCommand {
    private constructor(
        public readonly email: Email,
        public readonly token: string
    ) {}

    static create(email: Email, token: string): RegisterWithGoogleCommand {
        return new RegisterWithGoogleCommand(email, token);
    }
}
