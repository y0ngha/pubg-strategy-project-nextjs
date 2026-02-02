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
        );

        if (!waypoint) {
            throw new Error(
                '알 수 없는 이유로 웨이포인트 수정에 실패했습니다.'
            );
        }

        await this.strategyRepository.save(strategy);

        return {
            teamPlayerId: teamPlayerId.toString(),
            positions: waypoint.positions,
        };
    }
}
