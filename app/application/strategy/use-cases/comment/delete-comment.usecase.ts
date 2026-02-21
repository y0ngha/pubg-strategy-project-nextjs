import { inject, injectable } from 'inversify';
import {
    DeleteCommentRequestDto,
    DeleteCommentRequestSchema,
} from '@/application/strategy/dto/comment/delete-comment.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteCommentCommand } from '@domain/strategy/commands/comment/delete-comment.command';

@injectable()
export class DeleteCommentUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteCommentRequestDto) {
        const { strategyId, commentId } = DeleteCommentRequestSchema.parse(dto);

        const command = DeleteCommentCommand.create(strategyId, commentId);

        await this.strategyCommandRepositoryPort.deleteComment(command);

        return {
            commentId: commentId.toString(),
        };
    }
}
