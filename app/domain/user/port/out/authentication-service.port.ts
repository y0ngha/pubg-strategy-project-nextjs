import { Email } from '@/domain/shared/value-objects/email';
import { Password } from '../../value-objects/password';
import { LogoutCommand } from '@domain/user/commands/logout.command';

export abstract class AuthenticationServicePort {
    abstract login(
        email: Email,
        password: Password
    ): Promise<{ accessToken: string; refreshToken: string }>;

    abstract googleLogin(
        email: Email,
        token: string
    ): Promise<{ accessToken: string; refreshToken: string }>;

    abstract logout(command: LogoutCommand): Promise<boolean>;
}
