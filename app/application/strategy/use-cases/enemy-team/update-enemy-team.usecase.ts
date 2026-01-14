import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    UpdateEnemyTeamRequestDto,
    UpdateEnemyTeamRequestSchema,
} from '@/application/strategy/dto/enemy-team/update-enemy-team.dto';

@injectable()
export class UpdateEnemyTeamUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateEnemyTeamRequestDto): Promise<boolean> {
        const { actorId, strategyId, enemyTeamId, teamLabel, position } =
            UpdateEnemyTeamRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.updateEnemyTeam(actorId, enemyTeamId, teamLabel, position);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
