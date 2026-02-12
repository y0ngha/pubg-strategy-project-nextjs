import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import { inject, injectable } from 'inversify';
import {
    LoginWithGoogleRequestDto,
    LoginWithGoogleRequestSchema,
} from '../dto/login-with-google.dto';
import { LoginWithGoogleCommand } from '@domain/user/commands/login-with-google.command';

@injectable()
export class LoginWithGoogleUseCase {
    constructor(
        @inject(GoogleAuthServicePort)
        private readonly googleAuthService: GoogleAuthServicePort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(
        dto: LoginWithGoogleRequestDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { email, token } = LoginWithGoogleRequestSchema.parse(dto);

        // this.googleAuthService.getToken()

        const command = LoginWithGoogleCommand.create(email, token);

        return await this.authenticationService.googleLogin(command);
    }
}
