import { inject, injectable } from 'inversify';
import {
    AddEnemyTeamRequestDto,
    AddEnemyTeamRequestSchema,
} from '@/application/strategy/dto/enemy-team/add-enemy-team.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/create-enemy-team.command';

@injectable()
export class AddEnemyTeamUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: AddEnemyTeamRequestDto) {
        const { strategyId, teamLabel, position } =
            AddEnemyTeamRequestSchema.parse(dto);

        const command = CreateEnemyTeamCommand.create(
            strategyId,
            teamLabel,
            position
        );

        const enemyTeam =
            await this.strategyCommandRepository.createEnemyTeam(command);

        return {
            id: enemyTeam.id.toString(),
            teamLabel: enemyTeam.teamLabel.toString(),
            position: {
                x: enemyTeam.position.x,
                y: enemyTeam.position.y,
            },
        };
    }
}
