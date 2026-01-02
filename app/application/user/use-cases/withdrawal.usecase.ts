import { inject, injectable } from 'inversify';
import {
    WithdrawalRequestDto,
    WithdrawalRequestSchema,
} from '@/application/user/dto/withdrawal.dto';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { AuthenticationServicePort } from '@domain/user/port/out/authentication-service.port';

@injectable()
export class WithdrawalUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort,
        @inject(AuthenticationServicePort)
        private readonly authenticationService: AuthenticationServicePort
    ) {}

    async execute(dto: WithdrawalRequestDto): Promise<boolean> {
        const { id } = WithdrawalRequestSchema.parse(dto);

        await this.authenticationService.logout(id);

        await this.userRepository.delete(id);

        return true;
    }
}
