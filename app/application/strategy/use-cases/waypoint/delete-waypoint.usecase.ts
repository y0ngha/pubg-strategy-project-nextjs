import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    DeleteWaypointRequestDto,
    DeleteWaypointRequestSchema,
} from '@/application/strategy/dto/waypoint/delete-waypoint.dto';

@injectable()
export class DeleteWaypointUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteWaypointRequestDto): Promise<boolean> {
        const { actorId, strategyId, teamPlayerId } =
            DeleteWaypointRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeTeamPlayerWaypoint(actorId, teamPlayerId);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
