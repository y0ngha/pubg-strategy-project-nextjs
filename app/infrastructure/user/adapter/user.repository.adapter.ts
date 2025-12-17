import { Email } from '@/domain/shared/value-objects/email';
import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '@/domain/user/entities/user.entity';
import { UserRepository } from '@/domain/user/port/user.repository';

export class UserRepositoryAdapter extends UserRepository {
    async save(user: User): Promise<User> {
        throw new Error('Method not implemented.');
    }

    async findByUserId(id: UserId): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    async delete(id: UserId): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async existsByEmail(email: Email): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
