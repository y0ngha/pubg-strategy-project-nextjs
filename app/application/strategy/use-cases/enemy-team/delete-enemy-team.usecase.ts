import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    DeleteEnemyTeamRequestDto,
    DeleteEnemyTeamRequestSchema,
} from '@/application/strategy/dto/enemy-team/delete-enemy-team.dto';

@injectable()
export class DeleteEnemyTeamUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteEnemyTeamRequestDto) {
        const { actorId, strategyId, enemyTeamId } =
            DeleteEnemyTeamRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeEnemyTeam(actorId, enemyTeamId);

        await this.strategyRepository.save(strategy);

        return {
            enemyTeamId: enemyTeamId.toString(),
        };
    }
}
