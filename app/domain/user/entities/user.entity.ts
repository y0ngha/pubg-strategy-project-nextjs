import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { Password } from '../value-objects/password';
import { AuthProvider } from '../enums/auth-provider.enum';

export class User {
    private constructor(
        public readonly id: UserId,
        public readonly email: Email,
        private _password: Password | null,
        public readonly authProvider: AuthProvider,
        public readonly createdAt: Date,
        private _updatedAt: Date
    ) {}

    get password(): Password | null {
        return this._password;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    static createWithEmail(email: Email, password: Password): User {
        return new User(
            UserId.generate(),
            email,
            password,
            AuthProvider.EMAIL,
            new Date(),
            new Date()
        );
    }

    static createWithSSO(email: Email): User {
        return new User(
            UserId.generate(),
            email,
            null,
            AuthProvider.GOOGLE,
            new Date(),
            new Date()
        );
    }

    static reconstruct(
        id: UserId,
        email: Email,
        password: Password | null,
        authProvider: AuthProvider,
        createdAt: Date,
        updatedAt: Date
    ): User {
        return new User(
            id,
            email,
            password,
            authProvider,
            createdAt,
            updatedAt
        );
    }

    changePassword(newPassword: Password): void {
        this._password = newPassword;
        this._updatedAt = new Date();
    }

    isSSOUser(): boolean {
        return this.authProvider != AuthProvider.EMAIL;
    }

    equals(other: User): boolean {
        if (!(other instanceof User)) {
            return false;
        }

        if (this.id == null || other.id == null) {
            return false;
        }

        return this.id.equals(other.id);
    }

    toJSON() {
        return {
            id: this.id?.toString(),
            email: this.email.toString(),
            authProvider: this.authProvider.toString(),
            hasPassword: this.hasPassword(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
        };
    }

    hasPassword(): boolean {
        return this._password != null;
    }
}
