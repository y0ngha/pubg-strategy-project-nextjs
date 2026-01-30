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

    async execute(dto: AddEnemyTeamRequestDto) {
        const { actorId, strategyId, teamLabel, position } =
            AddEnemyTeamRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const enemyTeam = strategy.addEnemyTeam(actorId, teamLabel, position);

        await this.strategyRepository.save(strategy);

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
