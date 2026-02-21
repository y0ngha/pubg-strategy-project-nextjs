import { inject, injectable } from 'inversify';
import {
    UpdateMarkerRequestDto,
    UpdateMarkerRequestSchema,
} from '@/application/strategy/dto/marker/update-marker.dto';
import { UpdateMarkerPositionCommand } from '@domain/strategy/commands/marker/update-marker-position.command';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';

@injectable()
export class UpdateMarkerPositionUsecase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateMarkerRequestDto) {
        const { strategyId, teamPlayerId, markerId, position } =
            UpdateMarkerRequestSchema.parse(dto);

        const command = UpdateMarkerPositionCommand.create(
            strategyId,
            teamPlayerId,
            markerId,
            position
        );

        await this.strategyCommandRepository.updateMarkerPosition(command);

        return {
            teamPlayerId: teamPlayerId.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
        };
    }
}
