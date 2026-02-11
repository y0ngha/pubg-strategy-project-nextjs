import { LogoutCommand } from '@domain/user/commands/logout.command';
import { LoginWithEmailCommand } from '@domain/user/commands/login-with-email.command';
import { LoginWithGoogleCommand } from '@domain/user/commands/login-with-google.command';

export abstract class AuthenticationServicePort {
    abstract login(
        command: LoginWithEmailCommand
    ): Promise<{ accessToken: string; refreshToken: string }>;

    abstract googleLogin(
        command: LoginWithGoogleCommand
    ): Promise<{ accessToken: string; refreshToken: string }>;

    abstract logout(command: LogoutCommand): Promise<boolean>;
}
