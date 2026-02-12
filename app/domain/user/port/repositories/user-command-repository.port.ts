import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { User } from '@domain/user/models/user.model';
import { RegisterWithEmailCommand } from '@domain/user/commands/register-with-email.command';
import { RegisterWithGoogleCommand } from '@domain/user/commands/register-with-google.command';
import { WithdrawalCommand } from '@domain/user/commands/withdrawal.command';

export abstract class UserCommandRepositoryPort {
    abstract changePassword(command: ChangePasswordCommand): Promise<User>;

    abstract registerWithEmail(
        command: RegisterWithEmailCommand
    ): Promise<User>;

    abstract registerWithGoogle(
        command: RegisterWithGoogleCommand
    ): Promise<User>;

    abstract withdrawal(command: WithdrawalCommand): Promise<boolean>;
}
