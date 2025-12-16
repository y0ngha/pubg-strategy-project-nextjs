import { UserId } from '@/domain/shared/value-objects/user-id';
import { User } from '../entities/user.entity';
import { Email } from '@/domain/shared/value-objects/email';

export interface UserRepository {
    save(user: User): Promise<User>;

    findByUserId(id: UserId): Promise<User | null>;

    delete(id: UserId): Promise<void>;

    existsByEmail(email: Email): Promise<boolean>;
}
