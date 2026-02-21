import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateCommentContentCommand } from '@domain/strategy/commands/comment/update-comment-content.command';
import {
    UpdateCommentContentRequestDto,
    UpdateCommentContentRequestSchema,
} from '@/application/strategy/dto/comment/update-comment-content.dto';

@injectable()
export class UpdateCommentContentUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateCommentContentRequestDto) {
        const { strategyId, commentId, content } =
            UpdateCommentContentRequestSchema.parse(dto);

        const command = UpdateCommentContentCommand.create(
            strategyId,
            commentId,
            content
        );

        await this.strategyCommandRepositoryPort.updateCommentContent(command);

        return {
            id: commentId.toString(),
            content: content.toString(),
        };
    }
}
