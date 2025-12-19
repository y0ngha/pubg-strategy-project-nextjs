import { User } from '@/domain/user/entities/user.entity';
import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserSessionPort } from '@/domain/user/port/user-session.port';

export class UserSessionAdapter extends UserSessionPort {
    private _user: User | null = null;

    getUser(): User {
        if (this._user == null) {
            throw new UserNotFoundException();
        }

        return this._user;
    }

    saveUser(user: User): User {
        this._user = user;
        return this._user;
    }

    clearUser(): void {
        this._user = null;
    }
}
