import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { inject, injectable } from 'inversify';
import { LogoutRequestDto, LogoutRequestSchema } from '../dto/logout.dto';

@injectable()
export class LogoutUseCase {
    constructor(
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: LogoutRequestDto): Promise<boolean> {
        const { id } = LogoutRequestSchema.parse(dto);

        return await this.authenticationService.logout(id);
    }
}
