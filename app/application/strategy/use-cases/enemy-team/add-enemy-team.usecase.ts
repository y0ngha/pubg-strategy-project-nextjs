import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    AddEnemyTeamRequestDto,
    AddEnemyTeamRequestSchema,
} from '@/application/strategy/dto/enemy-team/add-enemy-team.dto';

@injectable()
export class AddEnemyTeamUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: AddEnemyTeamRequestDto): Promise<boolean> {
        const { actorId, strategyId, teamLabel } =
            AddEnemyTeamRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addEnemyTeam(actorId, teamLabel);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
