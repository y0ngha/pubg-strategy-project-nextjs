import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';

import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    AddAirplanePathRequestDto,
    AddAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/add-airplane-path.dto';

@injectable()
export class AddAirplanePathUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: AddAirplanePathRequestDto): Promise<boolean> {
        const { actorId, strategyId, startPosition, endPosition } =
            AddAirplanePathRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addAirplanePath(actorId, startPosition, endPosition);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
