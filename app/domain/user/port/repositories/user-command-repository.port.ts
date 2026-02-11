import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { User } from '@domain/user/models/user.model';

export abstract class UserCommandRepositoryPort {
    abstract changePassword(command: ChangePasswordCommand): Promise<User>;
}
