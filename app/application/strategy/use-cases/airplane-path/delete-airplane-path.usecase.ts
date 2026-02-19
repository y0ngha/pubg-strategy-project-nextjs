import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import {
    DeleteAirplanePathRequestDto,
    DeleteAirplanePathRequestSchema,
} from '@/application/strategy/dto/airplane-path/delete-airplane-path.dto';
import { DeleteAirplanePathCommand } from '@domain/strategy/commands/airplane-path/delete-airplane-path.command';

@injectable()
export class DeleteAirplanePathUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteAirplanePathRequestDto) {
        const { strategyId, airplanePathId } =
            DeleteAirplanePathRequestSchema.parse(dto);

        const command = DeleteAirplanePathCommand.create(
            strategyId,
            airplanePathId
        );

        await this.strategyCommandRepository.deleteAirplanePath(command);

        return {
            airplanePathId: airplanePathId.toString(),
        };
    }
}
