import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeleteTagRequestDto,
    DeleteTagRequestSchema,
} from '@/application/strategy/dto/tag/delete-tag.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class DeleteTagUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteTagRequestDto) {
        const { actorId, strategyId, tagId } =
            DeleteTagRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeTag(actorId, tagId);

        await this.strategyRepository.save(strategy);

        return {
            tagId: tagId.toString(),
        };
    }
}
