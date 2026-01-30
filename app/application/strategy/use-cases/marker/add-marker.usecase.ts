import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    AddMarkerRequestDto,
    AddMarkerRequestSchema,
} from '@/application/strategy/dto/marker/add-marker.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class AddMarkerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: AddMarkerRequestDto) {
        const { actorId, strategyId, teamPlayerId, position } =
            AddMarkerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const marker = strategy.addTeamPlayerMarker(
            actorId,
            teamPlayerId,
            position
        );

        await this.strategyRepository.save(strategy);

        return {
            id: marker.id.toString(),
            teamPlayerId: teamPlayerId.toString(),
            position: {
                x: marker.position.x,
                y: marker.position.y,
            },
        };
    }
}
