import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { Password } from '@/domain/user/value-objects/password';

export class AuthenticationServiceAdapter extends AuthenticationServicePort {
    async login(email: Email, password: Password): Promise<boolean> {
        throw new Error('Not Implemented.');
    }

    async logout(userId: UserId): Promise<boolean> {
        throw new Error('Not Implemented.');
    }

    async googleLogin(email: Email, token: string): Promise<boolean> {
        throw new Error('Not Implemented.');
    }
}
