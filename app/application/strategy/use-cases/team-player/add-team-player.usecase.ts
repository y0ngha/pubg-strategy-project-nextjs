import { inject, injectable } from 'inversify';
import {
    AddTeamPlayerRequestDto,
    AddTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/add-team-player.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateTeamPlayerCommand } from '@domain/strategy/commands/team-player/create-team-player.command';
import { TEAM_PLAYER_COLOR_MAP } from '@domain/strategy/constants/team-player.constants';

@injectable()
export class AddTeamPlayerUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: AddTeamPlayerRequestDto) {
        const { strategyId, position } = AddTeamPlayerRequestSchema.parse(dto);

        const command = CreateTeamPlayerCommand.create(strategyId, position);

        const teamPlayer =
            await this.strategyCommandRepositoryPort.createTeamPlayer(command);

        return {
            id: teamPlayer.id.toString(),
            color: TEAM_PLAYER_COLOR_MAP[teamPlayer.priority],
            priority: teamPlayer.priority,
            position: {
                x: teamPlayer.position.x,
                y: teamPlayer.position.y,
            },
        };
    }
}
