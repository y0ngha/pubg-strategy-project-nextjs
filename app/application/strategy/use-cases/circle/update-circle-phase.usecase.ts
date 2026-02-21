import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateCirclePhaseCommand } from '@domain/strategy/commands/circle/update-circle-phase.command';
import {
    UpdateCirclePhaseRequestDto,
    UpdateCirclePhaseRequestSchema,
} from '@/application/strategy/dto/circle/update-circle-phase.dto';
import {
    CIRCLE_COLOR_MAP,
    CIRCLE_RADIUS_MAP,
} from '@domain/strategy/constants/circle-phase.constants';

@injectable()
export class UpdateCirclePhaseUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateCirclePhaseRequestDto) {
        const { strategyId, circleId, phase } =
            UpdateCirclePhaseRequestSchema.parse(dto);

        const command = UpdateCirclePhaseCommand.create(
            strategyId,
            circleId,
            phase
        );

        await this.strategyCommandRepositoryPort.updateCirclePhase(command);

        return {
            id: circleId.toString(),
            phase: phase.value,
            radius: CIRCLE_RADIUS_MAP[phase.value],
            color: CIRCLE_COLOR_MAP[phase.value],
        };
    }
}
