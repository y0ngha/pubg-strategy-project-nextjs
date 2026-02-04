import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    MoveTeamPlayerRequestDto,
    MoveTeamPlayerRequestSchema,
} from '@/application/strategy/dto/team-player/move-team-player.dto';

@injectable()
export class MoveTeamPlayerUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: MoveTeamPlayerRequestDto) {
        const { actorId, strategyId, teamPlayerId, position } =
            MoveTeamPlayerRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const teamPlayer = strategy.updateTeamPlayerPosition(
            actorId,
            teamPlayerId,
            position
        );

        await this.strategyRepository.save(strategy);

        return {
            id: teamPlayer.id.toString(),
            position: {
                x: teamPlayer.position.x,
                y: teamPlayer.position.y,
            },
        };
    }
}
