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

    async execute(dto: CreateCircleRequestDto): Promise<boolean> {
        const { actorId, strategyId, phase } =
            CreateCircleRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addCircle(actorId, phase);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
