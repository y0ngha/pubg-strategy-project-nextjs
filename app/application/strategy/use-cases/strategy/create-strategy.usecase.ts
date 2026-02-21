import { inject, injectable } from 'inversify';
import {
    CreateStrategyRequestDto,
    CreateStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/create-strategy.dto';
import { CreateStrategyCommand } from '@domain/strategy/commands/strategy/create-strategy.command';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';

@injectable()
export class CreateStrategyUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateStrategyRequestDto) {
        const { title, map } = CreateStrategyRequestSchema.parse(dto);

        const command = CreateStrategyCommand.create(title, map);

        const strategy =
            await this.strategyCommandRepositoryPort.createStrategy(command);

        return {
            id: strategy.id,
            title: strategy.title,
            map: strategy.map,
        };
    }
}
