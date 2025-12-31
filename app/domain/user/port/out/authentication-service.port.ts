import { Email } from '@/domain/shared/value-objects/email';
import { Password } from '../../value-objects/password';
import { UserId } from '@/domain/shared/value-objects/user-id';

export abstract class AuthenticationServicePort {
    abstract login(email: Email, password: Password): Promise<boolean>;

    abstract googleLogin(email: Email, token: string): Promise<boolean>;

    abstract logout(userId: UserId): Promise<boolean>;
}
