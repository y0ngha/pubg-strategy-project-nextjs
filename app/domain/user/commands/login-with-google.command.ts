import { Email } from '@domain/shared/value-objects/email';

export class LoginWithGoogleCommand {
    private constructor(
        public readonly email: Email,
        public readonly token: string
    ) {}

    static create(email: Email, token: string): LoginWithGoogleCommand {
        return new LoginWithGoogleCommand(email, token);
    }
}
