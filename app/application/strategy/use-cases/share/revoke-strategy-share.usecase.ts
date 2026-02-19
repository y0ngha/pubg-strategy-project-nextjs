import { inject, injectable } from 'inversify';
import {
    RevokeStrategyShareRequestDto,
    RevokeStrategyShareRequestSchema,
} from '@/application/strategy/dto/share/revoke-strategy-share.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteStrategyShareCommand } from '@domain/strategy/commands/strategy-share/delete-strategy-share.command';

@injectable()
export class RevokeStrategyShareUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: RevokeStrategyShareRequestDto): Promise<boolean> {
        const { strategyId, strategyShareId } =
            RevokeStrategyShareRequestSchema.parse(dto);

        const command = DeleteStrategyShareCommand.create(
            strategyId,
            strategyShareId
        );

        await this.strategyCommandRepositoryPort.deleteStrategyShare(command);

        return true;
    }
}
