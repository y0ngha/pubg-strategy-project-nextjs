import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import {
    AddAirplanePathRequestDto,
    AddAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/add-airplane-path.dto';
import { CreateAirplanePathCommand } from '@domain/strategy/commands/airplane-path/create-airplane-path.command';

@injectable()
export class AddAirplanePathUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: AddAirplanePathRequestDto) {
        const { strategyId, startPosition, endPosition } =
            AddAirplanePathRequestSchema.parse(dto);

        const command = CreateAirplanePathCommand.create(
            strategyId,
            startPosition,
            endPosition
        );

        const airplanePath =
            await this.strategyCommandRepository.createAirplanePath(command);

        return {
            id: airplanePath.id.toString(),
            startPosition: {
                x: airplanePath.startPosition.x,
                y: airplanePath.startPosition.y,
            },
            endPosition: {
                x: airplanePath.endPosition.x,
                y: airplanePath.endPosition.y,
            },
        };
    }
}
