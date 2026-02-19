import { inject, injectable } from 'inversify';
import {
    DeleteCircleRequestDto,
    DeleteCircleRequestSchema,
} from '@/application/strategy/dto/circle/delete-circle.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteCircleCommand } from '@domain/strategy/commands/circle/delete-circle.command';

@injectable()
export class DeleteCircleUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteCircleRequestDto) {
        const { strategyId, circleId } = DeleteCircleRequestSchema.parse(dto);

        const command = DeleteCircleCommand.create(strategyId, circleId);

        await this.strategyCommandRepositoryPort.deleteCircle(command);

        return {
            circleId: circleId.toString(),
        };
    }
}
