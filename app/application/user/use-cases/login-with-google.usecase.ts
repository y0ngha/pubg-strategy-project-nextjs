import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { GoogleAuthServicePort } from '@/domain/user/port/out/google-auth-service.port';
import { inject } from 'inversify';
import {
    LoginWithGoogleRequestDto,
    LoginWithGoogleRequestSchema,
} from '../dto/login-with-google.dto';

export class LoginWithGoogleUseCase {
    constructor(
        @inject(GoogleAuthServicePort)
        private readonly googleAuthService: GoogleAuthServicePort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LoginWithGoogleRequestDto): Promise<boolean> {
        const { email, token } = LoginWithGoogleRequestSchema.parse(dto);

        // TODO 이후 googleAuthService 구현시 액션 추가
        // this.googleAuthService.getToken()

        return await this.authenticationService.googleLogin(email, token);
    }
}
