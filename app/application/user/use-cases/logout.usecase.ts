import { AuthenticationServicePort } from '@/domain/user/port/out/authentication-service.port';
import { inject, injectable } from 'inversify';
import { LogoutCommand } from '@domain/user/commands/logout.command';

@injectable()
export class LogoutUseCase {
    constructor(
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(): Promise<boolean> {
        const command = LogoutCommand.create();

        return await this.authenticationService.logout(command);
    }
}
