import { inject, injectable } from 'inversify';
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
import { Email } from '@domain/shared/value-objects/email';
import { PasswordValidatorPort } from '@domain/user/port/in/password-validator.port';

@injectable()
export class ChangePasswordUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort,
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(PasswordValidatorPort)
        private readonly passwordValidator: PasswordValidatorPort
    ) {}

    async execute(dto: ChangePasswordRequestDto): Promise<boolean> {
        const { userId, currentPassword, newPassword } =
            ChangePasswordRequestSchema.parse(dto);

        const user = await this.userRepository.findByUserId(userId);

        if (!user) {
            throw new UserNotFoundException(userId.toString());
        }

        if (user.password) {
            this.ensurePasswordMatches(user.password, currentPassword);
            this.ensurePasswordIsDifferent(currentPassword, newPassword);
        }

        this.ensurePasswordEmailValidate(user.email, newPassword);

        const encryptedNewPassword = Password.reconstruct(
            this.passwordCipher.encrypt(newPassword.toString())
        );

        user.changePassword(encryptedNewPassword);

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

    private ensurePasswordEmailValidate(email: Email, password: Password) {
        if (!this.passwordValidator.emailIncludedValidate(email, password)) {
            throw new InvalidPasswordException(
                '신규 비밀번호에 이메일이 포함될 수 없습니다.'
            );
        }
    }

    private ensurePasswordMatches(
        userPassword: Password,
        currentPassword: Password
    ): void {
        if (
            !this.passwordValidator.passwordMatchValidate(
                userPassword,
                currentPassword
            )
        ) {
            throw new ChangePasswordException(
                '현재 비밀번호가 일치하지 않습니다.'
            );
        }
    }

    private ensurePasswordIsDifferent(
        currentPassword: Password,
        newPassword: Password
    ): void {
        if (
            !this.passwordValidator.passwordDifferentValidate(
                currentPassword,
                newPassword
            )
        ) {
            throw new ChangePasswordException(
                '기존 비밀번호와 새로운 비밀번호는 일치할 수 없습니다.'
            );
        }
    }
}
