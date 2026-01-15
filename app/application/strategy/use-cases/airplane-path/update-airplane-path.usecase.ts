import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';

import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    UpdateAirplanePathRequestDto,
    UpdateAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/update-airplane-path.dto';

@injectable()
export class UpdateAirplanePathUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateAirplanePathRequestDto): Promise<boolean> {
        const { actorId, strategyId, startPosition, endPosition } =
            UpdateAirplanePathRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.updateAirplanePath(actorId, startPosition, endPosition);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
