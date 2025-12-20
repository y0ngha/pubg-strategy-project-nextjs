import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '../entities/user.entity';
import { Email } from '@/domain/shared/value-objects/email';

export abstract class UserRepositoryPort {
    abstract save(user: User): Promise<User>;

    abstract findByUserId(id: UserId): Promise<User | null>;

    abstract delete(id: UserId): Promise<void>;

    abstract existsByEmail(email: Email): Promise<boolean>;
}
