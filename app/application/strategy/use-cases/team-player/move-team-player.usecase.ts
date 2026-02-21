import { inject, injectable } from 'inversify';
import {
    MoveTeamPlayerRequestDto,
    MoveTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/move-team-player.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateTeamPlayerPositionCommand } from '@domain/strategy/commands/team-player/update-team-player-position.command';

@injectable()
export class MoveTeamPlayerUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: MoveTeamPlayerRequestDto) {
        const { strategyId, teamPlayerId, position } =
            MoveTeamPlayerRequestSchema.parse(dto);

        const command = UpdateTeamPlayerPositionCommand.create(
            strategyId,
            teamPlayerId,
            position
        );

        await this.strategyCommandRepositoryPort.updateTeamPlayerPosition(
            command
        );

        return {
            id: teamPlayerId.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
        };
    }
}
