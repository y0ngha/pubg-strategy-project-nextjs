import {
    LoginWithEmailRequestDto,
    LoginWithEmailRequestSchema,
} from '@/application/user/dto/login-with-email.dto';
import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { PasswordCipherPort } from '@/domain/user/port/out/password-cipher.port';
import { Password } from '@/domain/user/value-objects/password';
import { inject, injectable } from 'inversify';

@injectable()
export class LoginWithEmailUseCase {
    constructor(
        @inject(PasswordCipherPort)
        private readonly passwordCipher: PasswordCipherPort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LoginWithEmailRequestDto): Promise<boolean> {
        const { email, password } = LoginWithEmailRequestSchema.parse(dto);

        const encryptedPassword = Password.reconstruct(
            this.passwordCipher.encrypt(password.toString())
        );

        return await this.authenticationService.login(email, encryptedPassword);
    }
}
