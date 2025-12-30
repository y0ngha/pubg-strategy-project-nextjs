import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { inject } from 'inversify';
import { LogoutRequestObject } from '../dto/logout.dto';

export class LogoutUseCase {
    constructor(
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LogoutRequestObject): Promise<boolean> {
        const { userId } = dto;

        return await this.authenticationService.logout(userId);
    }
}
