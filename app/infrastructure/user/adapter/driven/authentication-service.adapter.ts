import { Email } from '@/domain/shared/value-objects/email';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { Password } from '@/domain/user/value-objects/password';
import { LogoutCommand } from '@domain/user/commands/logout.command';

export class AuthenticationServiceAdapter extends AuthenticationServicePort {
    async login(
        email: Email,
        password: Password
    ): Promise<{ accessToken: string; refreshToken: string }> {
        throw new Error('Not Implemented.');
    }

    async logout(command: LogoutCommand): Promise<boolean> {
        throw new Error('Not Implemented.');
    }

    async googleLogin(
        email: Email,
        token: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        throw new Error('Not Implemented.');
    }
}
