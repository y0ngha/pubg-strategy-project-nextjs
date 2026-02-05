import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeleteMarkerRequestDto,
    DeleteMarkerRequestSchema,
} from '@/application/strategy/dto/marker/delete-marker.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class DeleteMarkerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteMarkerRequestDto) {
        const { actorId, strategyId, teamPlayerId, markerId } =
            DeleteMarkerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeTeamPlayerMarker(actorId, teamPlayerId, markerId);

        await this.strategyRepository.save(strategy);

        return {
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
        };
    }
}
