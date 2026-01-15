import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    DeleteTeamPlayerRequestDto,
    DeleteTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/delete-team-player.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class DeleteTeamPlayerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteTeamPlayerRequestDto): Promise<boolean> {
        const { actorId, strategyId, teamPlayerId } =
            DeleteTeamPlayerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeTeamPlayer(actorId, teamPlayerId);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
