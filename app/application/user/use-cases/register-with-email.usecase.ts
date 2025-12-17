import { User } from '@/domain/user/entities/user.entity';
import {
    EmailAlreadyExistsException,
    InvalidPasswordException,
} from '@/domain/user/exceptions/user.exceptions';
import { PasswordCipherPort } from '@/domain/user/port/password-cipher.port';
import { UserRepository } from '@/domain/user/port/user.repository';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { Password } from '@/domain/user/value-objects/password';
import { inject } from 'inversify';
import {
    RegisterWithEmailRequestObject,
    RegisterWithEmailResponseObject,
} from '../dto/register-with-email.dto';

export class RegisterWithEmailUseCase {
    constructor(
        @inject(UserRepository)
        private readonly userRepository: UserRepository,
        @inject(PasswordValidatorService)
        private readonly passwordValidatorService: PasswordValidatorService,
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort
    ) {}

    async execute(
        dto: RegisterWithEmailRequestObject
    ): Promise<RegisterWithEmailResponseObject> {
        const { email, password } = dto;

        const existingUser = await this.userRepository.existsByEmail(email);

        if (existingUser) {
            throw new EmailAlreadyExistsException(email.toString());
        }

        if (!this.passwordValidatorService.validate(email, password)) {
            throw new InvalidPasswordException(
                '비밀번호에 이메일이 포함될 수 없습니다.'
            );
        }

        const encryptedPassword = Password.reconstruct(
            this.passwordCipher.encrypt(password.toString())
        );

        const user = User.createWithEmail(email, encryptedPassword);

        const savedUser = await this.userRepository.save(user);

        return {
            id: savedUser.id.toString(),
            email: savedUser.email.toString(),
        };
    }
}
