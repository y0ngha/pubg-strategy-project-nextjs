import { inject, injectable } from 'inversify';
import {
    DeleteMarkerRequestDto,
    DeleteMarkerRequestSchema,
} from '@/application/strategy/dto/marker/delete-marker.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteMarkerCommand } from '@domain/strategy/commands/marker/delete-marker.command';

@injectable()
export class DeleteMarkerUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteMarkerRequestDto) {
        const { strategyId, teamPlayerId, markerId } =
            DeleteMarkerRequestSchema.parse(dto);

        const command = DeleteMarkerCommand.create(
            strategyId,
            teamPlayerId,
            markerId
        );

        await this.strategyCommandRepository.deleteMarker(command);

        return {
            teamPlayerId: teamPlayerId.toString(),
            markerId: markerId.toString(),
        };
    }
}
