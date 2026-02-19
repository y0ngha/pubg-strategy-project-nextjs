import { inject, injectable } from 'inversify';
import {
    CreateCircleRequestDto,
    CreateCircleRequestSchema,
} from '@/application/strategy/dto/circle/create-circle.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateCircleCommand } from '@domain/strategy/commands/circle/create-circle.command';
import {
    CIRCLE_COLOR_MAP,
    CIRCLE_RADIUS_MAP,
} from '@domain/strategy/constants/circle-phase.constants';

@injectable()
export class CreateCircleUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateCircleRequestDto) {
        const { strategyId, phase, position } =
            CreateCircleRequestSchema.parse(dto);

        const command = CreateCircleCommand.create(strategyId, phase, position);

        const circle =
            await this.strategyCommandRepository.createCircle(command);

        return {
            id: circle.id.toString(),
            centerPosition: {
                x: circle.centerPosition.x,
                y: circle.centerPosition.y,
            },
            phase: circle.phase,
            radius: CIRCLE_RADIUS_MAP[circle.phase],
            color: CIRCLE_COLOR_MAP[circle.phase],
        };
    }
}
