import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    AddTeamPlayerRequestDto,
    AddTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/add-team-player.dto';

@injectable()
export class AddTeamPlayerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: AddTeamPlayerRequestDto): Promise<boolean> {
        const { actorId, strategyId } = AddTeamPlayerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.addTeamPlayer(actorId);

        await this.strategyRepository.save(strategy);

        return true;
    }
}
