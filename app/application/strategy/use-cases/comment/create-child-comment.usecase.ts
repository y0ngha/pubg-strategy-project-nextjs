import { inject, injectable } from 'inversify';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateChildCommentCommand } from '@domain/strategy/commands/comment/create-child-comment.command';
import {
    CreateChildCommentRequestDto,
    CreateChildCommentRequestSchema,
} from '@/application/strategy/dto/comment/create-child-comment.dto';

@injectable()
export class CreateChildCommentUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateChildCommentRequestDto) {
        const { strategyId, parentCommentId, content } =
            CreateChildCommentRequestSchema.parse(dto);

        const command = CreateChildCommentCommand.create(
            strategyId,
            parentCommentId,
            content
        );

        const comment =
            await this.strategyCommandRepositoryPort.createChildComment(
                command
            );

        return {
            id: comment.id.toString(),
            position: null,
            authorId: comment.authorId.toString(),
            authorEmail: comment.authorEmail.toString(),
            content: comment.content.toString(),
            parentCommentId: parentCommentId.toString(),
            createdAt: comment.createdAt,
            isAuthor: comment.isAuthor,
            isParent: comment.isParent,
        };
    }
}
