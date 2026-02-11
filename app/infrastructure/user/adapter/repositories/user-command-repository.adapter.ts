import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { User } from '@domain/user/models/user.model';
import { RegisterWithEmailCommand } from '@domain/user/commands/register-with-email.command';
import { RegisterWithGoogleCommand } from '@domain/user/commands/register-with-google.command';
import { WithdrawalCommand } from '@domain/user/commands/withdrawal.command';

export class UserCommandRepositoryAdapter extends UserCommandRepositoryPort {
    async changePassword(command: ChangePasswordCommand): Promise<User> {
        throw new Error('Method not implemented.');
    }

    registerWithEmail(command: RegisterWithEmailCommand): Promise<User> {
        throw new Error('Method not implemented.');
    }

    registerWithGoogle(command: RegisterWithGoogleCommand): Promise<User> {
        throw new Error('Method not implemented.');
    }

    withdrawal(command: WithdrawalCommand): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
