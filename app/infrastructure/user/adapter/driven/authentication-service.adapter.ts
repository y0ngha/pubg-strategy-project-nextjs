import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { LogoutCommand } from '@domain/user/commands/logout.command';
import { LoginWithEmailCommand } from '@domain/user/commands/login-with-email.command';
import { LoginWithGoogleCommand } from '@domain/user/commands/login-with-google.command';

export class AuthenticationServiceAdapter extends AuthenticationServicePort {
    googleLogin(command: LoginWithGoogleCommand): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        throw new Error('Not Implemented.');
    }

    login(
        command: LoginWithEmailCommand
    ): Promise<{ accessToken: string; refreshToken: string }> {
        throw new Error('Not Implemented.');
    }

    async logout(command: LogoutCommand): Promise<boolean> {
        throw new Error('Not Implemented.');
    }
}
