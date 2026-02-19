import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateEnemyTeamLabelCommand } from '@domain/strategy/commands/enemy-team/update-enemy-team-label.command';
import {
    UpdateEnemyTeamLabelRequestDto,
    UpdateEnemyTeamLabelRequestSchema,
} from '@/application/strategy/dto/enemy-team/update-enemy-team-label.dto';

@injectable()
export class UpdateEnemyTeamLabelUsecase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateEnemyTeamLabelRequestDto) {
        const { strategyId, enemyTeamId, teamLabel } =
            UpdateEnemyTeamLabelRequestSchema.parse(dto);

        const command = UpdateEnemyTeamLabelCommand.create(
            strategyId,
            enemyTeamId,
            teamLabel
        );

        await this.strategyCommandRepository.updateEnemyTeamLabel(command);

        return {
            id: enemyTeamId.toString(),
            teamLabel: teamLabel.toString(),
        };
    }
}
