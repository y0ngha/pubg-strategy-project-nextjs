import { inject, injectable } from 'inversify';
import {
    UpdateStrategyRequestDto,
    UpdateStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/update-strategy.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateStrategyTitleCommand } from '@domain/strategy/commands/strategy/update-strategy-title.command';

@injectable()
export class UpdateStrategyTitleUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateStrategyRequestDto) {
        const { strategyId, title } = UpdateStrategyRequestSchema.parse(dto);

        const command = UpdateStrategyTitleCommand.create(strategyId, title);

        await this.strategyCommandRepositoryPort.updateStrategyTitle(command);

        return {
            strategyId: strategyId.toString(),
            title: title.toString(),
        };
    }
}
