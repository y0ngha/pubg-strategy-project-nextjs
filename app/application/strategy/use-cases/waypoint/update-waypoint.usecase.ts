import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    UpdateWaypointRequestDto,
    UpdateWaypointRequestSchema,
} from '@/application/strategy/dto/waypoint/update-waypoint.dto';

@injectable()
export class UpdateWaypointUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateWaypointRequestDto) {
        const { actorId, strategyId, teamPlayerId, positions } =
            UpdateWaypointRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const waypoint = strategy.updateTeamPlayerWaypoint(
            actorId,
            teamPlayerId,
            positions
        )!;

        await this.strategyRepository.save(strategy);

        return {
            teamPlayerId: teamPlayerId.toString(),
            positions: waypoint.positions,
        };
    }
}
