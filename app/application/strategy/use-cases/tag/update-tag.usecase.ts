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

    async execute(dto: UpdateTagRequestDto): Promise<boolean> {
        const { actorId, strategyId, tagId, content, position } =
            UpdateTagRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        if (content) {
            strategy.updateTagContent(actorId, tagId, content);
        }

        if (position) {
            strategy.updateTagPosition(actorId, tagId, position);
        }

        await this.strategyRepository.save(strategy);

        return true;
    }
}
