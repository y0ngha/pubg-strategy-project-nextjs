import { inject, injectable } from 'inversify';
import {
    UpdateWaypointPositionsRequestDto,
    UpdateWaypointPositionsRequestSchema,
} from '@/application/strategy/dto/waypoint/update-waypoint-positions.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateWaypointPositionsCommand } from '@domain/strategy/commands/waypoint/update-waypoint-positions.command';

@injectable()
export class UpdateWaypointPositionsUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateWaypointPositionsRequestDto) {
        const { strategyId, teamPlayerId, waypointId, positions } =
            UpdateWaypointPositionsRequestSchema.parse(dto);

        const command = UpdateWaypointPositionsCommand.create(
            strategyId,
            teamPlayerId,
            waypointId,
            positions
        );

        await this.strategyCommandRepositoryPort.updateWaypointPositions(
            command
        );

        return {
            teamPlayerId: teamPlayerId.toString(),
            positions: positions.values.map(position => {
                return {
                    x: position.x,
                    y: position.y,
                };
            }),
        };
    }
}
