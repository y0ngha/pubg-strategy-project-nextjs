import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import {
    UpdateAirplanePathRequestDto,
    UpdateAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/update-airplane-path.dto';
import { UpdateAirplanePathPositionCommand } from '@domain/strategy/commands/airplane-path/update-airplane-path-position.command';

@injectable()
export class UpdateAirplanePathUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateAirplanePathRequestDto) {
        const { strategyId, airplanePathId, startPosition, endPosition } =
            UpdateAirplanePathRequestSchema.parse(dto);

        const command = UpdateAirplanePathPositionCommand.create(
            strategyId,
            airplanePathId,
            startPosition,
            endPosition
        );

        await this.strategyCommandRepository.updateAirplanePathPosition(
            command
        );

        return {
            startPosition: {
                x: startPosition.x,
                y: startPosition.y,
            },
            endPosition: {
                x: endPosition.x,
                y: endPosition.y,
            },
        };
    }
}
