import { inject, injectable } from 'inversify';
import {
    DeleteStrategyRequestDto,
    DeleteStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/delete-strategy.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteStrategyCommand } from '@domain/strategy/commands/strategy/delete-strategy.command';

@injectable()
export class DeleteStrategyUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteStrategyRequestDto) {
        const { strategyId } = DeleteStrategyRequestSchema.parse(dto);

        const command = DeleteStrategyCommand.create(strategyId);

        await this.strategyCommandRepositoryPort.deleteStrategy(command);

        return {
            strategyId: strategyId.toString(),
        };
    }
}
