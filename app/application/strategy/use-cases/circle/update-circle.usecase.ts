import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { inject, injectable } from 'inversify';
import {
    UpdateCircleRequestDto,
    UpdateCircleRequestSchema,
} from '@/application/strategy/dto/circle/update-circle.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class UpdateCircleUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateCircleRequestDto): Promise<boolean> {
        const { actorId, strategyId, circleId, phase, centerPosition } =
            UpdateCircleRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.updateCircle(actorId, circleId, centerPosition, phase);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
