import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    UpdateStrategyRequestDto,
    UpdateStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/update-strategy.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class UpdateStrategyUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateStrategyRequestDto) {
        const { actorId, strategyId, title, map } =
            UpdateStrategyRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const updatedStrategy = strategy.update(actorId, title, map);

        await this.strategyRepository.save(strategy);

        return {
            title: updatedStrategy.title.toString(),
            map: updatedStrategy.map,
        };
    }
}
