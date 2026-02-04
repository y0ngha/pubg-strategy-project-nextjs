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

    async execute(dto: UpdateCircleRequestDto) {
        const { actorId, strategyId, circleId, phase, centerPosition } =
            UpdateCircleRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const circle = strategy.updateCircle(
            actorId,
            circleId,
            centerPosition,
            phase
        );

        await this.strategyRepository.save(strategy);

        return {
            id: circle.id.toString(),
            phase: circle.phase.toNumber(),
            centerPosition: {
                x: circle.centerPosition.x,
                y: circle.centerPosition.y,
            },
            radius: circle.phase.radius,
            color: circle.phase.color,
        };
    }
}
