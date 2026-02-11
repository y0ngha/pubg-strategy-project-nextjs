import { inject, injectable } from 'inversify';
import {
    ChangePasswordRequestDto,
    ChangePasswordRequestSchema,
} from '@/application/user/dto/change-password.dto';
import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';

@injectable()
export class ChangePasswordUseCase {
    constructor(
        @inject(UserCommandRepositoryPort)
        private readonly userCommandRepository: UserCommandRepositoryPort,
        @inject(PasswordValidatorPort)
        private readonly passwordValidator: PasswordValidatorPort
    ) {}

    async execute(dto: ChangePasswordRequestDto): Promise<boolean> {
        const { currentPassword, newPassword } =
            ChangePasswordRequestSchema.parse(dto);

        const command = ChangePasswordCommand.create(
            currentPassword,
            newPassword,
            this.passwordValidator
        );

        await this.userCommandRepository.changePassword(command);

        return true;
    }
}
