import { inject, injectable } from 'inversify';
import {
    UpdateCommentPositionRequestDto,
    UpdateCommentPositionRequestSchema,
} from '@/application/strategy/dto/comment/update-comment-position.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateCommentPositionCommand } from '@domain/strategy/commands/comment/update-comment-position.command';

@injectable()
export class UpdateCommentPositionUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateCommentPositionRequestDto) {
        const { strategyId, commentId, position, isParent } =
            UpdateCommentPositionRequestSchema.parse(dto);

        const command = UpdateCommentPositionCommand.create(
            strategyId,
            commentId,
            position,
            isParent
        );

        await this.strategyCommandRepositoryPort.updateCommentPosition(command);

        return {
            id: commentId.toString(),
            position: { x: position.x, y: position.y },
        };
    }
}
