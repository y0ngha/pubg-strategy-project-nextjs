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

    async execute(dto: CreateTagRequestDto) {
        const { actorId, strategyId, content, position } =
            CreateTagRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const tag = strategy.addTag(actorId, content, position);

        await this.strategyRepository.save(strategy);

        return {
            id: tag.id.toString(),
            position: {
                x: tag.position.x,
                y: tag.position.y,
            },
            content: tag.content.toString(),
        };
    }
}
