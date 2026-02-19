import { inject, injectable } from 'inversify';
import {
    UpdateTagPositionRequestDto,
    UpdateTagPositionRequestSchema,
} from '@/application/strategy/dto/tag/update-tag-position.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateTagPositionCommand } from '@domain/strategy/commands/tag/update-tag-position.command';

@injectable()
export class UpdateTagPositionUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateTagPositionRequestDto) {
        const { strategyId, tagId, position } =
            UpdateTagPositionRequestSchema.parse(dto);

        const command = UpdateTagPositionCommand.create(
            strategyId,
            tagId,
            position
        );

        await this.strategyCommandRepository.updateTagPosition(command);

        return {
            id: tagId.toString(),
            position: {
                x: position.x,
                y: position.y,
            },
        };
    }
}
