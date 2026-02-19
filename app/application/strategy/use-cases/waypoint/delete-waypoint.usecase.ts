import { inject, injectable } from 'inversify';
import {
    DeleteWaypointRequestDto,
    DeleteWaypointRequestSchema,
} from '@/application/strategy/dto/waypoint/delete-waypoint.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteWaypointCommand } from '@domain/strategy/commands/waypoint/delete-waypoint.command';

@injectable()
export class DeleteWaypointUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteWaypointRequestDto) {
        const { strategyId, teamPlayerId, waypointId } =
            DeleteWaypointRequestSchema.parse(dto);

        const command = DeleteWaypointCommand.create(
            strategyId,
            teamPlayerId,
            waypointId
        );

        await this.strategyCommandRepositoryPort.deleteWaypoint(command);

        return {
            teamPlayerId: teamPlayerId.toString(),
            waypointId: waypointId.toString(),
        };
    }
}
