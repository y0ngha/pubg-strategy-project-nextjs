import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import {
    DeleteEnemyTeamRequestDto,
    DeleteEnemyTeamRequestSchema,
} from '@/application/strategy/dto/enemy-team/delete-enemy-team.dto';
import { DeleteEnemyTeamCommand } from '@domain/strategy/commands/enemy-team/delete-enemy-team.command';

@injectable()
export class DeleteEnemyTeamUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteEnemyTeamRequestDto) {
        const { strategyId, enemyTeamId } =
            DeleteEnemyTeamRequestSchema.parse(dto);

        const command = DeleteEnemyTeamCommand.create(strategyId, enemyTeamId);

        await this.strategyCommandRepository.deleteEnemyTeam(command);

        return {
            enemyTeamId: enemyTeamId.toString(),
        };
    }
}
