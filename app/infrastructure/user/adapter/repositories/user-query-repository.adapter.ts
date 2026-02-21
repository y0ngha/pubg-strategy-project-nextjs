import { UserId } from '@domain/shared/value-objects/user-id';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { User } from '@domain/user/models/user.model';

export class UserQueryRepositoryAdapter extends UserQueryRepositoryPort {
    async findByUserId(id: UserId): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    async findByAccessToken(accessToken?: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
}
