import { inject, injectable } from 'inversify';
import {
    UpdateCirclePositionRequestDto,
    UpdateCirclePositionRequestSchema,
} from '@/application/strategy/dto/circle/update-circle-position.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateCirclePositionCommand } from '@domain/strategy/commands/circle/update-circle-position.command';

@injectable()
export class UpdateCirclePositionUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateCirclePositionRequestDto) {
        const { strategyId, circleId, centerPosition } =
            UpdateCirclePositionRequestSchema.parse(dto);

        const command = UpdateCirclePositionCommand.create(
            strategyId,
            circleId,
            centerPosition
        );

        await this.strategyCommandRepositoryPort.updateCirclePosition(command);

        return {
            id: circleId.toString(),
            centerPosition: {
                x: centerPosition.x,
                y: centerPosition.y,
            },
        };
    }
}
