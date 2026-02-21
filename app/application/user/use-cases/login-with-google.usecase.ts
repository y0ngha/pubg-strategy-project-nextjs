import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import { inject, injectable } from 'inversify';
import {
    LoginWithGoogleRequestDto,
    LoginWithGoogleRequestSchema,
} from '../dto/login-with-google.dto';
import { LoginWithGoogleCommand } from '@domain/user/commands/login-with-google.command';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';

@injectable()
export class LoginWithGoogleUseCase {
    constructor(
        @inject(GoogleAuthServicePort)
        private readonly googleAuthService: GoogleAuthServicePort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort,
        @inject(UserQueryRepositoryPort)
        private readonly userQueryRepositoryPort: UserQueryRepositoryPort
    ) {}

    async execute(dto: LoginWithGoogleRequestDto) {
        const { email, googleToken } = LoginWithGoogleRequestSchema.parse(dto);

        // this.googleAuthService.getToken()

        const command = LoginWithGoogleCommand.create(email, googleToken);

        const token = await this.authenticationService.googleLogin(command);

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
