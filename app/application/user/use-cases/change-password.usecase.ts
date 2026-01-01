import { inject } from 'inversify';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { Password } from '@domain/user/value-objects/password';
import {
    ChangePasswordRequestDto,
    ChangePasswordRequestSchema,
} from '@/application/user/dto/change-password.dto';
import { PasswordCipherPort } from '@domain/user/port/out/password-cipher.port';
import {
    ChangePasswordException,
    InvalidPasswordException,
    UserNotFoundException,
} from '@domain/user/exceptions/user.exceptions';
import { PasswordValidatorService } from '@domain/user/services/password-validator.service';

export class ChangePasswordUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort,
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(PasswordValidatorService)
        private readonly passwordValidatorService: PasswordValidatorService
    ) {}

    async execute(dto: ChangePasswordRequestDto): Promise<boolean> {
        const { id, currentPassword, newPassword } =
            ChangePasswordRequestSchema.parse(dto);

        const user = await this.userRepository.findByUserId(id);

        if (!user) {
            throw new UserNotFoundException(id.toString());
        }

        if (!this.passwordValidatorService.validate(user.email, newPassword)) {
            throw new InvalidPasswordException(
                '신규 비밀번호에 이메일이 포함될 수 없습니다.'
            );
        }

        const encryptedCurrentPassword = Password.reconstruct(
            this.passwordCipher.encrypt(currentPassword.toString())
        );

        const encryptedNewPassword = Password.reconstruct(
            this.passwordCipher.encrypt(newPassword.toString())
        );

        user.changePassword(encryptedCurrentPassword, encryptedNewPassword);

        try {
            await this.userRepository.save(user);
            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new ChangePasswordException(error.message);
            }

            throw error;
        }
    }
}
