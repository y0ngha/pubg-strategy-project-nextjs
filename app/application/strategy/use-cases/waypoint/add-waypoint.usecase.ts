import { inject, injectable } from 'inversify';
import {
    AddWaypointRequestDto,
    AddWaypointRequestSchema,
} from '@/application/strategy/dto/waypoint/add-waypoint.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateWaypointCommand } from '@domain/strategy/commands/waypoint/create-waypoint.command';

@injectable()
export class AddWaypointUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: AddWaypointRequestDto) {
        const { strategyId, teamPlayerId, positions } =
            AddWaypointRequestSchema.parse(dto);

        const command = CreateWaypointCommand.create(
            strategyId,
            teamPlayerId,
            positions
        );

        const waypoint =
            await this.strategyCommandRepository.createWaypoint(command);

        return {
            id: waypoint.id.toString(),
            teamPlayerId: teamPlayerId.toString(),
            positions: waypoint.positions.map(position => {
                return {
                    x: position.x,
                    y: position.y,
                };
            }),
        };
    }
}
