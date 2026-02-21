import {
    LoginWithEmailRequestDto,
    LoginWithEmailRequestSchema,
} from '@/application/user/dto/login-with-email.dto';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { inject, injectable } from 'inversify';
import { LoginWithEmailCommand } from '@domain/user/commands/login-with-email.command';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';

@injectable()
export class LoginWithEmailUseCase {
    constructor(
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort,
        @inject(UserQueryRepositoryPort)
        private readonly userQueryRepositoryPort: UserQueryRepositoryPort
    ) {}

    async execute(dto: LoginWithEmailRequestDto) {
        const { email, password } = LoginWithEmailRequestSchema.parse(dto);

        const command = LoginWithEmailCommand.create(
            email,
            password,
            this.passwordCipher
        );

        const token = await this.authenticationService.login(command);

        const user = await this.userQueryRepositoryPort.findByAccessToken(
            token.accessToken
        );

        if (user === null) {
            throw new UserNotFoundException();
        }

        return {
            ...token,
            user: { id: user.id, email: user.email },
        };
    }
}
