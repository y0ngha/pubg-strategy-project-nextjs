import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateTagContentCommand } from '@domain/strategy/commands/tag/update-tag-content.command';
import {
    UpdateTagContentRequestDto,
    UpdateTagContentRequestSchema,
} from '@/application/strategy/dto/tag/update-tag-content.dto';

@injectable()
export class UpdateTagContentUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepository: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateTagContentRequestDto) {
        const { strategyId, tagId, content } =
            UpdateTagContentRequestSchema.parse(dto);

        const command = UpdateTagContentCommand.create(
            strategyId,
            tagId,
            content
        );

        await this.strategyCommandRepository.updateTagContent(command);

        return {
            id: tagId.toString(),
            content: content.toString(),
        };
    }
}
