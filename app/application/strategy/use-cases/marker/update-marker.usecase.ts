import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    UpdateMarkerRequestDto,
    UpdateMarkerRequestSchema,
} from '@/application/strategy/dto/marker/update-marker.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class UpdateMarkerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateMarkerRequestDto) {
        const { actorId, strategyId, teamPlayerId, markerId, position } =
            UpdateMarkerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const marker = strategy.updateTeamPlayerMarker(
            actorId,
            teamPlayerId,
            markerId,
            position
        )!;

        await this.strategyRepository.save(strategy);

        return {
            teamPlayerId: teamPlayerId.toString(),
            position: {
                x: marker.position.x,
                y: marker.position.y,
            },
        };
    }
}
