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

    async execute(dto: AddMarkerRequestDto): Promise<boolean> {
        const { actorId, strategyId, teamPlayerId, position } =
            AddMarkerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addTeamPlayerMarker(actorId, teamPlayerId, position);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
