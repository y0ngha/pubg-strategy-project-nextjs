import { UserId } from '@domain/shared/value-objects/user-id';
import { User } from '../../models/user.model';

export abstract class UserQueryRepositoryPort {
    abstract findByUserId(id: UserId): Promise<User | null>;

    abstract findByAccessToken(accessToken?: string): Promise<User | null>;
}
