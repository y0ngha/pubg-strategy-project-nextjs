import {
    LoginWithEmailRequestDto,
    LoginWithEmailRequestSchema,
} from '@/application/user/dto/login-with-email.dto';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { Password } from '@/domain/user/value-objects/password';
import { inject, injectable } from 'inversify';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';

@injectable()
export class LoginWithEmailUseCase {
    constructor(
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort,
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(dto: LoginWithEmailRequestDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
        };
    }> {
        const { email, password } = LoginWithEmailRequestSchema.parse(dto);

        const encryptedPassword = Password.reconstruct(
            this.passwordCipher.encrypt(password.toString())
        );

        const tokens = await this.authenticationService.login(
            email,
            encryptedPassword
        );

        const user = await this.userRepository.findByAccessToken(
            tokens.accessToken
        );

        if (!user) {
            throw new UserNotFoundException();
        }

        return {
            ...tokens,
            user: {
                id: user.id.toString(),
                email: user.email.toString(),
            },
        };
    }
}
