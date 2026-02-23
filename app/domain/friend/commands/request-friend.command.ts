import { Email } from '@domain/shared/value-objects/email';

export class RequestFriendCommand {
    private constructor(public readonly email: Email) {}

    static create(email: Email) {
        return new RequestFriendCommand(email);
    }
}
