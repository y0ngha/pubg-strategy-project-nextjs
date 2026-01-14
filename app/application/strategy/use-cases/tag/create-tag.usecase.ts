import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    CreateTagRequestDto,
    CreateTagRequestSchema,
} from '@/application/strategy/dto/tag/create-tag.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class CreateTagUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: CreateTagRequestDto): Promise<boolean> {
        const { actorId, strategyId, content } =
            CreateTagRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addTag(actorId, content);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
