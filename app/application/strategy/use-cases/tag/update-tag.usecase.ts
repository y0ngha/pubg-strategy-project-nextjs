import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    UpdateTagRequestDto,
    UpdateTagRequestSchema,
} from '@/application/strategy/dto/tag/update-tag.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class UpdateTagUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateTagRequestDto) {
        const { actorId, strategyId, tagId, content, position } =
            UpdateTagRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const tag = strategy.updateTag(actorId, tagId, content, position);

        await this.strategyRepository.save(strategy);

        return {
            id: tag.id.toString(),
            content: tag.content.toString(),
            position: {
                x: tag.position.x,
                y: tag.position.y,
            },
        };
    }
}
