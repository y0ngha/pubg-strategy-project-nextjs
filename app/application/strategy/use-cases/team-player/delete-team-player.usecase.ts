import { inject, injectable } from 'inversify';
import {
    DeleteTeamPlayerRequestDto,
    DeleteTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/delete-team-player.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteTeamPlayerCommand } from '@domain/strategy/commands/team-player/delete-team-player.command';

@injectable()
export class DeleteTeamPlayerUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteTeamPlayerRequestDto) {
        const { strategyId, teamPlayerId } =
            DeleteTeamPlayerRequestSchema.parse(dto);

        const command = DeleteTeamPlayerCommand.create(
            strategyId,
            teamPlayerId
        );

        await this.strategyCommandRepositoryPort.deleteTeamPlayer(command);

        return {
            teamPlayerId: teamPlayerId.toString(),
        };
    }
}
