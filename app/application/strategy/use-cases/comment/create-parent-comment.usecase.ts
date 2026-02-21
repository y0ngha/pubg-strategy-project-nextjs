import { inject, injectable } from 'inversify';
import {
    CreateParentCommentRequestDto,
    CreateParentCommentRequestSchema,
} from '@/application/strategy/dto/comment/create-parent-comment.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateParentCommentCommand } from '@domain/strategy/commands/comment/create-parent-comment.command';

@injectable()
export class CreateParentCommentUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateParentCommentRequestDto) {
        const { strategyId, position, content } =
            CreateParentCommentRequestSchema.parse(dto);

        const command = CreateParentCommentCommand.create(
            strategyId,
            position,
            content
        );

        const comment =
            await this.strategyCommandRepositoryPort.createParentComment(
                command
            );

        return {
            id: comment.id.toString(),
            position: { x: position.x, y: position.y },
            authorId: comment.authorId.toString(),
            authorEmail: comment.authorEmail.toString(),
            content: comment.content.toString(),
            parentCommentId: null,
            createdAt: comment.createdAt,
            isAuthor: comment.isAuthor,
            isParent: comment.isParent,
        };
    }
}
