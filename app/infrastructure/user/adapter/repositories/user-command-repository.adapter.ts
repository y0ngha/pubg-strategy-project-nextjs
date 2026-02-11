import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { User } from '@domain/user/models/user.model';

export class UserCommandRepositoryAdapter extends UserCommandRepositoryPort {
    async changePassword(command: ChangePasswordCommand): Promise<User> {
        // TODO 나중에 보낼 때 여기서 password encrypt 후 보내도록 해야함.

        throw new Error('Method not implemented.');
    }
}
