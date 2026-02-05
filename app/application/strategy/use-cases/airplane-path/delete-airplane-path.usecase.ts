import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';

import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    DeleteAirplanePathRequestDto,
    DeleteAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/delete-airplane-path.dto';

@injectable()
export class DeleteAirplanePathUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteAirplanePathRequestDto) {
        const { actorId, strategyId, airplanePathId } =
            DeleteAirplanePathRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeAirplanePath(actorId, airplanePathId);

        await this.strategyRepository.save(strategy);

        return {
            airplanePathId: airplanePathId.toString(),
        };
    }
}
