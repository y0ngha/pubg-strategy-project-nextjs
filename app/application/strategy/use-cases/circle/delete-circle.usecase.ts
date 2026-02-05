import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { inject, injectable } from 'inversify';
import {
    DeleteCircleRequestDto,
    DeleteCircleRequestSchema,
} from '@/application/strategy/dto/circle/delete-circle.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class DeleteCircleUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteCircleRequestDto) {
        const { actorId, strategyId, circleId } =
            DeleteCircleRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeCircle(actorId, circleId);

        await this.strategyRepository.save(strategy);

        return {
            circleId: circleId.toString(),
        };
    }
}
