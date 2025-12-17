import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '@/domain/user/entities/user.entity';
import { UserRepository } from '@/domain/user/port/user.repository';

export class UserRepositoryAdapter extends UserRepository {
    save(user: User): Promise<User> {
        throw new Error('Method not implemented.');
    }

    findByUserId(id: UserId): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    delete(id: UserId): Promise<void> {
        throw new Error('Method not implemented.');
    }

    existsByEmail(email: Email): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
