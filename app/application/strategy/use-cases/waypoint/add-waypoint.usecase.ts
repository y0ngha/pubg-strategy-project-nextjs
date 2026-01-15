import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    AddWaypointRequestDto,
    AddWaypointRequestSchema,
} from '@/application/strategy/dto/waypoint/add-waypoint.dto';

@injectable()
export class AddWaypointUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: AddWaypointRequestDto): Promise<boolean> {
        const { actorId, strategyId, teamPlayerId, positions } =
            AddWaypointRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addTeamPlayerWaypoint(actorId, teamPlayerId, positions);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
