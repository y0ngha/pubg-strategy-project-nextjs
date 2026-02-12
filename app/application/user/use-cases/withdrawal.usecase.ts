import { inject, injectable } from 'inversify';
import { WithdrawalCommand } from '@domain/user/commands/withdrawal.command';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';

@injectable()
export class WithdrawalUseCase {
    constructor(
        @inject(UserCommandRepositoryPort)
        private readonly userCommandRepository: UserCommandRepositoryPort
    ) {}

    async execute(): Promise<boolean> {
        const command = WithdrawalCommand.create();

        await this.userCommandRepository.withdrawal(command);

        return true;
    }
}
