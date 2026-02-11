import {
    LoginWithEmailRequestDto,
    LoginWithEmailRequestSchema,
} from '@/application/user/dto/login-with-email.dto';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { inject, injectable } from 'inversify';
import { LoginWithEmailCommand } from '@domain/user/commands/login-with-email.command';

@injectable()
export class LoginWithEmailUseCase {
    constructor(
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LoginWithEmailRequestDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const { email, password } = LoginWithEmailRequestSchema.parse(dto);

        const command = LoginWithEmailCommand.create(
            email,
            password,
            this.passwordCipher
        );

        return await this.authenticationService.login(command);
    }
}
