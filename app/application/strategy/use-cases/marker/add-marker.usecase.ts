import { inject, injectable } from 'inversify';
import {
    AddMarkerRequestDto,
    AddMarkerRequestSchema,
} from '@/application/strategy/dto/marker/add-marker.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateMarkerCommand } from '@domain/strategy/commands/marker/create-marker.command';

@injectable()
export class AddMarkerUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: AddMarkerRequestDto) {
        const { strategyId, teamPlayerId, position } =
            AddMarkerRequestSchema.parse(dto);

        const command = CreateMarkerCommand.create(
            strategyId,
            teamPlayerId,
            position
        );

        const marker =
            await this.strategyCommandRepository.createMarker(command);

        return {
            id: marker.id,
            teamPlayerId: teamPlayerId.toString(),
            position: {
                x: marker.position.x,
                y: marker.position.y,
            },
        };
    }
}
