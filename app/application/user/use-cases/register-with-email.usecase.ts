import { User } from '@/domain/user/entities/user.entity';
import { UserRepository } from '@/domain/user/port/user.repository';
import { PasswordValidatorService } from '@/domain/user/services/password-validator.service';
import { inject } from 'inversify';
import {
    RegisterWithEmailRequestObject,
    RegisterWithEmailRequestSchema,
    RegisterWithEmailResponseObject,
} from '../dto/register-with-email.dto';
import {
    EmailAlreadyExistsException,
    InvalidPasswordException,
} from '@/domain/user/exceptions/user.exceptions';

export class RegisterWithEmailUseCase {
    constructor(
        @inject(UserRepository)
        private readonly userRepository: UserRepository,
        @inject(PasswordValidatorService)
        private readonly passwordValidatorService: PasswordValidatorService
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

        const user = User.createWithEmail(email, password);

        const savedUser = await this.userRepository.save(user);

        return {
            id: savedUser.id.toString(),
            email: savedUser.email.toString(),
        };
    }
}
