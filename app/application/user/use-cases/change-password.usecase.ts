import { inject, injectable } from 'inversify';
import {
    ChangePasswordRequestDto,
    ChangePasswordRequestSchema,
} from '@/application/user/dto/change-password.dto';
import { ChangePasswordCommand } from '@domain/user/commands/change-password.command';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';

@injectable()
export class ChangePasswordUseCase {
    constructor(
        @inject(UserCommandRepositoryPort)
        private readonly userCommandRepository: UserCommandRepositoryPort,
        @inject(PasswordValidatorPort)
        private readonly passwordValidator: PasswordValidatorPort,
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort
    ) {}

    async execute(dto: ChangePasswordRequestDto): Promise<boolean> {
        const { currentPassword, newPassword } =
            ChangePasswordRequestSchema.parse(dto);

        const command = ChangePasswordCommand.create(
            currentPassword,
            newPassword,
            this.passwordValidator,
            this.passwordCipher
        );

        await this.userCommandRepository.changePassword(command);

        return true;
    }
}
