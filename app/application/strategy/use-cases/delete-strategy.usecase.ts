import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeleteStrategyRequestDto,
    DeleteStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/delete-strategy.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class DeleteStrategyUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteStrategyRequestDto): Promise<boolean> {
        const { actorId, strategyId } = DeleteStrategyRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.delete(actorId);

        await this.strategyRepository.delete(strategyId);

        return true;
    }
}
