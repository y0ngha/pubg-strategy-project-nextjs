import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { inject, injectable } from 'inversify';
import {
    CreateCircleRequestDto,
    CreateCircleRequestSchema,
} from '@/application/strategy/dto/circle/create-circle.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class CreateCircleUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: CreateCircleRequestDto) {
        const { actorId, strategyId, phase, position } =
            CreateCircleRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const circle = strategy.addCircle(actorId, phase, position);

        await this.strategyRepository.save(strategy);

        return {
            id: circle.id.toString(),
            centerPosition: {
                x: circle.centerPosition.x,
                y: circle.centerPosition.y,
            },
            phase: circle.phase.toString(),
            radius: circle.phase.radius,
            color: circle.phase.color,
        };
    }
}
