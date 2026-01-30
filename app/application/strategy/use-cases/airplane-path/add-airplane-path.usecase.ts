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

    async execute(dto: AddAirplanePathRequestDto) {
        const { actorId, strategyId, startPosition, endPosition } =
            AddAirplanePathRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const airplanePath = strategy.addAirplanePath(
            actorId,
            startPosition,
            endPosition
        );

        await this.strategyRepository.save(strategy);

        return {
            id: airplanePath.id.toString(),
            startPosition: {
                x: airplanePath.startPosition.x,
                y: airplanePath.startPosition.y,
            },
            endPosition: {
                x: airplanePath.endPosition.x,
                y: airplanePath.endPosition.y,
            },
        };
    }
}
