import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import {
    UpdateEnemyTeamPositionRequestDto,
    UpdateEnemyTeamPositionRequestSchema,
} from '@/application/strategy/dto/enemy-team/update-enemy-team-position.dto';
import { UpdateEnemyTeamPositionCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-position.command';

@injectable()
export class UpdateEnemyTeamPositionUsecase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateEnemyTeamPositionRequestDto) {
        const { strategyId, enemyTeamId, position } =
            UpdateEnemyTeamPositionRequestSchema.parse(dto);

        const command = UpdateEnemyTeamPositionCommand.create(
            strategyId,
            enemyTeamId,
            position
        );

        await this.strategyCommandRepository.updateEnemyTeamPosition(command);

        return {
            id: enemyTeamId.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
        };
    }
}
