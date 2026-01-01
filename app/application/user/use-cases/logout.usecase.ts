import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { inject } from 'inversify';
import { LogoutRequestDto, LogoutRequestSchema } from '../dto/logout.dto';

export class LogoutUseCase {
    constructor(
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LogoutRequestDto): Promise<boolean> {
        const { userId } = LogoutRequestSchema.parse(dto);

        return await this.authenticationService.logout(userId);
    }
}
